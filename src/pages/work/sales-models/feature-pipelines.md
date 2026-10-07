---
layout: ../../../layouts/Article.astro
project: sales-models
slug: feature-pipelines
title: "What did the model actually know at the time?"
dek: "Following an order from the source system into training and live recommendations, including the awkward case where the record arrives late."
---

I built point-in-time feature pipelines for the recommendation platform, using as-of joins and embargo gaps to prevent future information from leaking into evaluation. An as-of join reconstructs the relevant historical state; an embargo leaves a gap around evaluation boundaries where overlapping information could make a test misleading. The late-order example below develops the data-design questions behind that work.

A customer places an order on Monday. The recommendation platform does not receive the record until Wednesday, but a salesperson used its suggestions on Tuesday. Months later, we rebuild the training data and join that Monday order to the customer's history, which can make Tuesday's recommendation appear better informed than it actually was.

The dates all look reasonable until we ask a more precise question: are we reconstructing what happened in the business, or what the platform could have known when it made the decision? Both histories can be useful, but using one while claiming to evaluate the other gives us misleading evidence about model quality.

## Keeping two kinds of time

I would preserve the business event time and the time the record became available to the feature pipeline. An order's transaction date explains when the business event happened; an availability timestamp explains when the platform could have used the particular record or correction. For an as-served replay, a feature must respect both the decision's business-time cutoff and the availability of its inputs.

A point-in-time join retrieves a historical feature version for a prediction date. It still needs an explicit late-data policy: an event-time condition alone can admit a correction that only arrived later. Feast's documentation describes this distinction and its support for constraining retrieval by a creation timestamp when that timestamp represents actual availability. [Point-in-time joins](https://docs.feast.dev/getting-started/concepts/point-in-time-joins) are a useful reference for the underlying behaviour; the design is not dependent on using Feast.

For the Monday order, Tuesday's as-served feature history would exclude the late record. A corrected business-history dataset could include it, but it would have a different purpose and a distinct version. I would keep that difference in the dataset manifest so a later analyst does not mistake a corrected reconstruction for a record of what the model saw.

<figure class="system-diagram" data-diagram="feature-time" aria-labelledby="feature-time-caption">
<figcaption id="feature-time-caption">An order can happen before the platform knows about it</figcaption>
<details>
<summary>Read the diagram as text</summary>
<p>In this example, the order occurs Monday, a recommendation is made Tuesday, and the record reaches the feature pipeline Wednesday. An as-served Tuesday feature snapshot must exclude that order even though its business date is Monday. Later corrected analysis must use a separately identified dataset.</p>
</details>
</figure>

## Defining the unit before calculating the features

The training row needs to represent a real decision. An account-health example might be one eligible account at a scoring time; a product-ranking example needs an account, a recommendation time and the candidates eligible to be shown together. Without that context, a collection of customer-product rows can look convenient to train on while no longer representing the list a salesperson actually received.

Next, I would write down what the outcome means and when it is mature enough to use. A purchase within a defined future window is different from an eventual order with no time limit, and a young open enquiry is different from a lead whose outcome window has closed. Records whose outcome period is incomplete should not silently become negative examples.

For ranking, an unpurchased product is also not automatically a strong negative. The account may never have seen it, it may have been out of stock, or it may have been placed where the salesperson rarely looked. Eligibility and exposure logs preserve those distinctions, while any sampling strategy needs to state what its negatives actually mean.

## Giving each feature a contract

A feature such as “orders in the last 90 days” sounds simple until different jobs count cancelled orders differently or use different customer identities. I would define the entity key, qualifying events, time window, exclusions, missing-data behaviour and owner alongside the calculation. Changes to those meanings create a new feature version even when the column name would otherwise remain the same.

That contract also describes expected freshness and the response when it is not met. Missing recent-order data must not automatically become zero orders: zero is a business observation, while missing means we do not know. Depending on what was evaluated, the model might accept an explicit missing indicator, use a compatible reduced-input variant, or defer the suggestion.

The source and feature definitions can be shared across training and serving without making every input a live lookup. Slow-moving history can be prepared in batch, while only the small set of features whose freshness changes an interactive decision needs current serving storage. Stock and price remain operational facts that are checked again at commitment, even if recent snapshots were used to create the recommendation.

<figure class="system-diagram" data-diagram="feature-pipeline" aria-labelledby="feature-pipeline-caption">
<figcaption id="feature-pipeline-caption">One feature definition, two different uses</figcaption>
<details>
<summary>Read the diagram as text</summary>
<p>Versioned raw records become cleaned facts retaining event time and availability time. Shared definitions generate historical feature snapshots for training and fresh features for serving. Mature outcomes train models, while current business truth is revalidated separately at commitment.</p>
</details>
</figure>

## Rebuilding history without silently changing the model's world

Raw supplier and business-system extracts should remain identifiable by source and version. Cleaning jobs produce validated facts, and feature jobs produce snapshots tied to their code, definition versions and source snapshots. The model dataset then records which feature and label snapshots it used, along with the eligible population and time windows.

When a bug is found in a calculation, I would write the corrected backfill into a new version and compare it with the previous one. Replacing historical feature values in place would make an old experiment difficult to reproduce and could change the apparent quality of a released model without changing the model itself. An approved backfill needs a deliberate path into a new training run or current feature publication.

Duplicate source events need similar care. An immutable event identity or a reliable source transaction key can prevent a retry from counting one order twice. If a source changes a previous record, its correction needs explicit version semantics rather than being mistaken for a second transaction.

## Checking that training and serving agree

Shared code reduces the chance of disagreement, but I would still test the two paths on matched examples. For the same account, decision time and known input snapshot, compare the offline feature result with the value the serving path would supply, including timezone boundaries, missing fields and late-arriving corrections. A test using today's values on both sides would not establish historical correctness.

The model package needs to declare the feature versions and input schema it expects. If a feature definition changes from ordered quantity to delivered quantity, the service should not accept it merely because the type is still numeric. Schema checks catch the shape of the contract; version and semantic checks catch the meaning.

For the serving store, I would prepare a complete batch under a new snapshot identifier, validate its coverage and freshness, then publish that snapshot as a unit. Incrementally overwriting the current worklist while the job runs can expose a mixture of old and new scores. Readers should either use the completed new snapshot or the previous acceptable one, with its age visible.

## Why this becomes an operating responsibility

A failed feature job needs an owner and a recovery decision before the morning worklist is due. It may be reasonable to keep yesterday's recommendations within an agreed freshness window, while some inputs require the affected path to stop. Those decisions should follow the model and business contracts rather than be improvised from whether the dashboard happens to be green.

For the late Monday order, the value of this design is that we can explain Tuesday's suggestion honestly, correct Wednesday's view, and train the next model on a dataset whose meaning is clear. It gives model evaluation something dependable to stand on and makes a data incident much easier to distinguish from a modelling problem.

[The monitoring article follows that distinction when a quality alert arrives.](/work/sales-models/monitoring/)
