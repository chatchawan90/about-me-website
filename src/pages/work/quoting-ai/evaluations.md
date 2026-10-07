---
layout: ../../../layouts/Article.astro
project: quoting-ai
slug: evaluations
title: "Knowing whether the next change actually helps"
dek: "A product test set, production corrections and a risk model each answer a different question. Keeping those questions clear makes the results useful."
---

When product matching was poor, there were too many corrections for a few successful demonstrations to mean much. I needed a repeatable way to see whether a change helped, and a way to learn from what CS did with the results in real work.

The changes were often practical: a different prompt, better routing to the relevant agent, more catalogue metadata, or a tighter filter. They did not all require a new model. But each could improve one kind of request while making another worse.

## Starting with 200 historical requests

We compiled 200 historical RFQ email chains and the quotations CS had actually prepared. The dataset was mainly built around product matching, and it became a gate for changes before rollout.

Finding the right quotation was not always straightforward. A request could have several emails and several quotation versions, with the customer changing details along the way. We used quotations linked to a sales order as a practical way to identify the final version, and excluded cases where that connection was unavailable.

That made the first dataset manageable. It also means it represents requests that reached an order, rather than every kind of enquiry we receive. The full chain matters because the final product may reflect information that arrived after the first email.

For a test of an earlier point in the conversation, the eventual quotation is not enough on its own. A later pack-size clarification cannot fairly be treated as information the agent already knew. That distinction matters as we extend the dataset beyond its original product-matching purpose.

## Looking at retrieval and live acceptance separately

The product evaluation uses Hit@1, Hit@3, Hit@7, MRR, NDCG and MAP to understand the returned results. Those measures tell us whether the relevant product is present and how much searching the reviewer may still have to do. [The retrieval article explains each measure in the context of our catalogue.](/work/quoting-ai/rag/#the-measurements-that-help-us-choose-the-next-fix)

Production approval logs answer a different question: did CS keep the proposed product? A reviewer can reject a suggestion using the X button and provide a short reason. When they approve without changing the product, that records acceptance; an unfinished review does not establish a positive outcome.

The current product acceptance rate is over 98%. I describe it that way because it is based on review behaviour. It does not mean that an independent audit has established 98% accuracy, or that 98% of quotations go to customers without a person checking them.

## Learning which suggestions need more attention

We use the review corrections to build a risk model that predicts whether CS will change a proposed match. The interface presents confidence in the suggestion being kept, giving reviewers a signal about where closer attention may be useful.

Our initial operating rule flags confidence below 90% for extra checking. That threshold was a starting choice. It should not be confused with either the cross-encoder's similarity score or a validated claim that a displayed 90% always means nine out of ten matches will be accepted.

Calibration is the next useful check here. For example, among 100 suggestions receiving scores near 90%, I would expect roughly 90 to be accepted if that score is well calibrated. If only 60 were kept, the confidence display would be overstating how dependable the suggestions were.

I would evaluate that on later, separate feedback, keeping related email chains together. Testing against the same examples used to train the risk model would give us a more flattering answer than we need.

<figure class="system-diagram" data-diagram="ai-evaluation" aria-labelledby="ai-evaluation-caption">
<figcaption id="ai-evaluation-caption">The product release check and the feedback loop serve different purposes</figcaption>
<details><summary>Read the diagram as text</summary><p>Historical email chains and final quotations form the current product test set. Candidate changes are checked before rollout. Live suggestions then go through CS review; approvals and corrections feed acceptance reporting and the correction-risk model. Planned extensions add tests for extraction, routing, amendments, approvals and recovery, plus independent calibration checks.</p></details>
</figure>

## Extending the tests without making every check expensive

The broader workflow evaluation is planned work. I would add focused cases for interpreting intent, extracting changed requirements, asking for clarification, and preserving human approval when an existing quotation is amended.

Each test needs an expected result established separately from the agent's output. The agent's log is evidence of what it did. A person can review that evidence and turn it into a labelled example, but logging alone does not make the result ground truth.

For a retrieval test, the input can be an already extracted product request and the expected result an accepted product or set of acceptable products. That test can run the search component without replaying every email, model call and ERP lookup.

For a decision such as asking for a missing grade, I would have the agent return a structured action alongside any customer-facing message. A test could compare the action and missing fields directly:

```json
{
  "action": "needs_clarification",
  "missing_fields": ["grade"]
}
```

The expected action would come from the reviewed test case. Code can check those fields without requiring the model to write the same sentence every time. Checking whether the free-text explanation is misleading is a separate task, where human review or a carefully assessed model judge may help.

## Testing what happens when the workflow is interrupted

I would also add tests that introduce a follow-up email, a failed tool call, stale queued work or a manual takeover. Those are checks on the application around the model, and many can use recorded or simulated tool responses rather than live paid calls.

The aim is to make the evaluation useful enough to run regularly. A small set of full workflow tests can cover how the pieces fit together, while focused tests examine the parts we are changing. We already have the product dataset and production feedback to build from; the next step is to make those wider operating decisions just as testable.

[The orchestration article follows the changes and approvals those tests need to cover.](/work/quoting-ai/orchestration/)
