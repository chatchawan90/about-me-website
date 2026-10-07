---
layout: ../../../layouts/Article.astro
project: sales-models
slug: ""
title: "Helping sales decide who to call and why"
dek: "The recommendation platform brings several models together around a practical question: where should a salesperson spend their time today?"
---

If a salesperson has time for ten calls today, which ten are worth making? A customer may be due to reorder, another may have stopped buying, and a new enquiry may deserve a quick response before it goes cold. Working out the best use of that time involves more than choosing the account with the highest predicted chance of buying something.

I built and deployed a nine-model recommendation platform to help our sales team make those decisions across 3,000 accounts and a catalogue of more than a million sellable products. Some models look at the customer, such as whether their buying behaviour has changed or when they might reorder. Others help find relevant products, put them in a useful order or guide a pricing decision.

I handled the conversations with the teams, implementation and testing, along with product categorisation across the catalogue. Project reporting recorded a 15% reactivation uplift and a 20% reduction in churn. Reactivation concerns customers returning to buy; churn concerns customers leaving or stopping their purchases.

Some of the most useful feedback came from asking salespeople why they overrode the recommendations. I retrained around how orders were actually placed and evaluated changes in shadow mode, where the new model's suggestions could be examined before they changed what people saw. Those conversations helped me understand what a useful recommendation needed to include.

The production work also covered keeping historical training data faithful to what was known at the time, monitoring changes in the data and choosing thresholds based on the business cost of a wrong action. I'll go through those choices in the MLOps articles. First, it helps to look at the decisions the models are supporting.

## Understanding what each prediction is for

A customer who has not ordered recently is a useful place to start. A churn model can identify a change in buying behaviour, but that change does not tell the whole story. The customer may be buying elsewhere, working through a large previous order, or waiting for a project to begin.

Customer value adds another part of the picture, while reorder and category models help estimate what the account might need next. Those outputs become useful when they give the salesperson a reason to investigate, along with enough context to decide whether the suggested action fits the relationship.

There is a further distinction between a customer who is likely to buy and one whose decision might change because we contact them. Uplift modelling tries to estimate that difference. It is a more demanding question because past records show what happened after people acted, but do not automatically reveal what would have happened without the call.

## Finding something relevant to offer

With a large catalogue, scoring every possible product in detail for every customer would create a lot of unnecessary work. A retrieval stage first collects plausible candidates using signals such as previous purchases, category interest and product descriptions. A ranking model then compares that smaller set using more context about the customer and the current opportunity.

That division also makes the system easier to investigate. If the right product never appears in the candidate set, the ranker cannot rescue it. If it appears but is repeatedly pushed below weaker suggestions, the ordering deserves attention.

The platform uses LambdaMART for re-ranking. It is a learning-to-rank method: rather than treating every customer–product pair as an isolated yes-or-no question, it learns how to order a set of candidates. The useful output is a shortlist that fits the customer's context and the salesperson's available time.

Product categorisation helps both stages by making the catalogue easier to understand and search. It also helps with new products that have little purchase history: the system can use what is known about the item while behavioural evidence is still limited.

## Connecting the models without confusing their roles

The nine families cover account health, reactivation, customer value, lead conversion, reorder and category interest, candidate retrieval, product ranking, next-best action, and quote acceptance or pricing. They answer related questions, but their outputs are not interchangeable. A risk score, a ranked list and an estimate of future value each need to be interpreted in the context of a decision.

A separate part of the system brings those outputs together with business rules. It considers whether the product is available, whether the offer meets commercial requirements, whether the customer has already been contacted, and whether the salesperson has capacity to act. Keeping that logic explicit makes it possible to explain why a promising recommendation was deferred or changed.

<details>
<summary>See the nine model families</summary>
<ol>
<li>Churn and account health</li>
<li>Reactivation and uplift</li>
<li>Future gross profit / customer lifetime value</li>
<li>Lead conversion and value</li>
<li>Reorder and category propensity</li>
<li>Hybrid candidate retrieval</li>
<li>Product ranking</li>
<li>Next-best-action policy</li>
<li>Quote acceptance and pricing</li>
</ol>
</details>

## A recommendation has to survive contact with the work

Consider this example: a laboratory has gone longer than usual without reordering, so it appears on the day's list. The salesperson opens the account and sees that an earlier order is still waiting on a supplier. The account may need attention, but a delivery update could be more useful than another sales offer.

In that example, the changed buying pattern still matters. The missing piece is the unfinished order and what it means for the next conversation. This is why I find it useful to sit with salespeople and go through individual suggestions. Their explanation can reveal something an average model score doesn't show.

## Finding out whether it makes a difference

I want to understand the full path from a suggestion to a result: what was shown, whether someone acted on it, what they changed, and what happened after the relevant buying window. That also means paying attention to orders that would have happened anyway, because following a recommendation and then making a sale does not prove the system created the sale.

A suitable comparison group helps estimate the additional value, while margin, customer contact and workload checks keep the result grounded in the business. The goal is to find out whether the platform helps the team use its time better and creates worthwhile opportunities without quietly introducing new costs.

The articles below take a closer look at how I would operate that system, release changes and work through the moments when the recommendations do not fit what salespeople know.

<div class="drill">
<a href="/work/sales-models/mlops/"><b>The model improved. Should we release it?</b><span>Looking beyond a test score to data quality, affected customers and recovery.</span></a>
<a href="/work/sales-models/feature-pipelines/"><b>What did the model actually know at the time?</b><span>Why a Monday order that arrives on Wednesday changes how we build Tuesday's training example.</span></a>
<a href="/work/sales-models/monitoring/"><b>The dashboard is green, but the recommendations feel wrong</b><span>Investigating a sales complaint without immediately assuming the model needs retraining.</span></a>
<a href="/work/sales-models/decisions/"><b>From predictions to decisions</b><span>How the models share work and where the business rules enter the picture.</span></a>
<a href="/work/sales-models/adoption/"><b>The salesperson who ignored the list</b><span>A story about missing context and working through an objection.</span></a>
</div>
