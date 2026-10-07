---
layout: ../../../layouts/Article.astro
project: sales-models
slug: mlops
title: "The model improved. Should we release it?"
dek: "A better test score is encouraging. Before asking salespeople to rely on a new model, I want to understand what changed and how we would know if it was making their work worse."
---

Imagine we've trained a new version of the model that sorts product recommendations for salespeople. In testing, more of the products customers eventually bought appear near the top of the list. After the work of preparing the data and training the model, that is an encouraging result.

Before putting it in front of sales, I would want to understand what sits behind that improvement. The average may have improved while recommendations for a smaller product category got worse. The test might also include information that wouldn't have been available when the recommendation was made.

These are the kinds of questions I deal with in MLOps, which means managing models through training, release and everyday use. On the sales platform, my production work included point-in-time feature pipelines, shadow releases, PSI drift monitoring and thresholds based on business costs. PSI, or Population Stability Index, helps compare how data distributions change between periods.

To show how those pieces fit together, I'll follow this candidate model from its promising test result through to a release decision. The question throughout is whether the people using it would be better off with the change.

## Recreating what the model could have known

Suppose we are evaluating a recommendation made in March, but build its inputs using the customer record as it exists in June. That record may include orders, account changes or other information that arrived after the recommendation date. The model can look impressively accurate because we have inadvertently given it part of the answer.

A point-in-time dataset prevents that by reconstructing the inputs available at each prediction date. The test also needs to respect the way outcomes arrive: if a particular kind of enquiry usually takes weeks to convert, a lead that has been open for two days is not yet a useful example of failure. I would define the observation and outcome windows before choosing the validation split, including how to handle late records and incomplete outcomes.

Those decisions are especially important when different models support different jobs. Reorder timing, lead conversion and long-term customer value cannot all be judged over the same window simply because it is convenient for the training pipeline.

## Looking for the people hidden by the average

Once the dataset is credible, I would compare the candidate with the current model across the customer and product groups that matter to the business. An overall gain deserves closer attention if it comes with a noticeable loss for a priority category or new customers who have little purchase history. The question is whether the trade-off is acceptable and understood, rather than whether one number is higher.

The checks also depend on how the output is used. A ranker needs to order a useful shortlist, while a probability feeding an expected-profit calculation needs to be reasonably calibrated: predictions around a given probability should behave like that probability over enough comparable cases. Catalogue coverage, response time and violations of commercial rules all belong in the evaluation because they affect the experience salespeople receive.

I would keep the candidate's data snapshot, feature definitions, preprocessing, model file and serving image together with those results. That makes it possible to identify exactly what was tested and reproduce the approved combination, instead of deploying a model file alongside slightly different preparation code.

## Letting a candidate earn a wider audience

The first release step can happen without changing what users see. In shadow mode, the candidate receives the same kinds of inputs as the current model, but its suggestions are recorded for comparison rather than displayed to salespeople. This helps expose problems that may not have appeared in the offline test, including missing inputs or an unexpected pattern of recommendations.

After that, I would release to a limited group with stable assignment, so an account is not constantly switching between behaviours. Before the pilot starts, the team needs to agree which changes would stop or reverse it, who is watching those signals and which previous version is available for recovery. Otherwise, an alert can arrive while everyone is still deciding whether it matters.

The reference stack uses MLflow to compare experiments and SageMaker Model Registry to approve production candidates. The practical requirement is that there is one agreed authority for what is approved; experiment tracking and deployment should not quietly disagree about which version is in use.

Approval is also different from readiness to serve. Before routing a pilot to a candidate, I would load its immutable artifact and serving image, check the input schema, and run known requests through the actual prediction path. For batch models, the equivalent check is that the complete output snapshot is present, covers the intended accounts and can be read by the application. A successful training job does not establish any of those things.

The release record needs to connect the model with the feature contract and the decision policy around it. That does not require all nine models to be deployed together, but it does require compatible versions wherever they interact. If the ranker changes the scale of its output, a downstream rule must not continue treating the new score as though its meaning were unchanged.

<figure class="system-diagram" data-diagram="ml-release" aria-labelledby="ml-release-caption">
<figcaption id="ml-release-caption">The path from a trained candidate to a production release</figcaption>
<details>
<summary>Read the diagram as text</summary>
<p>A versioned dataset and feature definitions produce a candidate model. Data, slice, policy and service checks must pass before approval. A pinned release runs in shadow, then a stable pilot. Guardrails determine expansion or restoration of the previous compatible release.</p>
</details>
</figure>

## Monitoring after the answer arrives late

A service can be healthy while its recommendations are becoming less useful. I would watch immediate signals such as errors, missing inputs, stale data and response time, then evaluate prediction quality as the outcomes become available. Sales activity, overrides, margin and customer complaints add evidence about whether the system is helping in practice.

A change in input distributions, often called drift, is a reason to investigate rather than an automatic reason to retrain. A seasonal buying pattern may be expected, while a sudden rise in missing supplier data may indicate a broken pipeline. Training a new model on the second problem could make the situation harder to understand.

## Having somewhere dependable to return to

If a release causes a clear problem, the first response should make the affected workflow usable again. Depending on the issue, that may mean restricting the new behaviour to unaffected categories or restoring the previous compatible model, features, policy and search index. Keeping those versions recorded makes that a controlled action rather than a reconstruction during an incident.

Only after stabilising the service would I decide whether the underlying problem needs new training, better data or a change in the decision rules. Separating those steps gives the team room to investigate and lets sales keep working while the technical issue is resolved.

[The decision-system article explains how those model outputs become something a salesperson can act on.](/work/sales-models/decisions/)

Two further walkthroughs explore [how the feature pipeline reconstructs what was known at the time](/work/sales-models/feature-pipelines/) and [how I would investigate a live recommendation that no longer feels useful](/work/sales-models/monitoring/).
