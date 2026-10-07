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

QT first checks the contact's recent buying history. We look at the last three orders, restricted to the current and previous calendar year. The contact matters here because the relevant purchasing relationship is more specific than the account name alone.

We still obtain current supplier pricing and compare the resulting cost and markup with what we have offered historically. This gives CS the context they would otherwise need to assemble themselves. It also avoids treating a past selling price as evidence that the supplier still charges the same amount.

The same contact's payment arrangements can differ between requests, so those terms are part of the current quotation too. After product selection and pricing, CS reviews the prepared quotation before approval.

## A changed pack means revisiting the offer

Suppose a customer follows up asking for a different pack size. The original price was retrieved for the original product variant. In our workflow, the orchestrator receives the extracted change and can call the pricing tool again using the updated requirement.

If the quotation already exists, the amendment first goes to CS for a decision to proceed. That is especially important when the customer already has the document or a sales order is attached.

## Where this project ends

My other modelling work includes pricing and quote acceptance, but that is a separate decision problem. The QT workflow described here uses supplier information, customer history and costing tools to prepare an offer for review. It does not establish that an acceptance model independently chooses the final price.

There is also substantial work after a quotation becomes a sales order. For products we do not stock, purchasing may need the supplier's lot number, its certificate of analysis and expiry details, followed by customer confirmation. I built tools around that process too, but it belongs to the wider [operations platform](/work/operations/).

[Return to the QT overview.](/work/quoting-ai/)
