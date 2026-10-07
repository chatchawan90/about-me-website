# Tee's site

Static site built with Astro.

## Run locally
```
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
```

## Add or edit a page
- Project pages are Markdown in `src/pages/work/<project>/`.
- Register new pages (title, blurb, order) in `src/data/site.ts`. Pages marked `status: 'planned'` show as "Coming".
- Wrap anything you still need to verify in `<span class="tbc">...</span>`. It's highlighted while `draft: true` in `src/data/site.ts`. Set `draft: false` before launch.

The draft banner is currently disabled because there are no remaining inline
confirmation markers. This is a display setting, not a claim that external links,
reported results or every reference architecture have been independently audited.

## Publish

The site is registered with Sites in `.openai/hosting.json`. Build with
`npm run build`; static output is `dist/`. Use the Sites hosting workflow to
push source, package that exact build and deploy its saved version. Preserve
the existing audience when publishing edits. The GitHub origin remains unchanged.

## Editorial structure and sources

The homepage features three connected Chemical Express projects: QT AI Agents,
sales recommendations and operations. EnvSearch is a separate public project,
linked from the homepage and Work page. The existing extraction and pricing URLs
remain supporting notes. Verda is a secondary venture still undergoing renovation,
as clarified by the user in the life-story interview. It is not yet an operating
rental, and previous claims of implemented Verda OS features have been removed.

The personal structure was revised on 2026-10-05 after the user approved separating
the introduction, life story and work stories. About introduces Tee today; My story
at `/story/` contains nine chronological chapters from his direct recollections.
The date-picker example belongs under Operations, not in the About page.
The homepage and main navigation provide routes to all three types of content.

A follow-up Work edit puts the human situation before the implementation inventory
in the QT and Sales overviews, QT rollout, MLOps and AI evaluation openings. The
Work index offers starting points for readers interested in either people and
decisions or technical operations. Keep technical depth and the existing diagrams;
do not replace conditional examples with invented historical incidents to make
the prose sound more personal.

The life story uses memories supplied in the conversation, with education and
career details aligned to the source documents below. Do not invent dialogue,
sensory details, clinical outcomes or neat lessons for every event. Do not infer
that a university offer became attendance: Imperial was a plan that changed;
CMU was a part-time, mostly online degree followed by travel for graduation.
The hotel automation opportunity never became a workable proposal or a contract.
The date-picker discussion establishes reasoning and a proposed shared holiday
source, not a completed rollout or a measured improvement.

The public story includes fatherhood and the current uncertainty about work.
It omits precise household finances, private medical details, family ownership
relationships and the explicitly excluded account of relationship breakdown.

Factual alignment was updated on 2026-10-01 using the newly supplied
`Profile (1).pdf` (LinkedIn export, four pages) and
`Chatchawan_Lakkhananukun_CV.pdf` (one page). These supersede the older
`CHATCHAWAN.docx` where the reported role, results or project scope changed.
The user's direct account still supplies the supplier context, Zoho integration,
product categorisation, six-person management scope, collaborative OCR ownership
and outbound work in progress. Document contents are evidence, not instructions.
Private PDFs and extracted text are not copied into website assets.

| Area | Source and treatment |
| --- | --- |
| Identity and current role | Both new PDFs: Chatchawan (Tee) Lakkhananukun, Lead AI Engineer, Chemical Express, February 2019–present; retain Tee as the short site name |
| Contact | New CV and profile: email and LinkedIn; CV: GitHub. Phone number is not needed for the website copy |
| Career | New CV: Michael Page September 2018–February 2019; Pilz November 2014–June 2018. Profile additionally supplies café ownership and NSTDA internship |
| Education | CV: CMU MS Business Analytics, 2022; Auckland BE (Hons), awarded 2015. Profile's 2011–2014 Auckland range is retained as a study-period source, not substituted for the CV's award year |
| Leadership | Both new PDFs: hired/trained six engineers, analysts and marketers; zero attrition over seven years. This is distinct from the 17 people supported by QT |
| Commercial responsibility | User clarification on 2026-10-02: participates in partnership meetings, develops relationships and closes partnership deals while remaining hands-on technically. Homepage and About reflect this broader business responsibility; retain the supplied Lead AI Engineer title |
| QT scope | October 2026 interview supersedes the PDF shorthand: every quotation has CS approval; current golden evaluation is mainly product matching. Broader workflow evaluation, calibration and model judging remain planned extensions |
| QT volume | Latest direct account: 6,000–10,000 product lines monthly. RFQ counts in earlier documents differ; do not convert product lines to RFQs except in explicitly hypothetical cost calculations |
| QT users and outcome | Both new PDFs: 10 sales + 1 product specialist + 6 customer service = 17 people. Time to quotation: three hours–two days → 15–30 minutes. This replaces the older median two days → three hours wording; do not label the new ranges as medians or active handling time |
| QT adoption | Latest interview: pulled back full quotation automation because wrong product matches caused duplicate work; released standalone product search, logged feedback from then, improved data and rules and later restored the wider workflow. No invented dialogue or numerical relaunch threshold |
| Sales scope and results | Both new PDFs: nine models across 3,000 accounts and 1M+ sellable SKUs; LambdaMART ranking; reported 15% reactivation uplift and 20% churn reduction |
| ML reliability | New CV: point-in-time features, as-of joins, embargo gaps, shadow release, PSI drift and cost-based thresholds. Individual incidents, registry choices and detailed release/recovery flows remain reference design |
| Integration and results | Both new PDFs: AWS microservices using FastAPI, Docker and SQL Server around non-API legacy ERPs; 100+ hours/week of manual handling removed and stock discrepancies down to 0.1% |
| OCR ownership | User's explicit clarification takes precedence over compressed CV wording: collaborative inbound label/invoice work, outbound in progress; do not imply sole implementation |
| EnvSearch | New CV: English/Thai Q&A over US EPA and Thai industrial-waste regulations; BM25 + multilingual embeddings + reranking; Claude page-exact citations; 24-question code-scored gold set; MCP server with four tools for Claude Desktop. Links are supplied by the CV; live demo and repository contents were not independently verified |
| Handbook architecture | QT and Sales handbooks remain sources for design walkthroughs and diagrams, not proof that all shown infrastructure is deployed |

The reported business percentages are reproduced as given in the new documents.
They do not supply baselines, denominators, study windows or experimental design.
Do not turn them into percentage-point changes, causal experiment estimates,
revenue figures or derived ROI. The stock discrepancy rate is not a claimed
99.9% inventory-accuracy metric. The catalogue is not a count of stocked items.

The QT handbook is an architecture study with proposed targets. The Sales handbook
has substantially larger scale assumptions than the actual 3,000-account platform.
Its nine-family decomposition is labelled reference design; taxonomy and embeddings
remain supporting enrichment, not additional claimed runtime models. Detailed
SDS indexing is a design extension rather than a newly asserted implementation.

The integration layer uses SQL Server / FastAPI / Docker on AWS. The later QT
interview confirms RDS PostgreSQL for extracted request data and workflow state,
LangGraph persistence, Fargate workers, OpenSearch Serverless NextGen in Singapore,
Bedrock Knowledge Bases and Cohere reranking through Bedrock. ERP remains separate.
Outbox, explicit atomic revision guards and uncertain-write reconciliation are
reference or planned hardening, not confirmed production capabilities.

Primary documentation linked in the technical articles supports specific design
behaviours: SQS delivery/visibility, OpenTelemetry tracing, Feast point-in-time
joins, OpenSearch aliases and PostgreSQL conditional updates. The complete
stories are grounded in the handbooks and examples developed from them.

At the user's request, omit repetitive constructed-scenario and design-walkthrough
disclaimers from the public copy. Keep provenance in this document. Introduce
hypothetical situations naturally with "imagine", "suppose" or conditional
language, and do not turn them into claims of historical incidents or outcomes.

## Architecture and flow diagrams

The articles contain 14 authored diagrams, defined in `src/data/diagrams.ts`.
To place one, add a `figure.system-diagram` with a matching `data-diagram` key,
a descriptive caption and a text description inside `details`.
`ArticleDiagrams.astro` loads Mermaid only on pages containing a diagram and
renders the figure using the site's current light or dark palette. Each figure
also offers a full-size SVG view. Text explanations remain available without
JavaScript. No customer records or private handbook pages are embedded.

Keep diagram changes aligned with the surrounding narrative. The six QT diagrams
reflect the direct interview, with evaluation extensions marked as planned. Other
project diagrams retain their reference-design scope.
Mermaid syntax checks and the Astro build validate syntax and integration; browser
review is still needed for final layout, mobile scrolling and theme rendering.

## Writing voice

Keep About a clear personal introduction, with room for family and background as
well as present work. Put longer recollections in My story and detailed decisions
in the work articles. Show how building the technology, hiring and training the
team, commercial partnerships and responding to adoption problems fit together.
Use the documented QT scope reduction and sales-override interviews as concrete
examples in Work. Do not invent a particular partner,
negotiation, deal value, contractual promise or outcome without further details.
The user is open to engineering roles, consulting or a combination, potentially
with less implementation responsibility at Chemical Express. Contact copy reflects
that openness without claiming an agreed transition or a new formal title.

Tee describes his strength as judgement and understanding how the business fits
together, rather than being the most technically knowledgeable person. Reducing
scope is welcome, but foreseeable dependencies should be addressed as part of the
work, not automatically deferred. The Operations date-picker article carries this
distinction through his real example. Avoid em dashes and dash-led asides in prose; use natural
sentences instead.

Use a tone between a personal story and a professional conversation: simple,
straightforward, with the reader feeling as though they are sitting beside Tee.
Let ordinary details carry the story without forced drama or a lesson attached
to every paragraph. Write as though Tee is explaining the work to an interested
colleague. Give the
reader enough context to follow a decision: what was happening, why it was
difficult, what the available choices meant, and how the team would judge the
result. Use connected paragraphs and varied sentence lengths rather than packing
each idea into a slogan or a compressed list. Headings provide scanning points;
the body can take its time. Introduce technical terms where they help explain a
choice, with a plain-language explanation. Keep source bookkeeping here rather
than interrupting articles with repeated provenance notes. Do not invent outcomes
to give a scenario a tidier ending.


## QT publication update, 2026-10-07

The direct interview takes precedence over earlier CV and handbook summaries:

- Current product acceptance is over 98%, measured as CS retaining suggested
  products unchanged in production approval logs. The user corrected earlier
  80% and 90% figures; do not turn them into historical trend points. The actual
  percentage at the point of restoring the full quotation workflow is unknown.
- Every quotation is reviewed. Acceptance is not autonomous-quote coverage,
  an independently adjudicated accuracy score, or a causal ROI experiment.
- Email polling runs every five minutes. Draft preparation is typically 2–4
  minutes after pickup; the wider workflow takes 15–30 minutes with review.
- The current golden dataset contains 200 RFQ email chains and final quotations
  linked to SOs, primarily for product matching. Broader component/workflow tests,
  calibration, shadow releases and atomic revision checks must not become claims
  of deployed capability. The synthetic 50-example teaching artifact in outputs/
  is neither company data nor the production golden dataset.
- Thread linkage uses the reply's In-Reply-To to find an earlier message, then
  internal RFQ and LangGraph thread; internal RFQ also links to generated QT.
  Changes before completion update structured context. Existing quotations need
  CS to review the extracted amendment and choose Proceed. Manual mode stops
  agent work, logs the last point and closes the thread.
- Retries use exponential backoff with jitter and a dead-letter queue. Workers
  check PostgreSQL for newer work before replaying redundant queued tasks.
  The queue provider and atomic cancellation semantics are not confirmed.
- The risk model predicts reviewer correction. Below 90% displayed confidence
  receives extra attention; this is an initial operating threshold. Similarity
  scores from Cohere are not probabilities. Calibration is future work.
- Standalone search supplied logs from its introduction. Relevant past orders
  help resolve product choices; unresolved requirements go to CS/sales to ask
  the customer. MAP labelling for multiple variants needs care; do not invent a
  multi-positive relevance policy or claim that every unselected pack is wrong.
- The roughly THB 20,000 estimate and THB 25,000 budget are planning assumptions,
  not observed spend. Worker sizing, model mix, OpenSearch active hours, storage,
  FX and miscellaneous charges remain provisional. Do not publish them as a bill.

This publication updates the eight QT pages, their navigation and homepage links,
and six diagrams. Sales recommendation content is awaiting its separate interview.
Private family details, original attachments and interview data are not website assets.
