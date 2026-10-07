---
layout: ../../../layouts/Article.astro
project: operations
slug: system-design
title: "The goods are ready. Why is the order still stuck?"
dek: "Sales, the warehouse and finance can all be looking at the same order and need different answers from it. The software has to make room for that."
---

Suppose sales wants to deliver the available items before the end of the week. The warehouse can see them in stock and is ready to prepare the shipment, but finance has flagged a problem with the billing documents. When someone asks whether the order is ready, each team gives a different answer.

It would be easy to describe this as a communication problem and ask everyone to update the order more carefully. I would first want to understand what “ready” means to each person. The warehouse may mean the goods are physically available, while finance may mean the document package meets the customer's requirements for processing the bill.

Both can be accurate. The design problem is that the system is asking one status to carry more meaning than it can reliably hold.

## Understanding the disagreement before changing the workflow

For a customer who accepts partial deliveries, the available items might be able to move while the remaining supplier is chased. For another customer, the terms or required accompanying documents might make that inappropriate. I would bring the customer-specific requirements into the discussion before deciding which condition should block which action.

Sales can explain what has been agreed with the customer, finance can identify the unresolved document requirement, and the warehouse can clarify what it needs to prepare and release the shipment. The useful outcome of that conversation is a set of explicit dependencies: which checks must happen before dispatch, which affect billing, and who can authorise an exception.

Government customers in Thailand can have different document requirements, so I would check the agreement for the particular customer. That gives us a practical basis for deciding what may move ahead and what still needs attention.

## Letting the order be partly finished

I would track ordered, received, delivered and outstanding quantities separately, alongside the readiness of the required documents. That allows the workflow to express something like, “Two lines are ready for dispatch, one is awaiting a supplier, and the billing package needs a correction.” The statement is more useful than a single colour or completion flag because it tells each person where their work sits.

Those states need owners. Purchasing follows up the outstanding supplier, finance resolves the document issue, and sales keeps the customer informed about what will arrive and when. The warehouse can then see which lines are authorised to move without having to reconstruct the whole history from a chat conversation.

I would also record the decisions that allowed the partial delivery. If someone later asks why an order shipped before every item had arrived, the answer should be available alongside the order rather than depend on the memory of whoever handled it that day.

<figure class="system-diagram" data-diagram="order-states" aria-labelledby="order-states-caption">
<figcaption id="order-states-caption">An order can progress without every part being complete</figcaption>
<details>
<summary>Read the diagram as text</summary>
<p>Order lines are tracked separately from documents. A customer-specific dispatch check combines available authorised lines and required accompanying documents. Remaining lines stay open. Delivery and billing then progress through their own checks rather than sharing one done flag.</p>
</details>
</figure>

## Deciding which system owns each fact

In this design, the ERP remains responsible for stock and posted financial transactions, while the CRM holds relationship activity and follow-up. A workflow layer coordinates the work that spans those systems, including exceptions, approvals and the next action. Giving each fact a clear owner reduces the chance that a convenient copy becomes a competing version of reality.

Stable customer, product, order and line identifiers connect the records. When information is copied for a screen or report, its source and update time remain visible so the application knows whether it is suitable for the decision being made. An old stock snapshot may help someone investigate an order, but it needs refreshing before being used to confirm a new commitment.

I would keep the ERP-specific translation in an adapter: a defined part of the application that reads and writes through controlled interfaces. That gives validation, permissions and error handling a consistent home, and keeps a change in the legacy database from spreading into every feature that uses its data.

## Handling the moment when only one system updates

The same care is needed during a technical failure. Suppose the ERP accepts an update but the CRM request fails, leaving the two systems showing different progress. Retrying the entire operation could repeat the part that already succeeded, while ignoring the error would leave the salesperson working from an incomplete record.

I would save the result of each system update separately, with a reference we can use to check whether it completed. If an update definitely failed and is safe to repeat, we can retry it. If we do not know whether it succeeded, we need to check the receiving system first. A background check can surface unresolved mismatches with an owner and the evidence needed to repair them.

That recovery process belongs in the integration from the beginning. Without it, a connection that works well on a normal day can still leave the team doing manual detective work whenever a timeout occurs.

## Keeping the architecture within the team's ability to operate it

Clear modules and adapters provide useful boundaries without requiring every part to become a separate service. I would split out a workload when it needs independent scaling, stronger access isolation or a distinct owner, and make sure the benefit justifies the additional deployment and monitoring work. A small team needs to be able to understand the system during a busy working day, not only when there is time to study the diagram.

[The architecture walkthrough takes that boundary into the implementation: database concurrency, durable commands, worker permissions and recovery after a deployment.](/work/operations/architecture/)

For the order in this scenario, success would mean that each team can see its own next step and how it affects the others. Sales can give the customer a coherent update, the warehouse knows what may ship, and finance can resolve the remaining requirement without relying on an ambiguous “ready” flag. The software supports the agreement the people made and keeps the unfinished parts visible until they are actually resolved.

[The quoting-agent article follows what happens when a customer changes a request and someone needs to review the next step.](/work/quoting-ai/orchestration/)
