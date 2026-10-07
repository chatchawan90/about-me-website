---
layout: ../../../layouts/Article.astro
project: quoting-ai
slug: rollout
title: "Why I made QT smaller before growing it again"
dek: "Product matching was the core of the workflow. When it wasn't reliable enough, I pulled back the quotation agent and gave the team product search first."
---

I had built a quotation workflow that could interpret a request, search for products and prepare the next steps. But when customer service reviewed the output, too many product choices still needed changing.

That created a very practical problem. Someone would open the draft, spot the wrong product, and do the search again themselves. The automation had introduced another thing to check without removing enough of the original work.

Of course people also preferred the way they already knew. Change takes time. But I could not reasonably ask them to adopt a system whose central task was still making their day harder.

## Pulling back the full workflow

I pulled it back because product search was the core. A fast draft with the wrong item was not a useful starting point for a chemical quotation. The price, pack and customer response all depended on identifying that item correctly.

I released the product search function on its own first. CS could use it to find the right product while continuing the rest of the quotation through their familiar process. It gave them a smaller capability to judge through everyday use.

We logged interactions and corrections from that stage. This meant we could look at actual searches and the choices people made, instead of relying only on whether a demonstration appeared convincing.

## Giving the search better information and clearer rules

Part of the early problem was the information available to search. We narrowed the supported scope to brands where we had useful catalogue descriptions and product details, including Merck, TCI and MedChemExpress. Our supplier relationships made that information available.

I also moved more of the decision into explicit checks. Brand, purity and grade became important filters, with past customer orders providing additional context. A high similarity score was useful, but it could not make an incompatible specification acceptable.

This was especially noticeable with MedChemExpress. We had only been working with the brand for about a year, so there was less order history to draw on. Many descriptions were highly specific and similar to one another, and customers did not always specify the pack or unit they needed.

Some of those requests needed clarification rather than a better ranking algorithm. We could show alternatives, but CS or sales still needed to establish which option the customer wanted.

<figure class="system-diagram" data-diagram="quote-adoption" aria-labelledby="quote-adoption-caption">
<figcaption id="quote-adoption-caption">How we rebuilt the workflow around everyday use</figcaption>
<details><summary>Read the diagram as text</summary><p>The first quotation release required too many product corrections. I pulled it back, released standalone product search, and logged CS feedback. Better catalogue coverage, metadata filters and customer history improved the results. The wider quotation workflow returned as performance improved. Current production logs show over 98% of suggested products accepted without changes.</p></details>
</figure>

## The relationships helped, but the results had to improve

I already had the team leader's trust. We had worked through earlier CRM customisations and web applications together, and he had gradually seen what those tools could do. The wider team also knew me from connecting the ERP and CRM and building tools around their work.

That history helped us have the conversation. We ran a workshop and multiple tutorials, explained what we were trying to achieve, and gave people time to understand the system. Still, the clearest sign of progress was that they noticed fewer product changes were necessary.

As the search improved, we brought the broader quotation workflow back. Today, production approval logs show that CS keeps over 98% of suggested products unchanged. The system continues to improve, and every quotation still receives human review.

## What I would carry into another rollout

This experience changed the order in which I would introduce a similar system. I would start by finding the part of the job people can use and judge directly, then build outward from evidence that it is helping.

It also made the feedback more useful. A correction is a clue about what needs attention: missing catalogue information, a ranking problem, an incompatible grade, or a customer requirement we do not yet know. Those lead to different fixes, and treating all of them as one accuracy problem would make the next improvement harder to choose.

[The retrieval article shows how those distinctions shaped the matching system.](/work/quoting-ai/rag/)
