---
layout: ../../../layouts/Article.astro
project: operations
slug: date-picker
title: "It started with a date picker"
dek: "A request in our billing and delivery tools is a small example of how I think about changes across the business."
---

Someone wanted to add automatic date selection to our billing and delivery tools. My first thought was about where those dates would come from. When we looked at the underlying data, it was stored as text.

Then there were the holidays. If the tool was going to select a date, it needed a way to account for them. Other workflows would need that information too, so I wanted us to have a central place to maintain it.

That's where my mind tends to go when someone asks for a change. I think about what it will depend on and what else in the business will depend on it. Working across the systems and the teams using them has made those connections familiar to me.

## What sits behind the date on the screen

People can often read a date written as text and understand it from context. Software needs a more consistent interpretation, especially when it starts comparing dates or using them to decide what should happen next.

For this request, I wanted to look at that foundation before relying on it for automatic selection. A date picker can make the screen easier to use, but the value it selects still needs to mean the same thing to the other tools reading it.

The holiday question goes beyond whether a particular day appears on a calendar. In billing and delivery, we need to understand what that day means for the work being scheduled. A shared list of holidays gives the tools a common starting point; the rules for choosing a billing date or a delivery date still need to be clear.

I wouldn't assume that every customer and every workflow follows the same schedule. Those are details to check with the people doing the work. The point of centralising the holiday information is to avoid maintaining several versions of the same fact and then having to explain why two tools disagree.

## Making the project smaller without leaving the problem behind

I'm comfortable breaking a project into smaller pieces. We can choose the relevant part, limit what the first release does and get it into use sooner. But the smaller version still needs to work within the wider business.

If we already know a feature will rely on dates being interpreted consistently, that needs attention as part of the feature. If several workflows need holiday information, we should consider how they will share it before each develops its own copy. Calling those things future improvements doesn't remove the dependency.

That doesn't mean I want a large new platform for every small request. For something like this, a shared calendar could begin as a modest data source with a clear owner. I'd want the team to know who updates it, which workflows read it and what happens when the information changes.

## Where I tend to contribute

I don't think of myself as the most technically knowledgeable person in the room. Other people may know the same things I do, or more. My contribution often comes from understanding how the business fits together and recognising what a decision will affect beyond the immediate task.

Working across different parts of the business has taught me to look beyond the immediate request. A change in one tool can affect the information another team relies on, or create a problem that only becomes visible later in the process. I pay attention to those connections because I've seen what happens when we overlook them.

If we can already see that a decision will cause trouble, addressing it is part of the job. I want to help the team move forward without leaving predictable problems for someone else to resolve.

If you'd like to see how these questions play out across a whole order, [the system-design story follows the different things sales, finance and the warehouse need to know](/work/operations/system-design/).
