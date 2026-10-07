---
layout: ../../../layouts/Article.astro
project: quoting-ai
slug: reading-requests
title: "Reading the requirements behind a short email"
dek: "The products matter, but so do the contact, payment terms, delivery address and document the customer actually needs."
---

Before QT, customer service had to search for the account and contact, open the quotation module and enter the details themselves. Some information came from the email, some from customer history, and some needed a conversation before the quote could be completed.

The account alone does not settle the requirements. Billing and delivery addresses can differ. A familiar contact may use cash for one purchase and credit for another. Some customers need a preliminary receipt to obtain the funds before they have paid us.

## Turning the request into something we can check

The agent coordinating the work first establishes what the customer wants: a quotation, a price or an availability check. For a quotation, it searches the ERP, our operational business system, for the relevant account and contact. An email address or name can help find the record, but if more than one match looks plausible, a person needs to resolve it.

We save the interpreted request in named fields, using JSON as the data format. Attachments go through a separate background task when their contents need to be read. Customer service can inspect that information while the workflow continues, so they can see how the request has been understood before it becomes a finished document.

The fields include the requested products and the commercial and document preferences: payment terms, addresses, VAT display, whether a name should appear, and whether a preliminary receipt is needed. The final PDF must reflect the customer's required format.

<figure class="system-diagram" id="quote-intake" data-diagram="quote-intake" aria-labelledby="quote-intake-caption">
<figcaption id="quote-intake-caption">From email to a request the team can inspect</figcaption>
<details><summary>Read the diagram as text</summary><p>The orchestrator routes the intent. For a quotation, ERP matching identifies the customer and contact; ambiguous matches go to CS. Extraction and attachment parsing record products and commercial requirements in PostgreSQL. CS can inspect them while product search continues.</p></details>
</figure>

## Reading the next message in the same conversation

A later message can update those requirements. We link a reply to the earlier email and its internal request, compare the new extracted information with PostgreSQL, and pass changed context to the orchestrator.

If the customer changes a pack size, the product and price need another look. If a quotation already exists, customer service (CS) reviews the proposed amendment before allowing the workflow to proceed. The follow-up is part of an existing piece of work, with consequences that depend on how far that work has reached.

## Where I would extend the checks

One of the next things I want to test more thoroughly is whether we have read the request correctly before searching for its products. A case can fail because the search was poor, but it can also fail because the search received the wrong quantity or lost a requirement in an attachment.

I would test those fields against reviewed source examples and keep unresolved details explicit. A complete-looking record should not hide information the customer never supplied.

[Follow the extracted request into product search.](/work/quoting-ai/rag/)
