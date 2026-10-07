---
layout: ../../../layouts/Article.astro
project: quoting-ai
slug: orchestration
title: "When the customer changes the request halfway through"
dek: "An agent needs to know which request an email belongs to, what has already been done, and when the next decision belongs to a person."
---

A customer asks for one pack size, then sends another email asking for a different one. By then, the system may already have found a product and retrieved its price. The new message is short, but its effect reaches beyond the text that changed.

This is part of the ordinary work of preparing quotations. I wanted QT to carry the conversation forward without making customer service (CS) reconstruct the entire case each time new information arrived.

## Finding the work the reply belongs to

The first question is where the new email belongs. A reply carries an `In-Reply-To` reference identifying the earlier message. We use that to find the internal request for quotation, or RFQ, and then the saved workflow associated with it. LangGraph calls that saved conversation a thread.

These identifiers do different jobs:

| Identifier | What it connects |
| --- | --- |
| Email message ID | A specific message and the reply that refers to it |
| Internal RFQ ID | The request being handled across its messages and work |
| LangGraph thread ID | Saved agent workflow state |
| ERP quotation ID | The quotation generated for that internal request |

The internal request is linked to its generated quotation. That lets a later email lead back to the business document as well as the agent conversation.

<figure class="system-diagram" id="quote-thread-link" data-diagram="quote-thread-link" aria-labelledby="quote-thread-link-caption">
<figcaption id="quote-thread-link-caption">The message, request, workflow and quotation each have their own identity</figcaption>
<details><summary>Read the diagram as text</summary><p>The reply references an earlier message through In-Reply-To. Its stored mapping identifies the internal RFQ, which links to the LangGraph thread, structured request data and any generated ERP quotation. These connections establish what has already happened before the update is handled.</p></details>
</figure>

## Comparing the change with what we already know

We read the new requirements into fields and compare them with the request already stored in PostgreSQL. That comparison helps us distinguish an actual change from something the customer is repeating. Changed information goes into the agent's current working context and back to the orchestrator, which coordinates what happens next.

The orchestrator also handles intent interpretation and routing. It decides which tool calls the changed request needs. If the pack size changes, for example, the old price may no longer apply, so the pricing tool needs to be called again.

If the quotation is still being prepared, we interrupt the workflow and restart it with the work saved so far. LangGraph saves its progress, so the agent can continue with that context. PostgreSQL holds that workflow information separately from the ERP, which continues to hold the operational business records.

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

Before replaying queued work, the worker checks PostgreSQL for updates and newer work. If the queued item has become redundant, it is discarded. There is little point retrying a price lookup for the old pack size if the customer has already asked for a different one.

That is why the worker checks the saved request in the database, even though the agent also remembers the conversation. It needs the current requirements when deciding which work is still worth doing.

## Letting a person take over completely

CS can mark a case as manual. That stops the agent's work, logs the last point reached and closes the thread so the agent does not pick it up again.

A manual route is useful when the team needs to resolve something through a conversation or a process the agent cannot complete. The person taking over should not have to compete with automation that keeps trying to continue the same case.

## Where I would strengthen the design next

Checking queued work addresses one source of stale actions. I would also add explicit revision checks around results returning from tools that were already in flight when a request changed. Saving a result only if its expected request revision is still current would make that boundary clearer.

External writes need their own recovery behaviour too. If an ERP saves a quotation but its response is lost, repeating the write blindly could create a duplicate. I would use a stable operation reference and reconcile the existing ERP record before deciding to retry. LangGraph checkpoints alone cannot establish what happened in another system.

Those are the next reliability improvements I would make. We already save progress, handle revised requests, check queued work and let CS take over. I want the same clarity when two updates arrive together, or when another system has acted but we never receive its reply.

[The runtime article covers the workers, retry path and operating-cost assumptions.](/work/quoting-ai/runtime/)
