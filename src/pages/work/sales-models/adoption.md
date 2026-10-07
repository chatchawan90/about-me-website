---
layout: ../../../layouts/Article.astro
project: sales-models
slug: adoption
title: "The salesperson who ignored the list"
dek: "A recommendation can look reasonable in the data and still be the wrong conversation to have with a customer. Understanding the difference means spending time with the person who knows the account."
---

I interviewed sales teams about why they overrode recommendations and retrained around how orders were actually placed. Understanding their reasons helped connect the modelling work to the decisions they faced with customers.

Imagine a salesperson opening the day's recommendations and skipping an account near the top of the list. The account is a laboratory that used to reorder regularly but has not bought anything recently, so the system suggests getting in touch. From the data available to the model, that looks like a sensible use of time.

When asked why they skipped it, the salesperson points to an order that has been waiting on a supplier. They have already spoken with the customer twice about the delay and still do not have a confirmed delivery date. Calling again to suggest another purchase would be an awkward conversation to have before resolving the first one.

The disagreement is useful because both views contain part of the situation. The buying pattern has changed, and the account probably does need attention. What the recommendation misses is why the customer is waiting and what kind of attention would help.

## Starting with examples instead of defending the score

My first step would be to sit with the salesperson and look through a few suggestions they rejected. I would ask them to explain what they would do instead and what information helped them make that choice. That gives us a chance to identify whether the problem lies in the available data, the interpretation, the timing or the way the suggestion is presented.

The examples may turn out to be quite different. One customer buys only when a research project starts, so a long gap is normal; another was contacted yesterday by a colleague; a third may be a worthwhile opportunity that the salesperson simply ranks below something more urgent. Treating all of those rejections as the same kind of negative feedback would make the next model harder to improve.

I would also want to see recommendations the salesperson found useful. That helps avoid redesigning the whole system around a small set of failures and gives us something to preserve while we work on the missing context.

## Following the backorder into the design

In this example, I would trace where the open-order information lives and whether the recommendation process can access it reliably. If the ERP has the outstanding quantity and supplier status, those facts can inform the decision layer without asking the model to infer them from the customer's purchase pattern. The important question becomes how current the record is and what action its state should support.

For this account, the suggested next step could change to following up the supplier and updating the customer. The salesperson would see the relevant order and a reason such as, “The customer's previous order is still awaiting supplier confirmation.” That is enough context to understand why the account appeared, and it connects the recommendation to work they already recognise as necessary.

I would be careful about making the rule too broad. Automatically hiding every account with an open order could remove useful opportunities, especially where the customer buys several unrelated product lines. The change needs to distinguish an unresolved service issue from an ordinary order in progress.

## Working through the manager's concern

The sales manager may see the problem differently. They have invested time in the platform and worry that allowing everyone to ignore suggestions will leave the business with a tool nobody uses. That concern deserves a proper answer, just as the salesperson's concern about the customer relationship does.

I would propose a limited pilot of the revised recommendation, with time set aside for the team to review examples. The technical owner would investigate recurring failure patterns, sales would judge whether the suggestions fit the work, and the manager would help keep the pilot from becoming an extra task people are expected to absorb silently.

The pilot's reporting should distinguish what was shown, what was accepted, what was changed and what was actually done. Opening a page is easy to count, but it does not tell us whether the recommendation helped someone make a better decision. Keeping those stages separate also avoids turning a low acceptance rate into a judgement about the salesperson before we understand the reasons.

## Making feedback useful without making it burdensome

The salesperson needs a quick way to say why a suggestion does not fit. A few well-chosen reasons, with room for a short note when necessary, can give the team something to investigate without asking the user to write a report for every skipped item. When the same reason appears repeatedly, it should lead to a visible follow-up rather than disappear into a dashboard.

Not every override should immediately become a training label. A corrected product identity is different from a one-off commercial exception, and a preference for an existing supplier is different from evidence that another product is unsuitable. I would preserve those distinctions and validate factual corrections before feeding them into evaluation or training.

That follow-through matters for trust as well. If people explain the same problem several times and nothing changes, asking for more feedback becomes difficult to justify. A small change that addresses a specific example gives the team a more concrete reason to stay involved.

## Deciding whether the change helped

For the backorder-aware recommendation, I would first check whether it reduces inappropriate sales suggestions and makes useful follow-up easier. We would also look for worthwhile opportunities that the new rule accidentally suppresses, and allow enough time for the relevant buying outcomes to arrive before judging the commercial effect.

For me, the first useful result would be that the salesperson can open the account and see a next step that makes sense. We would have taken something they knew about the customer and made the system more useful because of it. From there, a suitable comparison can test whether those better decisions also create additional commercial value.

[The MLOps article follows how a change like this would move through evaluation and release.](/work/sales-models/mlops/)
