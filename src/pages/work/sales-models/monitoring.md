---
layout: ../../../layouts/Article.astro
project: sales-models
slug: monitoring
title: "The dashboard is green, but the recommendations feel wrong"
dek: "How I would investigate a model in daily use when technical health, prediction quality and the salesperson’s experience tell different stories."
---

Imagine the service is responding quickly, no deployment has failed, and the error dashboard looks normal. Yet salespeople are beginning to reject more recommendations, particularly for one product category. A model dashboard also shows that a recent-purchase feature has shifted, which makes retraining look like a plausible response.

Before starting a training job, I would follow the evidence from the source data to the recommendations people actually saw. A changed distribution can reflect a genuine buying shift, a seasonal pattern or a broken data feed. Those explanations can look similar at first, but replacing the model is only a useful response to some of them.

On the platform, I used PSI, or Population Stability Index, to monitor changes in the data, alongside decision thresholds informed by business costs. PSI helps flag when the values a model receives have shifted compared with an earlier period. The investigation below shows how I would turn that signal into a useful response.

## Checking whether the inputs still mean what we think they mean

I would start with a few practical questions. How old is the data, which fields are missing, and do we still have records for all the accounts and suppliers we expect? A connection can respond successfully while leaving out a supplier's latest records, so I need to check what actually reached the model.

Suppose the investigation finds that recent orders from one source stopped arriving. The aggregation may then show lower activity even though customers are still buying. If missing input is converted to zero, the model receives a perfectly valid number with the wrong business meaning, which explains why a service-level error alert never fired.

The immediate response would be to contain the affected recommendations and repair the feed. A previous compatible snapshot or evaluated fallback may keep some work useful, but only within its freshness limits. I would tell sales which recommendations are affected and how to handle those accounts while the records are reconciled.

## Following one recommendation all the way through

A decision trace should tell us which account and context were evaluated, which candidates were eligible, which feature snapshot and model versions were used, and what the policy removed or changed. It also needs the actual displayed list and reasons. Looking only at the model's raw output can miss a problem introduced later by eligibility rules or the interface.

I would compare rejected suggestions with useful ones from the same period and category. The salesperson's explanation may point to unavailable products, repeated contact or a service issue that never entered the model inputs. That does not make the feedback a perfect training label, but it gives the investigation a concrete place to look.

The trace should also distinguish a recommendation being generated from it being shown. An unused API response is not an impression, and a salesperson opening an account is not evidence that they completed the recommended action. Those differences matter when interpreting adoption and the eventual commercial outcome.

## Separating early signals from outcomes that are still arriving

Input failures and invalid outputs can be acted on immediately. A decline in conversion or customer retention is harder to judge because the relevant buying window may not have closed. I would group recommendations by when they were made and give each group a comparable amount of time for purchases to arrive. Last week's suggestions have had much less time to lead to an order than those made two months ago.

Different models need different checks. For a shortlist, I want to know whether the useful products were found and placed near the top. If a predicted chance of acceptance feeds a profit calculation, I also need to check calibration: whether, across enough comparable cases, offers given a similar probability are accepted about that often. Sales-capacity metrics can be more revealing than a broad average if the team only acts on the first few suggestions.

Each report needs enough examples to support the conclusion, with uncertainty visible where the sample is small. A large relative movement in a tiny product group can be worth investigating without being convincing evidence that the model has broadly deteriorated. I would use leading signals to guide attention while keeping the outcome judgement open until the evidence is ready.

## Deciding which alerts deserve an interruption

An alert should have a defined response. Stale inputs beyond their allowed window, a price-floor violation or a sharp increase in failed decisions may justify immediate action. Gradual drift with stable outcomes may belong in a scheduled review, especially when the change is consistent with an expected seasonal pattern.

For each alert, I would include the affected scope, the first time it appeared, recent changes and a link to representative cases. A named owner needs to know whether they are expected to restore a data feed, restrict a release, or review an emerging performance issue. Repeated alerts without a workable response train the team to ignore the monitoring.

The reference approach uses scheduled data-quality and drift jobs alongside application metrics and business reports. Tools such as Evidently can help compute comparisons, while CloudWatch or Grafana can surface operational signals. Their usefulness depends on the feature definitions, comparison windows and response policy behind the chart; installing a dashboard does not supply those decisions.

## Knowing when the model really is the problem

If the inputs are sound and mature outcomes show a meaningful decline, I would compare the affected segments across model and policy versions. The decline may belong to a particular release, a changed product mix, a decision-rule adjustment or a relationship that the model no longer captures. Restricting one category can be more appropriate than replacing behaviour that remains useful elsewhere.

Retraining then becomes a candidate response with a specific reason: enough new examples, a changed relationship, or an updated business objective. The new model still goes through the normal evaluation and approval process. A retraining trigger should not grant permission to deploy whatever the job produces.

Commercial measurement also needs care. If salespeople change which recommendations they act on, the outcome distribution can move even with identical model behaviour. I would keep a record of what each salesperson saw and keep comparison groups consistent during a test. I would also consider whether groups need to be separated by account, salesperson or territory, because people can carry what they learn from one customer conversation into another.

<figure class="system-diagram" data-diagram="model-investigation" aria-labelledby="model-investigation-caption">
<figcaption id="model-investigation-caption">Investigating a recommendation alert before retraining</figcaption>
<details>
<summary>Read the diagram as text</summary>
<p>Check input health first. Broken inputs need repair or a validated fallback. With healthy inputs, separate immature outcomes from established degradation. Investigate affected segments and model or policy versions; restrict or roll back harmful behaviour and only retrain when evidence supports it.</p>
</details>
</figure>

## Closing the loop with the people who noticed it

After the missing-order feed is repaired, I would validate the corrected snapshots, check the affected worklists and make sure any outstanding customer follow-up is still assigned. The technical fix does not automatically repair the work that happened while the data was incomplete. I would include that follow-up before calling the problem resolved.

I would also return to the salespeople who raised the concern and explain what changed. Their observation helped locate a problem that a healthy API could not reveal, and they need to know whether the same category is now dependable or still under review. The resulting lesson should become a data check, a clearer fallback or a better alert, so the next incident is easier to catch and resolve.

[The release article describes how a replacement model would earn its way back into production.](/work/sales-models/mlops/)
