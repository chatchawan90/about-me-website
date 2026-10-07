---
layout: ../../../layouts/Article.astro
project: quoting-ai
slug: ""
title: "There is more to a quote than finding a price"
dek: "How I built a quotation assistant for chemical distribution, pulled back its first release, and earned the team's trust one product search at a time."
---

A customer emails us asking for a few laboratory products. It sounds like a small job. Before customer service can prepare the quotation, though, they need to find the right account and contact, understand the requirements, identify the products, and work out what we can offer at today's prices.

At Chemical Express, we distribute chemical and life-science products from suppliers including Merck KGaA, TCI, MedChemExpress and Elabscience. Across a catalogue of more than a million sellable products, similar names can conceal different grades, purity levels or pack sizes. Getting the product wrong makes almost everything that follows less useful.

I built QT AI Agents to help with that work. I handled the conversations with the teams, the system design, implementation and testing. It grew out of the ERP and CRM integrations and custom business tools I had already built, so I knew both the systems involved and the people who would depend on it.

## What changed in everyday work

The workflow supports 10 salespeople, one product specialist and six customer service staff. It handles roughly **6,000–10,000 requested product lines a month**. Those are individual product lines, so one customer email can contribute several.

Today, **CS accepts over 98% of suggested products without changing them**, based on production approval logs. Every quotation still goes through human review. This product acceptance rate tells me how often the suggestion survives that review unchanged.

Once processing starts, a draft is typically ready for review in **2–4 minutes**. With review and the surrounding work, the quotation process usually takes **15–30 minutes**, compared with the previous range of three hours to two days. The old range included waiting between people and tasks; it was not three hours of continuous typing.

## Understanding what the customer actually needs

The email inbox is checked every five minutes. We chose that interval because a short delay before processing was acceptable for this workflow. Building around instant arrival would have added complexity without addressing the biggest source of delay.

The orchestrator first interprets the request. Is the customer asking for a quotation, a price, or availability? For a quotation, the workflow identifies the account and contact, extracts the requirements into structured data, and uses a separate worker when an attachment needs parsing. CS can inspect that extracted information while the rest of the work continues.

Some requirements are easy to overlook. Billing and delivery addresses can differ. The same contact may pay cash on one occasion and use credit on another. A customer may need VAT displayed a particular way, their name shown on the document, or a preliminary receipt so they can withdraw funds before paying us.

Those details belong to the request being handled. Automating them reduced the amount CS had to reconstruct from messages and customer history. [The request-reading note follows that part of the workflow.](/work/quoting-ai/reading-requests/)

## Finding a product, then checking the offer

Product search combines keyword and meaning-based retrieval in OpenSearch. Cohere reranking through Amazon Bedrock then examines the candidates more closely. We apply product metadata and filters, including brand, purity, grade and pack, and use past customer orders where they help resolve the request.

A clear match can become the proposed product. Similar candidates or missing requirements need attention from CS or sales, who can contact the customer. The interface normally starts with three candidates and lets the reviewer expand the results.

Pricing then combines current supplier information with the contact's recent order history. We look at their last three orders within the current and previous calendar year, but still check today's supplier cost and markup. An old selling price is useful context; it does not establish what the same offer costs us now. [The pricing note explains the supplier differences.](/work/quoting-ai/pricing/)

<figure class="system-diagram" data-diagram="quote-architecture" aria-labelledby="quote-architecture-caption">
<figcaption id="quote-architecture-caption">From an incoming email to a quotation reviewed by CS</figcaption>
<details><summary>Read the diagram as text</summary><p>Email is collected every five minutes. LangGraph workers on Fargate interpret the request, parse attachments, retrieve products through OpenSearch and Cohere on Bedrock, and obtain account and pricing information from ERP tools. RDS PostgreSQL stores request data and workflow progress separately from the ERP. Every prepared quotation goes to CS for approval.</p></details>
</figure>

## The first release was not good enough

Product matching was unreliable at first. CS would open a draft, find the wrong product, and have to search again themselves. They were checking the system's work and then doing their own. Their resistance made sense.

I pulled back the full quotation workflow and released product search on its own. We logged selections and corrections from that stage, narrowed coverage to brands where we had reliable catalogue information, and strengthened the matching rules. As the results improved, we brought back the wider workflow.

Workshops and tutorials helped people understand the system, but the improvement they noticed was simpler: they had fewer products to change. [That rollout story explains how we got there.](/work/quoting-ai/rollout/)

## What happens after the first email

A quotation request can change while it is being prepared. We link reply emails to an internal request, compare the extracted changes with the data in PostgreSQL, and pass the new context to the orchestrator. A different pack size, for example, can mean calling the pricing tool again.

Once a quotation already exists, an amendment takes a more cautious route. CS sees the extracted change and must choose to proceed, especially when the document has already reached the customer or has a sales order attached. CS can also take a case fully manual, which stops the agent's work and closes the thread.

That operating behaviour is part of the product. The following articles explain [thread changes and human control](/work/quoting-ai/orchestration/), [retries and infrastructure](/work/quoting-ai/runtime/), [product retrieval](/work/quoting-ai/rag/), and [how we evaluate changes](/work/quoting-ai/evaluations/).
