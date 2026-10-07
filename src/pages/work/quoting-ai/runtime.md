---
layout: ../../../layouts/Article.astro
project: quoting-ai
slug: runtime
title: "Keeping a quotation moving when a tool fails"
dek: "What customer service needs to see when a request is waiting, how failed work gets another attempt, and the infrastructure behind it."
---

A draft can get stuck even after the agent has understood the customer's email. It might be waiting for a price from a supplier or for a lookup in the ERP, our operational business system. The customer service team (CS) still has someone waiting for an answer, so they need to know what has stopped and what they can do next.

I built the workflow around saved progress and background workers so a failure could be handled as part of a case. That also gives us somewhere to look when an apparently small request takes longer than expected.

## The services behind the workflow

Background workers carry out the tasks on AWS Fargate, which runs our application containers without us managing the underlying servers. We keep the workers running to avoid startup delays. LangGraph coordinates the agent steps, while RDS PostgreSQL, our managed database, stores the request and its progress separately from the ERP.

Product search uses OpenSearch Serverless NextGen in Singapore. The retrieval stack also uses Bedrock Knowledge Bases, and Cohere reranking is called through Bedrock. The reranking model therefore runs as a hosted service rather than inside a Fargate worker.

The agent roles do not each imply a separate server. The orchestrator also interprets intent; parsing, ERP retrieval, product retrieval and review are parts of the workflow. Some steps involve more than one model call because the agent calls a tool and then interprets what comes back.

## A failed call should produce a visible waiting state

When a tool call fails, we retry with exponential backoff and jitter. The delay grows between attempts, with a little randomness so retries do not all arrive at the same instant. If the attempts still fail, we set the work aside in a dead-letter queue, a holding area for jobs that need another attempt later.

CS sees that the request is waiting because a tool call is failing. They can decide whether to wait or move the case to manual handling. That choice matters when the customer needs an answer sooner than the dependency recovers.

When a worker picks up failed work again, it checks PostgreSQL for changes and newer work. Redundant queued work is discarded. Recovering a connection is not enough reason to perform an action the request no longer needs.

<figure class="system-diagram" data-diagram="runtime-queues" aria-labelledby="runtime-queues-caption">
<figcaption id="runtime-queues-caption">Recovery begins by checking whether the work is still relevant</figcaption>
<details><summary>Read the diagram as text</summary><p>A failed tool call retries with increasing, varied delays. Continued failure sends the work to a dead-letter queue and leaves a visible waiting status for CS. A worker later checks current PostgreSQL state before replay: manual cases stay stopped, redundant work is discarded, and relevant work can continue.</p></details>
</figure>

## Separating processing time from waiting time

Email ingestion runs every five minutes. After pickup, preparing a draft usually takes 2–4 minutes. With CS review and the surrounding work, the quotation process is typically around 15–30 minutes.

Those are different clocks. A customer can be waiting before processing begins, and a completed draft can wait for a reviewer. These ranges describe what we usually see. We have not measured them as a guarantee for a specified percentage of requests.

That distinction also helps decide what to improve. Making one model call faster will do little for a request waiting on a supplier or a human decision. I want the next change to address the stage where time is actually being spent.

## A working budget, with the assumptions visible

For planning, I use roughly **฿20,000 per month**, with room up to **฿25,000**. This is an estimate developed from the workload and infrastructure, not a reconciled production bill.

The middle scenario assumes 8,000 product lines a month, four lines per initial request for quotation, and one or two follow-up emails requiring agent work for every ten requests. It also assumes two continuously running Fargate workers, each with 1 vCPU and 2 GB of memory. Those worker sizes are sizing assumptions for the estimate.

| Part of the estimate | Monthly allowance |
| --- | ---: |
| Model calls, including the assumed follow-up work | ฿5,300–5,800 |
| OpenSearch compute and storage under the activity assumptions | About ฿5,400 |
| Two Fargate workers under the sizing assumptions | About ฿2,830 |
| Cohere reranking through Bedrock | About ฿560 |
| PostgreSQL, embeddings, storage, logs and networking | ฿3,000–5,000 |
| Additional contingency | ฿5,000 |

The model allowance uses a hypothetical mix of smaller and stronger models and token budgets. For OpenSearch, the example assumes two search OCUs for ten hours on 22 days, two indexing OCUs for one hour on those days, and 50 GB of storage. An OCU is AWS's unit of search compute capacity. Continuous capacity or different scaling behaviour would change that estimate substantially.

The reranking line assumes Rerank 3.5 pricing, one billed query per product line, no more than 100 document chunks per query, and an exchange rate of ฿35 per US dollar. The model version is a pricing assumption. Follow-ups, retries, longer inputs, taxes and exchange-rate changes can move the total; current provider bills should replace these assumptions before using the figure for a financial commitment. [AWS publishes the reranking rate and query limits.](https://aws.amazon.com/bedrock/pricing/)

## What I would measure before expanding capacity

The next useful capacity checks would be queue age, concurrent work, worker memory and time waiting on external services. A worker can be delayed while using very little processing power because it is waiting for a model or ERP response. Looking only at CPU usage would miss that.

I would also examine retry volume and calls per completed quotation. Adding workers can increase pressure on a struggling dependency, while changing a prompt can create more tool calls even when the infrastructure stays the same. Those are reasons to understand the case before simply increasing its compute budget.

[The evaluation article looks at how we assess changes to the matching and agent behaviour.](/work/quoting-ai/evaluations/)
