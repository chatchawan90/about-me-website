---
layout: ../../../layouts/Article.astro
project: operations
slug: architecture
title: "Designing a system a small team can actually operate"
dek: "Following a request across the application, database, queues and legacy systems, and deciding which boundaries need to be strong before the system grows."
---

It is easy to draw a separate service for every business capability: one for products, another for pricing, another for approvals, and several more for documents and integration. Each box looks tidy in isolation. The harder question is what the team needs to understand when a salesperson is waiting, an ERP request has timed out, and a quote is halfway through approval.

Those questions come from my integration work at Chemical Express, where I connected older business systems that had no API, the interface software normally uses to exchange information. I built services on AWS using FastAPI, Docker and SQL Server. Here, I'll walk through how I would design a workflow application around those systems, using PostgreSQL to keep track of each case and its progress.

Within a workflow such as quotation handling, I would keep closely related business modules together and use a small number of worker types. The boundaries would follow who owns the data, which work can fail independently and where permission to act needs to be enforced. The wider platform can have several services without requiring every step inside this workflow to become another independently deployed service.

## Following the first request into the application

When someone submits a request, the application first checks who they are, which accounts or cases they may access, and whether they can take that action at the current stage. FastAPI handles these requests. Once the checks pass, the application saves the instruction and the updated case before scheduling work that takes longer.

PostgreSQL is a good fit for related records such as cases, quote versions, approvals and intended operations. I would save the case change together with a record of the next action in an outbox, a database table of work waiting to be passed on. Saving both in one transaction means either both are recorded or neither is, so we cannot save the new case state and forget the work it requires. In the reference AWS deployment, that role is served by Aurora PostgreSQL, with ECS running the application and worker processes.

The ERP and CRM keep their own responsibilities. The workflow database holds the coordination record, but it does not become a second stock ledger or a replacement for posted financial transactions. Reads and writes go through adapters with explicit contracts, which keep legacy schema details and retry behaviour out of the rest of the application.

<figure class="system-diagram" data-diagram="platform-architecture" aria-labelledby="platform-architecture-caption">
<figcaption id="platform-architecture-caption">Where the application, workers and business systems meet</figcaption>
<details>
<summary>Read the diagram as text</summary>
<p>An authenticated user enters through the application API. PostgreSQL stores cases, approvals and an outbox; saved commands reach separate workers through SQS. Workers use controlled adapters for business systems and isolated access to models, search and documents. A separate analytics path supports training without owning transactional truth.</p>
</details>
</figure>

## Making a decision atomic when two people act at once

Suppose a salesperson revises a quantity while a manager is approving the previous quote. Both may have loaded the same case version, and both actions can look reasonable on their own screen. The application needs to check the version and apply the change as one indivisible operation. That is what atomic means here: nobody can slip another change between the check and the update.

A version-checked update can say, “Apply this change only if the case is still version seven.” The first valid update advances the version; the second sees a conflict and must reload the current state. PostgreSQL's concurrency behaviour allows conditional updates to re-evaluate their conditions against a concurrently updated row under Read Committed isolation; the exact transaction and retry design still needs to be tested for the application. [Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html) explains that behaviour.

A short-lived lock can reduce duplicated work, but it should not be the only thing preventing stale changes. A worker can pause long enough for a lock to expire and later continue, so the database version and operation state still need to reject its outdated attempt. External adapters need their own duplicate and version protection because the local transaction cannot automatically extend across the ERP.

<figure class="system-diagram" data-diagram="quote-concurrency" aria-labelledby="quote-concurrency-caption">
<figcaption id="quote-concurrency-caption">An approval cannot overwrite a newer request</figcaption>
<details>
<summary>Read the diagram as text</summary>
<p>Both an approval and a customer revision begin from case version seven. The revision commits version eight first. The approval updates only if the case is still version seven, so it is rejected and fresh review is required.</p>
</details>
</figure>

## Accepting that two systems do not share one transaction

The database can atomically save a case update and an outbox record. It cannot normally make that commit, a CRM API call and an ERP write behave like one indivisible action. I would model each external operation explicitly and record its progress separately, with stable references for checking whether it completed.

That means partial success is a real state the workflow understands. If the ERP write succeeds and the CRM update fails, the recovery process targets the incomplete operation after checking its current relevance. If a posted action needs reversal, that is a new authorised business operation with its own audit record, not an assumption that a database rollback can erase what happened elsewhere.

Incoming events can be late or out of order as well as duplicated. A consumer should use a reliable source version or sequence where available, preserve the original event and verify before applying an apparent reversal of state. A timestamp alone may not establish ordering when clocks or source semantics differ, so unresolved conflicts need reconciliation rather than a universal “latest arrival wins” rule.

## Separating workloads and permissions together

Document parsing, model inference, catalogue indexing and customer delivery have different operating needs. Separate worker pools allow them to scale independently, but the boundary also gives each worker a narrower set of credentials. A document-processing worker needs to read approved attachments; it has no reason to send customer messages or post ERP transactions.

In the AWS reference design, application and data services sit in private network segments with controlled access between them. S3 holds documents, OpenSearch supports retrieval, and Bedrock supplies model access. The important decision is which component may read which data and invoke which operation, with those permissions enforced in the application and service roles rather than inferred from a prompt.

Caches can reduce repeated lookup work, but losing a cache should not destroy an approval or the only record of an operation. Cached values need a source, version and freshness policy. The system should be able to reconstruct them from an authoritative store, and current permission or commercial checks still happen where the action is committed.

## Releasing changes while yesterday's work is still waiting

An approval request may remain open longer than an application deployment. If a release removes a field used by that waiting case, a healthy new server can still be unable to resume the work. I would use compatible schema changes first, deploy code that understands the transition, backfill deliberately, and only remove old fields when the remaining readers and cases no longer require them.

The same principle applies to queue messages and adapter contracts. A new optional field is easier to introduce than changing the meaning of an existing one, and a consumer needs to reject or quarantine an unsupported required version visibly. Waiting work remains pinned to compatible behaviour or follows a tested migration path.

I would package the application once, test that exact package, and use it for the release. Settings may differ between the test and production environments, so those differences need to be recorded too. Rebuilding the code at the last step creates a chance that the version we deploy is no longer the one we tested.

## Practising a recovery that includes the business state

Backups matter only when the team can restore them and understand what must be reconciled afterwards. After a database restore, an ERP write or customer message may have happened later than the restored record shows. Automatically replaying every apparently unfinished command could repeat those external effects.

A recovery exercise should therefore restore into an isolated environment, validate the records and document references, and identify the reconciliation work before enabling writes or sends. The business also needs to decide how much interruption and potential data loss it can tolerate; recovery objectives should come from that discussion rather than being presented as guarantees because they appear in an architecture template.

## Knowing when a module has earned its own service

I would revisit the boundaries when there is evidence: a retrieval workload needs independent scaling, a connector needs stronger isolation, or another team needs to release its part on a separate schedule. A stable contract and clear data ownership make that split easier to evaluate. Shared deployment is a starting choice, not a requirement that every module remain together forever.

The architecture has earned its complexity when it helps the team answer practical questions during an ordinary working day: where a request is, who can act on it, which facts are current and how to recover if a dependency stops responding. Those answers are what make the platform dependable enough for the AI and models built on top of it.

[The workflow story shows how those boundaries help sales, finance and the warehouse work through the same order.](/work/operations/system-design/)
