---
layout: ../../../layouts/Article.astro
project: quoting-ai
slug: orchestration
title: "When the customer changes the request halfway through"
dek: "An agent needs to know which request an email belongs to, what has already been done, and when the next decision belongs to a person."
---

A customer asks for one pack size, then sends another email asking for a different one. By then, the system may already have found a product and retrieved its price. The new message is short, but its effect reaches beyond the text that changed.

This is part of the ordinary work of preparing quotations. I wanted QT to carry the conversation forward without making CS reconstruct the entire case each time new information arrived.

## Finding the work the reply belongs to

An incoming email has its own message identifier. For a reply, we use its `In-Reply-To` reference to look up the earlier message and find the internal RFQ identifier attached to it. That request then connects to the LangGraph thread holding the workflow's progress.

These identifiers do different jobs:

| Identifier | What it connects |
| --- | --- |
| Email message ID | A specific message and the reply that refers to it |
| Internal RFQ ID | The request being handled across its messages and work |
| LangGraph thread ID | Saved agent workflow state |
| ERP quotation ID | The quotation generated for that internal request |

The internal request is linked to its generated quotation. That lets a later email lead back to the business document as well as the agent conversation.

## Comparing the change with what we already know

We extract the new or updated information into structured fields, then check it against the requested data in PostgreSQL. When something changes, we add that context to the agent's short-term memory and pass it to the orchestrator.

The orchestrator also handles intent interpretation and routing. It decides which tool calls the changed request needs. If the pack size changes, for example, the old price may no longer apply, so the pricing tool needs to be called again.

While preparation is still in progress, we interrupt and restart the workflow with saved work. LangGraph provides persisted state so the system has somewhere to continue from. PostgreSQL holds that workflow information separately from the ERP, which continues to hold the operational business records.

<figure class="system-diagram" data-diagram="quote-recovery" aria-labelledby="quote-recovery-caption">
<figcaption id="quote-recovery-caption">The same follow-up takes a different route once a quotation exists</figcaption>
<details><summary>Read the diagram as text</summary><p>A reply email is linked through its previous message to an internal RFQ, LangGraph thread and any generated quotation. New requirements are compared with PostgreSQL. During preparation, changed context returns to the orchestrator to revisit relevant tool calls. If a quotation already exists, CS reviews the proposed amendment and must click Proceed before it moves forward.</p></details>
</figure>

## Once a quotation exists, CS makes the next decision

A quotation may already have been sent to the customer. It may also have a sales order linked to it. At that point, automatically interpreting a follow-up and changing the document would be a much more consequential action.

We route the extracted proposed change to CS first. They inspect it and click Proceed if they want the workflow to continue. This gives them the chance to consider what has already happened outside the agent, including conversations through other channels.

The distinction is practical. Updating work in preparation and amending an existing commercial document need different handling, even when the customer's email uses the same few words.

## Retries have to respect the current request

Failed tool calls retry with an increasing delay and some randomness, known as exponential backoff with jitter. If they continue to fail, the work goes into a dead-letter queue for a worker to pick up later. CS can see that the particular request is waiting on a failed tool call.

Before replaying queued work, the worker checks PostgreSQL for updates and newer work. If the queued item has become redundant, it is discarded. A lookup that was useful for the original pack size may be irrelevant after the customer changes it.

That check is one reason persisted business state matters alongside the agent's memory. The worker needs the current request when it decides what work is still worth doing.

## Letting a person take over completely

CS can mark a case as manual. That stops the agent's work, logs the last point reached and closes the thread so the agent does not pick it up again.

A manual route is useful when the team needs to resolve something through a conversation or a process the agent cannot complete. The person taking over should not have to compete with automation that keeps trying to continue the same case.

## Where I would strengthen the design next

Checking queued work addresses one source of stale actions. I would also add explicit revision checks around results returning from tools that were already in flight when a request changed. Saving a result only if its expected request revision is still current would make that boundary clearer.

External writes need their own recovery behaviour too. If an ERP saves a quotation but its response is lost, repeating the write blindly could create a duplicate. I would use a stable operation reference and reconcile the existing ERP record before deciding to retry. LangGraph checkpoints alone cannot establish what happened in another system.

Those are further hardening steps. The current workflow already gives us saved progress, a route for changed requests, checks on queued work and a clear human takeover. The next improvements should make those boundaries more explicit under simultaneous updates and uncertain external responses.

[The runtime article covers the workers, retry path and operating-cost assumptions.](/work/quoting-ai/runtime/)
