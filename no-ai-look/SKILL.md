---
name: no-ai-look
description: Review a page or component for generic "AI-generated" styling and copy, and strip it. Use during the polish review, after building any section, or whenever a design looks templated.
---

# No AI look

Review the rendered page (take screenshots, don't judge from code alone) and the source. For every item below that you find, either remove it or write one sentence explaining why this specific brief needs it. "It looks nice" is not a reason.

## Visual tells

- A shadow under every card. Use borders, spacing or background contrast instead. One elevation level at most, and only where something really sits above the page.
- Content chopped into identical rounded cards, especially three in a row with an icon, a title and two lines.
- One border radius on everything regardless of hierarchy, or pill-shaped buttons everywhere.
- Purple, blue or "aurora" gradients, glassmorphism, glow, blurred blobs or mesh backgrounds used as decoration.
- Everything centered. Pick an alignment that suits the content; long text is left-aligned.
- Inter, Roboto or system UI as the only font, with no real type hierarchy.
- A tracked-out ALL-CAPS eyebrow label above every heading.
- One word in a headline set in a different color, italic or gradient.
- Numbered markers (01 / 02 / 03) on content that isn't a sequence.
- Fade-and-slide-up on every section, or hover lift on every card. Keep one deliberate motion moment per page.
- Emoji used as icons or in headings.
- "→" appended to every link and button.
- Meta strings joined with middle dots ("A · B · C") and "WORD — fragment" labels.
- Stock 3D illustrations, abstract blobs, or a hero that would work for any company.
- Near-black stand-ins (#0B0B0B, #111) used where the palette doesn't call for them.

## Copy tells

- Greetings: "Hey there 👋", "Welcome to…", "Hi, we're…".
- Hype verbs: unlock, supercharge, elevate, empower, revolutionize, seamless, cutting-edge, next-level, game-changer.
- "In today's fast-paced world…" and any opening that could fit any business.
- Vague CTAs: "Get started", "Learn more", "Submit". A CTA says exactly what happens: "Book a 20-minute call".
- Triplets of abstract benefits ("Fast. Simple. Powerful.").
- Exclamation marks in body copy.

## Output

List each tell found as `file:line — tell — fix`, apply the fixes, then screenshot again to confirm. End with the one element that is deliberately bold on this page; everything else should be quiet.
