---
layout: ../../../layouts/Article.astro
project: quoting-ai
slug: pricing
title: "A previous price is a useful starting point"
dek: "The quotation needs to make sense against both the contact's buying history and what the supplier charges us today."
---

Once we have identified the product, finding its price is another piece of work. Different brands have different systems, and a figure from a previous quotation does not tell us whether the same offer still makes commercial sense.

For Merck, the supplier process involves logging in and looking up prices product by product. For TCI, our purchasing team uploads supplier pricing through tools I built. Those prices are in US dollars, so our costing tools need to account for the cost and markup before we have a customer offer.

## Using history without losing sight of current cost

QT first checks the contact's recent buying history. We look at their last three orders within this calendar year and the previous one. Looking at the contact, rather than stopping at the company name, helps us find the history relevant to the person making the request.

We still obtain current supplier pricing and compare the resulting cost and markup with what we have offered historically. Customer service would otherwise have to bring those pieces together themselves. An offer we made last year is useful context, but I still want to know what supplying the product would cost us today.

The same contact's payment arrangements can differ between requests, so those terms are part of the current quotation too. After product selection and pricing, customer service (CS) reviews the prepared quotation before approval.

<figure class="system-diagram" id="quote-pricing" data-diagram="quote-pricing" aria-labelledby="quote-pricing-caption">
<figcaption id="quote-pricing-caption">Current supplier costs and customer history meet before CS approval</figcaption>
<details><summary>Read the diagram as text</summary><p>The selected product leads to the relevant supplier price source. Costing tools calculate current cost and markup, which are compared with the contact’s last three orders in the current and previous year. Current payment and document requirements shape the quote. CS reviews the prepared offer. A changed pack during preparation sends pricing back through the relevant tools.</p></details>
</figure>

## A changed pack means revisiting the offer

Suppose a customer follows up asking for a different pack size. The original price was retrieved for the original product variant. The agent coordinating the workflow receives that change and can ask the pricing tool for a new result using the updated requirement.

If the quotation already exists, the amendment first goes to CS for a decision to proceed. That is especially important when the customer already has the document or a sales order is attached.

## Where this project ends

I have also worked on models that estimate whether a customer will accept a quote. That work belongs to a separate part of the business. Here, QT brings together supplier information, customer history and our costing tools so CS has an offer they can review.

There is also substantial work after a quotation becomes a sales order. For products we do not stock, purchasing may need the supplier's lot number, its certificate of analysis and expiry details, followed by customer confirmation. I built tools around that process too, but it belongs to the wider [operations platform](/work/operations/).

[Return to the QT overview.](/work/quoting-ai/)
