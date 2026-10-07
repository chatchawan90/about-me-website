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

The orchestrator interprets whether the email is asking for a quotation, a price or availability. For a quotation, the system looks for the account and contact in the ERP using available evidence such as the email address or name. Ambiguous matches need human review.

The request is logged as structured JSON. Attachments go through a parsing worker when needed, and the extracted information is available for CS to inspect while the workflow continues. This makes the requirements visible before they become a finished document.

The fields include the requested products and the commercial and document preferences: payment terms, addresses, VAT display, whether a name should appear, and whether a preliminary receipt is needed. The final PDF must reflect the customer's required format.

## Reading the next message in the same conversation

A later message can update those requirements. We link a reply to the earlier email and its internal request, compare the new extracted information with PostgreSQL, and pass changed context to the orchestrator.

If the customer changes a pack size, the product and price need another look. If a quotation already exists, CS reviews the proposed amendment before allowing the workflow to proceed. The follow-up is part of an existing piece of work, with consequences that depend on how far that work has reached.

## Where I would extend the checks

The next evaluation work includes checking extraction separately from product retrieval. A case can fail because the search was poor, but it can also fail because the search received the wrong quantity or lost a requirement in an attachment.

I would test those fields against reviewed source examples and keep unresolved details explicit. A complete-looking record should not hide information the customer never supplied.

[Follow the extracted request into product search.](/work/quoting-ai/rag/)
