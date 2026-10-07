---
layout: ../../../layouts/Article.astro
project: operations
slug: ""
title: "What happens between receiving an order and getting paid"
dek: "The purchasing, delivery and billing work behind a chemical distributor, and the software I built to help connect it."
---

An order looks much simpler in a sales report than it does while people are trying to fulfil it. The customer may have requested several products that come from different suppliers, some available now and others on backorder. Delivering the available items is one part of the job; keeping track of what is still owed and preparing the documents the customer needs can take a separate round of coordination.

That was the setting for my integration work at Chemical Express. Our ERP systems held the operational records, while Zoho CRM helped manage customer relationships. I connected them and built custom tools for the purchasing, delivery and billing work that fell between them.

The older ERP systems had no API, the interface software normally uses to exchange information, so connecting them needed more than a standard plug-in. I built an integration layer on AWS using FastAPI, Docker and SQL Server. I also worked directly with the teams to understand the process, then handled the design, coding and testing.

The reported results were more than 100 hours of manual handling removed each week and stock discrepancies reduced to 0.1%. Those outcomes belong to the wider integration and operational work, including the collaborative OCR effort.

## Why the details matter in this business

Chemical and life-science products can be difficult to distinguish when their codes and names are similar. Lot details and storage requirements also matter, so identifying the product family is not always enough to establish that the item in front of someone is the one expected. Even a supplier's own label or invoice can contain an error that needs checking rather than copying into another system.

Those details affect the rest of the process. If the recorded item is wrong, the warehouse and salesperson may be making decisions from different understandings of what arrived. If a backorder disappears from the team's view after a partial delivery, the customer can be left waiting for something nobody is actively following up.

Billing introduces another set of requirements. A customer's goods and documents may need different handling, and the requirements of government customers in Thailand can make that coordination particularly important. The physical delivery being complete does not necessarily mean the paperwork is ready for payment processing.

## Working around the systems already in place

Integrating the CRM and ERP meant understanding where each part of the work belonged. Customer conversations and follow-up activity need to remain connected to the operational records, while quantities, receipts and financial transactions need a consistent source. Custom software can make that relationship easier to work with, but it also needs to preserve the boundaries between systems.

My work covered the practical gaps around those records: complex purchasing, supplier coordination, backorders, product and document deliveries, and billing. These are areas where people need to see what has happened so far and what they are responsible for doing next. A transfer of data is useful only if the receiving person or system can interpret it correctly.

A good way to understand the design problem is to follow a partially fulfilled order and the questions it creates for each team.

## Following an order across several suppliers

Suppose a customer orders three items, each coming from a different supplier. Two arrive while the third remains outstanding, and the customer is willing to receive a partial delivery. The system needs to preserve both the progress and the unfinished work: what was ordered, what has arrived, what can be dispatched and what the customer is still waiting for.

It also needs to keep the relevant people informed without asking them to infer the whole situation from a single order status. Purchasing needs to follow up the remaining supplier, sales needs to communicate with the customer, and the warehouse needs to know exactly which items are authorised for dispatch. Finance may still be checking the document package associated with that delivery.

If all of those concerns are collapsed into “complete” or “incomplete,” the status becomes difficult to trust. Separate quantities and stages allow someone to see why an order has progressed in one respect while remaining open in another.

## Where OCR fits into the picture

The wider work includes OCR for reading inbound product labels and supplier invoices. OCR is software that extracts text from an image or scanned document, which can reduce the amount someone has to type before checking a receipt. I worked with others on this part of the platform, and work on checking outbound products is still underway.

Reading the text is only the first step. If a supplier invoice and a physical label disagree, the workflow needs to retain both pieces of evidence and give someone a way to resolve the mismatch against the expected item. Simply choosing one and updating the record would make the data look clean while leaving the actual uncertainty unresolved.

## How this work supports the AI projects

The quotation assistant and sales models depend on the same underlying facts. A model may interpret a gap in purchases very differently if it knows an order is still outstanding, and a quote can only make a reliable availability statement if the stock information is current. That is why I see the operational work as part of the same story as the AI and modelling work.

It also offers a useful test of a system's design. When a product code, received quantity or delivery instruction does not agree with another record, the team needs to see the disagreement, understand its source and assign the next step. Making those situations easier to resolve gives people a more dependable foundation for the work that follows.

[The system-design walkthrough looks at how I would handle those boundaries when sales, finance and the warehouse disagree about an order.](/work/operations/system-design/)

[The architecture walkthrough follows those decisions into the application, database and workers, including how a small team would release and recover the system.](/work/operations/architecture/)

[For a smaller example from a team conversation, read how a date-picker request led me to look at the underlying data and shared holiday information.](/work/operations/date-picker/)
