---
layout: ../../../layouts/Article.astro
project: envsearch
slug: ""
title: "An answer is more useful when you can find the page behind it"
dek: "EnvSearch is my public English and Thai retrieval project: questions over environmental regulations, answers with page-level citations, and an evaluation set that checks when the system should answer or refuse."
---

When a document is long and unfamiliar, finding a relevant paragraph can take more effort than reading it. A search tool can help, but a generated answer introduces another question: does the source actually support what it says? For this project, I wanted the answer and the evidence to remain close enough that someone could check them together.

I built EnvSearch around US EPA and Thai industrial-waste regulations, with questions and answers in English and Thai. It combines document retrieval, reranking and Claude-generated answers with page-exact citations. The project also includes a 24-question gold set scored by code and an MCP server exposing four tools to Claude Desktop.

## Finding the passage before writing the answer

The retrieval combines BM25 keyword search with multilingual embeddings. Keyword search helps locate specific terms in the documents, while embeddings provide a route to passages whose meaning is relevant even when the question uses different wording. Reranking then helps order the candidate passages before they become evidence for the answer.

That separation is useful when investigating a disappointing result. If the relevant passage never reaches the candidate set, changing the answer prompt will not fix the missing evidence. If retrieval succeeds but the answer misrepresents the passage, the next investigation belongs later in the process.

The same distinction matters in my quotation work, although the decisions are different. In QT, the question may be whether a product's grade and pack match a customer's request. In EnvSearch, it is whether a retrieved passage supports a statement and whether the reader can locate that support in the original document.

## Making the source part of the response

Claude produces answers with citations to the relevant pages. That gives the reader a practical next step: inspect the source rather than accept a fluent summary on its own. A citation is useful evidence to examine, rather than a guarantee that an interpretation is correct.

The English and Thai scope also makes this more than a demonstration built around one convenient style of question. The retrieval has to work across the languages represented in the project, while keeping the answer attached to the documents that support it. A question being easy to phrase does not mean the indexed material contains enough evidence to answer it.

## Giving evaluation a visible place in the project

The evaluation uses a 24-question gold set, with code checking retrieval, citations and refusals. A refusal matters because a system that always produces an answer can look helpful even when the required evidence is absent. Testing that boundary gives the project a more meaningful standard than whether each response sounds convincing.

Twenty-four questions provide a bounded set of checks, not an exhaustive demonstration of reliability. I present the size of the set so someone reviewing the project can understand the scope of the evidence. It is also a useful starting point for a technical conversation about which additional cases would test the system's weakest assumptions.

## Using the same capability through Claude Desktop

The MCP server exposes four tools to Claude Desktop. MCP, or Model Context Protocol, provides a way for an AI application to access tools through a defined interface. That makes the document-search capability available within another workflow, alongside the project's own demonstration.

This is why EnvSearch belongs in the portfolio alongside the internal business systems. It gives someone an inspectable example of the retrieval, evidence and evaluation questions that also appear in my production work, without needing access to customer records or supplier information.

[Explore the source code](https://github.com/chatchawan90/e2e-rag-demo) or [open the demo](https://envsearch-demo.onrender.com). For the business context, the [QT retrieval walkthrough](/work/quoting-ai/rag/) explores why a similar chemical product can still be the wrong match.
