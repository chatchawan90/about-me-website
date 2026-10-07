---
layout: ../../../layouts/Article.astro
project: quoting-ai
slug: rag
title: "When a similar product is the wrong product"
dek: "Searching a million products is only the beginning. The useful result is an item that fits the customer's requirements, with uncertainty made visible."
---

A customer asks for ML-210. In the MedChemExpress catalogue, the product code HY-100003 appears against several pack sizes, from 1 mg through to 1 g. The descriptions are the same because they describe the same compound. The quotation still needs a particular pack.

A search engine could retrieve all of those entries correctly and still leave us unable to finish the offer. If the customer has not specified a size, the highest text similarity score does not tell us which size they need.

That distinction shaped the product search in QT. We needed to find candidates across more than a million sellable products, then establish which details were known, which conflicted, and which still needed a person to resolve.

## How a request becomes a shortlist

We combine keyword search with vector search in OpenSearch Serverless. Keyword matching helps with product codes, names and identifiers. Vector search uses numerical representations of descriptions, called embeddings, to find related wording when the customer does not use the supplier's exact description.

Cohere reranking through Amazon Bedrock then compares the request with the retrieved candidates more closely. This is the cross-encoder stage: it reads each request and candidate together to improve their order. It works on the retrieved set rather than comparing every request against the entire catalogue.

We also use metadata such as brand, CAS number, purity, grade and pack. CAS identifies a chemical substance, but does not by itself identify every commercial variant. We check the relevant product attributes again as we narrow the results, rather than allowing a strong text match to overrule a conflicting requirement.

<figure class="system-diagram" data-diagram="retrieval" aria-labelledby="retrieval-caption">
<figcaption id="retrieval-caption">Search finds possibilities; the request determines whether they fit</figcaption>
<details><summary>Read the diagram as text</summary><p>Structured product requirements feed keyword and vector retrieval in OpenSearch. Cohere through Bedrock reranks the candidates. Brand, purity, grade and pack checks narrow the choices, with relevant customer history adding context. A clear compatible match becomes a suggestion. Missing details or competing variants go to CS for selection or customer clarification. All quotations receive final CS review.</p></details>
</figure>

## What happens when the request is incomplete

Past orders help when the customer has bought the retrieved product before. That gives the system something more concrete to work with than a similar description. A current request still takes precedence when it specifies something different.

When the information does not resolve the choice, we ask CS or sales to contact the customer. We can also show several variants if that is useful. The interface normally presents three candidates first, with an option to expand the list.

For the ML-210 example, that means CS can see the available variants and choose the appropriate one after resolving the requirement. An unselected pack is not automatically a retrieval failure. The search may have found the right compound while the request lacks the information needed to choose a sellable pack.

The same issue appears across brands. Several suppliers may offer plausible products for an unspecified request. Those results can be useful alternatives for sales, but offering a substitute is a business decision that needs to be visible.

## Similarity and confidence answer different questions

The reranker's score helps us decide whether one candidate is a clear winner or several deserve attention. Candidates with very similar scores are a reason to look more closely. A large gap can support proposing the first result, provided it also passes the relevant product checks.

That score is not a measured probability that the customer will accept the product. We have a separate risk model that predicts whether CS will correct a proposed match. Its displayed confidence is based on the predicted chance of the suggestion being kept.

We initially flagged anything below 90% on that confidence scale for an additional careful check. That was an operating choice, not a threshold established by a calibration study. Every quotation still requires CS approval, including suggestions above the threshold.

## The measurements that help us choose the next fix

We look at several retrieval metrics because a single average does not show where the work is failing.

| Measure | What it tells us | How we use it |
| --- | --- | --- |
| Hit@1 | Whether a labelled correct product is the first result | Checks the usefulness of the first suggestion |
| Hit@3 | Whether a labelled correct product appears in the first three | Matches the shortlist normally shown to CS |
| Hit@7 | Whether a labelled correct product appears within seven results | Helps distinguish a weak first ranking from a result that is harder to find |
| Mean reciprocal rank, or MRR | How high the first correct product appears | Rewards moving a useful result closer to the top |
| NDCG | Whether the ranking puts labelled relevant results near the top | Checks the ordering of the result list, using the relevance labels available |
| Mean average precision, or MAP | How well the list ranks labelled relevant products across queries | Used in our MedChemExpress evaluation; its interpretation depends on which variants are labelled relevant |

For MRR, a correct result in first place contributes 1, second place contributes 0.5, and third place contributes about 0.33. Averaging those values makes a result that is technically present but repeatedly buried lower in the list visible in the score.

MAP needs particular care with variants. If an evaluation labels only the final selected pack as correct, other plausible packs count against that evaluation even when the original request left size unspecified. With one relevant item per query, ordinary MAP and MRR coincide under matching evaluation rules. Neither can establish a missing customer requirement.

If Hit@7 looks healthy but Hit@1 is weaker, ranking is an obvious place to investigate. If the product is missing from the first seven, we need to look further back at the catalogue, extracted request and filters. It could also be lower in the results; the metric alone does not identify the cause.

## The measure the team can feel

Alongside those technical checks, production approval logs tell us whether CS changes the suggested product. Today, over 98% are accepted unchanged across a workflow handling roughly 6,000–10,000 product lines a month.

That measures what happens in review. It includes the whole path from understanding the request to proposing the item, so it serves a different purpose from a controlled retrieval test. I want both views: one helps locate the problem, and the other tells me whether the system is reducing correction work in practice.

## Where I would extend retrieval next

Product records and safety data sheets need different treatment. A product record helps identify a sellable item; an SDS contains longer evidence about a particular product or formulation. For deeper SDS retrieval, I would preserve sections, supplier, revision, language and product linkage with each passage so a reviewer can inspect the applicable source.

That extension belongs alongside the product search, with its own evaluation. Retrieving a convincing passage from a safety document cannot replace checking whether it applies to the item being discussed.

[The evaluation article explains the golden dataset and how review feedback becomes useful evidence.](/work/quoting-ai/evaluations/)
