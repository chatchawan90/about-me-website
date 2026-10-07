---
layout: ../../../layouts/Article.astro
project: sales-models
slug: decisions
title: "How nine models become one useful recommendation"
dek: "The models answer different questions. The system still needs to decide what those answers mean for the salesperson looking at an account."
---

A churn model flags an account, a product ranker finds several relevant items, and a pricing model suggests an offer that might be accepted. Each output can be useful, but putting all three on a screen does not automatically tell the salesperson what to do. Someone still needs to consider whether the customer has already been contacted, whether the products can be supplied, and whether this opportunity deserves attention ahead of the others.

I would make that combining step a visible part of the system. It is where predictions meet the business's current constraints, and it needs to be understandable enough that a sales manager can question a recommendation without having to inspect model code.

## Deciding which rules belong outside the models

Some conditions are not matters of predicted likelihood. A product may be ineligible for a customer, a contract may determine the price, or a proposed discount may require approval. I would keep those conditions in explicit rules so a high model score cannot silently bypass them.

Other constraints change which action is sensible rather than making the whole account irrelevant. Limited stock might defer a product suggestion, and an open backorder might turn a selling opportunity into a service follow-up. Once those constraints are considered, the system can compare the remaining opportunities by weighing what each might be worth, the effort required and the time the team has available.

This separation also helps when the business changes its policy. Adjusting a contact-frequency limit should not require retraining every model, just as retraining a model should not alter the company's approval limits. A record of the model versions, rules, input snapshot and final reason lets the team work out which part produced the decision.

## Working out what really needs a live answer

There are several ways to compute a recommendation, and I would choose between them based on how quickly the underlying situation changes. Account health and longer-term customer value usually do not need to be recalculated every time someone opens the CRM. Preparing those scores in a scheduled job makes them easier to serve consistently and avoids repeating expensive work.

An event can justify a more targeted refresh. If an order is placed or a quote is rejected, the affected account may need an updated suggestion without waiting for the next full batch. A queue can handle that work while the rest of the team continues using the existing results.

Some decisions do need current context because a person is waiting for an answer, such as routing a new lead or evaluating a price during quotation. Those belong on the live request path, with a response-time budget and a defined fallback. This gives the system a mix of scheduled, event-driven and live work without requiring every model to run on every request.

<figure class="system-diagram" data-diagram="decision-paths" aria-labelledby="decision-paths-caption">
<figcaption id="decision-paths-caption">Scheduled, event-driven and live work meet at one decision</figcaption>
<details>
<summary>Read the diagram as text</summary>
<p>Scheduled scoring builds default worklists. Business events trigger refreshes for affected accounts. Live requests read the serving store and compute only the additional context needed. Current eligibility and commercial rules produce the displayed action, while exposure and outcome records support evaluation.</p>
</details>
</figure>

## Deciding how many services the team needs to run

For small models that use similar inputs and have similar operating needs, a shared service can load them together and avoid a sequence of network calls. The reference design uses a combined service on ECS for suitable online models, while scheduled jobs handle the broader population. That is a practical starting point for controlling idle cost and reducing the number of components the team has to look after.

There are good reasons to split a model out later. It may need a different runtime, a GPU, independent scaling or a separate owner. I would preserve a clear interface so that split is possible, then make it when the workload demonstrates the need.

## Reusing catalogue data without confusing two different searches

The sales recommender asks what an account might need next. Its candidate search can use previous purchases, related products and category interest to explore plausible opportunities, and a LambdaMART ranker can learn how to order that shortlist. LambdaMART is a tree-based ranking method that is useful here because it can combine customer, product and interaction data.

The quoting assistant has a different task: identifying the product a customer has already requested. That requires tighter checks around identifiers and specifications. Both systems can share clean catalogue records, but a product that is interesting as a recommendation is not automatically an acceptable answer to an exact request.

Their scores also need careful interpretation. A ranking score helps order items; it does not automatically mean a customer has a particular probability of buying. If the next step calculates expected profit, it needs a suitable probability or value estimate rather than treating the ranking number as a percentage.

## Continuing to help when a component is unavailable

If live retrieval is unavailable, a timestamped worklist from the latest batch may still help a salesperson prepare their calls. If the ranker is unavailable, eligible reorder suggestions can provide a simpler alternative. I would make the degraded state visible so the user understands the age and limits of the advice.

The point where advice becomes a transaction needs stricter treatment. Stale inventory can be tolerated while exploring possibilities, but availability and price must be checked again before committing a quote. That boundary allows the CRM to remain useful during a recommendation outage without allowing uncertainty to become an unsupported promise.

## Checking whether the recommendation created value

When an order follows a recommended call, it is tempting to credit the recommendation. The customer may have intended to reorder anyway, so I would log eligibility, what was shown, the experimental assignment, the action taken and the eventual outcome. A stable comparison group gives us a way to estimate what changed because the platform was used.

The experiment needs to fit how the team works. Assigning by account may suit repeated account recommendations, while shared salesperson behaviour can require grouping by salesperson or territory, leaving fewer independent groups to measure. Alongside additional gross profit, I would watch margin, customer contact and workload so the evaluation reflects the whole decision rather than only the resulting sale.

[The adoption story shows how a salesperson's objection can reveal a missing piece of that decision.](/work/sales-models/adoption/)
