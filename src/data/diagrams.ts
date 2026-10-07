// QT diagrams follow the project interview; other diagrams retain their reference-design scope.
export const DIAGRAMS: Record<string, { title: string; description: string; source: string }> = {
  'quote-adoption': {
    title: "Rebuilding trust through product search",
    description: "I pulled back the quotation agent, released standalone search and used logged feedback to improve it. The wider workflow returned as results improved; current product acceptance exceeds 98%.",
    source: `flowchart TB
  first["First quotation release: too many product corrections"] --> pull["Pull back the full workflow"]
  pull --> search["Release product search on its own"]
  search --> log["Log CS selections and corrections"]
  log --> improve["Better catalogue coverage, filters and history"]
  improve --> wider["Bring back the wider quotation workflow"]
  wider --> today["Today: over 98% of suggestions accepted unchanged"]
  today --> review["Human review remains on every quotation"]`,
  },
  'quote-architecture': {
    title: "From email to a reviewed quotation",
    description: "Email is collected every five minutes. Fargate workers use LangGraph, RDS PostgreSQL, product retrieval and ERP tools. Every prepared quotation goes to CS review.",
    source: `flowchart TB
  email["Customer email"] --> intake["Inbox pickup every 5 minutes"]
  intake --> orchestration["LangGraph on Fargate: intent and orchestration"]
  orchestration <-->|Saved request and progress| db[("RDS PostgreSQL")]
  orchestration --> parse["Structured extraction and attachment worker"]
  parse --> product["Product retrieval agent"]
  product --> search["OpenSearch Serverless: keywords and vectors"]
  search --> rank["Cohere reranking through Bedrock"]
  rank --> filters["Brand, purity, grade and pack checks"]
  filters --> choice["Proposed product or CS clarification"]
  orchestration <--> erp["ERP tools: account, contact and history"]
  choice --> price["Current supplier cost and pricing tools"]
  erp --> price
  price --> draft["Prepare quotation"]
  draft --> cs["CS reviews every quotation"]`,
  },
  'quote-recovery': {
    title: "Following a changed request",
    description: "A reply is connected to the internal RFQ through the previous email. Changes to work in preparation return to the orchestrator. Changes after a quotation exists need CS approval to proceed.",
    source: `flowchart TB
  reply["Follow-up email"] --> link["In-Reply-To finds the previous message"]
  link --> rfq["Internal RFQ and LangGraph thread"]
  rfq --> compare["Extract changes and compare PostgreSQL data"]
  compare --> exists{"Quotation already exists?"}
  exists -->|No| saved["Interrupt preparation and retain saved work"]
  saved --> context["Pass updated context to orchestrator"]
  context --> tools["Revisit relevant tools, such as pricing"]
  exists -->|Yes| review["CS reviews proposed amendment"]
  review --> proceed{"CS chooses Proceed?"}
  proceed -->|Yes| context
  proceed -->|Not yet| wait["Wait for a human decision"]`,
  },
  'quote-concurrency': {
    title: 'An approval cannot overwrite a newer request',
    description: 'Both an approval and a customer revision begin from case version seven. The revision commits version eight first. The approval updates only if the case is still version seven, so it is rejected and fresh review is required.',
    source: `sequenceDiagram
      participant A as Approver
      participant D as Case database
      participant C as Customer revision
      D-->>A: Review quote at case version 7
      D-->>C: Current case version 7
      C->>D: Save new quantity if version is 7
      D-->>C: Accepted, case is now version 8
      A->>D: Approve only if version is still 7
      D-->>A: Conflict, refresh and review version 8`,
  },
  'runtime-queues': {
    title: "Recovery checks the current work",
    description: "Failed tools retry with exponential backoff and jitter, then enter a dead-letter queue. A worker checks current request state before replaying relevant work.",
    source: `flowchart TB
  toolCall["Tool call"] --> result{"Succeeded?"}
  result -->|Yes| continue["Continue the workflow"]
  result -->|No| retry["Retry with backoff and jitter"]
  retry --> exhausted{"Attempts exhausted?"}
  exhausted -->|No| toolCall
  exhausted -->|Yes| dead["Dead-letter queue"]
  dead --> status["CS sees request waiting on failed tool"]
  dead --> worker["Worker picks up failed work"]
  worker --> db["Check current PostgreSQL request and newer work"]
  db --> valid{"Still relevant and automated?"}
  valid -->|Yes| toolCall
  valid -->|Redundant| discard["Discard obsolete queued work"]
  valid -->|Manual| stop["Keep agent work stopped"]`,
  },
  'ai-evaluation': {
    title: "Product testing and production feedback",
    description: "The current product dataset gates candidate changes. CS approvals and corrections inform live acceptance reporting and the risk model. Broader workflow checks and calibration are planned extensions.",
    source: `flowchart TB
  history["200 historical RFQ chains and final quotations"] --> gold["Current product golden dataset"]
  candidate["Prompt, filtering or retrieval change"] --> checks["Product evaluation before rollout"]
  gold --> checks
  checks --> release["Release decision"]
  release --> live["Live product suggestions"]
  live --> cs["CS review of every quotation"]
  cs --> feedback["Approved unchanged or corrected with reason"]
  feedback --> metric["Production acceptance reporting"]
  feedback --> risk["Correction-risk model"]
  risk --> attention["Confidence signal for closer review"]
  gold -.-> future["Planned: extraction, routing and recovery tests"]
  risk -.-> calibration["Planned: independent calibration checks"]`,
  },
  'retrieval': {
    title: "From candidates to a usable product suggestion",
    description: "OpenSearch hybrid retrieval feeds Cohere reranking. Product checks and relevant order history help resolve the request. Missing requirements and competing variants need CS attention.",
    source: `flowchart TB
  input["Extracted product request"] --> keywords["OpenSearch keyword retrieval"]
  input --> vectors["OpenSearch vector retrieval"]
  keywords --> rank["Cohere reranking through Bedrock"]
  vectors --> rank
  rank --> checks["Brand, purity, grade and pack checks"]
  history["Relevant past customer orders"] --> checks
  checks --> clear{"Clear compatible match?"}
  clear -->|Yes| proposal["Propose the product"]
  clear -->|Missing details or competing variants| options["CS inspects candidates or asks customer"]
  options --> selection["Resolve the product choice"]
  proposal --> review["Final CS quotation review"]
  selection --> review`,
  },
  'ml-release': {
    title: 'The path from a trained candidate to a production release',
    description: 'A versioned dataset and feature definitions produce a candidate model. Data, slice, policy and service checks must pass before approval. A pinned release runs in shadow, then a stable pilot. Guardrails determine expansion or restoration of the previous compatible release.',
    source: `flowchart TB
      data["Versioned dataset + feature definitions"] --> train["Train a candidate"]
      train --> checks["Data, model, slice and service checks"]
      checks --> approved{"Approved for exposure?"}
      approved -->|No| held["Keep current release; investigate candidate"]
      approved -->|Yes| package["Pin artifact, schema and serving image"]
      package --> shadow["Shadow predictions"]
      shadow --> pilot["Stable account pilot"]
      pilot --> evidence{"Guardrails and outcomes acceptable?"}
      evidence -->|Yes| expand["Expand exposure"]
      evidence -->|No| restore["Restore compatible approved release"]`,
  },
  'feature-pipeline': {
    title: 'One feature definition, two different uses',
    description: 'Versioned raw records become cleaned facts retaining event time and availability time. Shared definitions generate historical feature snapshots for training and fresh features for serving. Mature outcomes train models, while current business truth is revalidated separately at commitment.',
    source: `flowchart TB
      raw["Raw orders, quotes and activity"] --> facts["Clean facts: event time + available time"]
      facts --> definitions["Versioned feature definitions"]
      definitions --> history["Historical snapshots at decision time"]
      definitions --> current["Current features with freshness status"]
      history --> dataset["Training examples + mature outcomes"]
      dataset --> model["Approved model and input contract"]
      current --> serve["Online / batch predictions"]
      model --> serve
      serve --> policy["Business rules and reason for action"]
      policy --> commit["Revalidate stock and price at commitment"]`,
  },
  'feature-time': {
    title: 'An order can happen before the platform knows about it',
    description: 'In this example, the order occurs Monday, a recommendation is made Tuesday, and the record reaches the feature pipeline Wednesday. An as-served Tuesday feature snapshot must exclude that order even though its business date is Monday. Later corrected analysis must use a separately identified dataset.',
    source: `flowchart TB
      event["Monday: customer order occurs"] --> decision["Tuesday: recommendation is made"]
      decision --> arrives["Wednesday: order reaches the feature pipeline"]
      arrives --> replay{"Which history are we reconstructing?"}
      replay --> served["Tuesday as served: exclude the late record"]
      replay --> corrected["Corrected history: separate labelled snapshot"]`,
  },
  'model-investigation': {
    title: 'Investigating a recommendation alert before retraining',
    description: 'Check input health first. Broken inputs need repair or a validated fallback. With healthy inputs, separate immature outcomes from established degradation. Investigate affected segments and model or policy versions; restrict or roll back harmful behaviour and only retrain when evidence supports it.',
    source: `flowchart TB
      alert["Recommendation quality alert"] --> inputs{"Inputs complete and fresh?"}
      inputs -->|No| repair["Repair data; use validated fallback or pause"]
      inputs -->|Yes| mature{"Enough mature outcomes?"}
      mature -->|No| observe["Check leading signals; keep outcome judgement open"]
      mature -->|Yes| slices["Compare segments, exposure and versions"]
      slices --> harm{"Harm or release regression?"}
      harm -->|Yes| recover["Restrict affected path / restore compatible release"]
      harm -->|No| investigate["Investigate seasonality, policy and model behaviour"]
      recover --> cause["Establish cause before training a replacement"]
      investigate --> cause`,
  },
  'decision-paths': {
    title: 'Scheduled, event-driven and live work meet at one decision',
    description: 'Scheduled scoring builds default worklists. Business events trigger refreshes for affected accounts. Live requests read the serving store and compute only the additional context needed. Current eligibility and commercial rules produce the displayed action, while exposure and outcome records support evaluation.',
    source: `flowchart TB
      batch["Scheduled account and product scores"] --> store[("Serving store: version and freshness")]
      event["Order / quote event"] --> refresh["Refresh affected account"]
      refresh --> store
      user["Salesperson opens an account"] --> read["Read scores + current context"]
      store --> read
      read --> live["Live score only where needed"]
      live --> rules["Eligibility, stock, margin and contact rules"]
      rules --> action["Useful action with a reason"]
      action --> feedback["Log exposure, action and eventual outcome"]`,
  },
  'order-states': {
    title: 'An order can progress without every part being complete',
    description: 'Order lines are tracked separately from documents. A customer-specific dispatch check combines available authorised lines and required accompanying documents. Remaining lines stay open. Delivery and billing then progress through their own checks rather than sharing one done flag.',
    source: `flowchart TB
      order["Customer order"] --> lines["Line quantities: received / outstanding"]
      order --> documents["Documents and customer requirements"]
      lines --> available["Available lines"]
      lines --> waiting["Outstanding lines: supplier follow-up"]
      available --> gate{"Dispatch conditions satisfied?"}
      documents --> gate
      gate -->|Yes| dispatch["Authorised full or partial delivery"]
      gate -->|No| resolve["Resolve missing requirement"]
      dispatch --> received["Record delivered quantities"]
      received --> billing["Finance checks billing readiness"]
      documents --> billing
      billing --> payment["Invoice and payment follow-up"]`,
  },
  'platform-architecture': {
    title: 'Where the application, workers and business systems meet',
    description: 'An authenticated user enters through the application API. PostgreSQL stores cases, approvals and an outbox; saved commands reach separate workers through SQS. Workers use controlled adapters for business systems and isolated access to models, search and documents. A separate analytics path supports training without owning transactional truth.',
    source: `flowchart TB
      user["Authenticated sales and operations users"] --> api["FastAPI on ECS: access checks + commands"]
      api --> db[("PostgreSQL: cases, approvals, outbox")]
      db --> queue["SQS: saved commands"]
      queue --> workers["ECS worker pools"]
      workers --> ai["Bedrock + OpenSearch"]
      workers --> files["S3: source and generated documents"]
      workers --> adapters["Controlled integration adapters"]
      adapters --> erp["ERP: stock and posted transactions"]
      adapters --> crm["CRM: relationships and follow-up"]
      db -.->|Curated events| analytics["Analytics and model training"]
      erp -.->|Versioned extracts| analytics`,
  },
};
