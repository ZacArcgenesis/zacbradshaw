# Status: ready to deploy

Nothing is blocking. The page is four sections — Start here, Mock calls, Resume, Contact —
and everything on it is real: both calls, both sets of timestamps, your headshot, your
resume. No placeholder copy, nothing addressing you.

**Next step is `DEPLOY.md`.** Everything below is improvement, not repair.

To preview: `python preview.py`, then <http://127.0.0.1:8899>.
Editing happens in **`script.js`**, in the two blocks at the top.

---

## What's live now

| Call | Offer | Length | Marks |
|---|---|---|---|
| 01 | Puts people on the TED stage | 46:06 | 3 |
| 02 | Helps men save their marriage | 51:51 | 4 |

All seven timestamps verified to land inside their recording, and clicking one jumps the
player there.

I normalised your labels to sentence case so they match the rest of the page — "Uncovering
the true motivation" rather than "Uncovering the True Motivation" — and made one grammar
fix: *"Push past the surface reasoning and going deeper"* became *"Pushing past the surface
reasoning to go deeper"*, so it's parallel with the other gerunds. Nothing else changed.

---

## Worth doing — sharpen the mark notes

Your seven labels are accurate, and they're enough to ship. But most of them name a
*section* rather than a *moment*, and "Overcoming objections" appears on both calls.

A recruiter skims the panel to decide whether to click. Compare:

> 38:11 — Overcoming objections

> 38:11 — He says he needs to think about it. Watch me not take that at face value.

The second makes someone press play. The first reads like a chapter heading.

You're the only person who can write these, because only you know what actually happens at
those marks. One added clause each, in `script.js`:

```js
{ t: "38:11", note: "Overcoming objections — he stalls on price and I go back to the cost of staying put." },
```

If you only redo one, redo the two called "Overcoming objections." They're the moments a
sales manager most wants to see, and right now they're the least descriptive labels on
the page.

One more thing worth considering: **include a moment you didn't nail**, and say so. It
costs nothing and it makes the other six believable.

---

## Optional — the intro video

No placeholder sits in the hero. If `INTRO` is empty the player isn't rendered at all, so
the page reads fine as it is and the video slots in whenever you record it:

```js
const INTRO = {
  file: "assets/intro.mp4",
  youtube: "",
};
```

60 to 90 seconds. The shape, not a teleprompter:

> Hi, I'm Zac Bradshaw.
>
> You're watching this because my resume didn't get me a call. I know why. There's no
> sales job on it.
>
> So let me save you the trouble of looking. I've never carried a quota and I've never had
> a seat on a floor. If that's a hard filter for you, close the tab. No hard feelings.
>
> If it isn't — here's what I actually am.
>
> I've spent years learning to have the conversation most people avoid: the one about
> money, with somebody uncomfortable having it. One at a time. Figure out where they
> actually are, tell them the truth about it, help them decide something.
>
> This year I went and got trained properly. Discovery, objection handling, framing price,
> asking for the close. The calls below are what came out of that. They're unedited —
> you'll hear me get things right, and you'll hear the parts I'm still working on.
>
> Watch one. That's the whole ask. If you think there's something there, my number's at
> the bottom of this page, and I'll take your hardest objection live whenever you want.

**Delivery:**

- **Look at the lens, not at yourself.** Biggest tell of an amateur video.
- **Don't recite it.** Learn the beats and talk. A small stumble reads as human; a recited
  paragraph reads as rehearsed, which is fatal for a closer.
- **Plain background, light in front of you**, not behind.
- **Use a real mic if you have one.** The job is done entirely over audio.
- **One or two takes.** Fifteen will sound like fifteen.

---

## Optional — a third call

Copy a whole `{ ... }` block in `CALLS`; the layout handles any number.

Make it hard on purpose. The most useful thing to show a sales manager is the stall —
*"I need to think about it"*, *"I have to talk to my wife"* — because it's what their team
loses to most, and how you handle it says more than a clean close ever will.

---

## About the AI personas

The Mock calls section opens by saying both are real offers from real companies, run
against an AI prospect that holds its persona and objections without breaking, and that
it's a harder partner than a friend reading a script.

Keep something that says it. Disclosing up front costs nothing and reads as methodical;
letting a hiring manager work it out halfway through a video costs credibility you don't
get back. Reword freely — first paragraph under the "Unedited mock calls" heading in
`index.html`.
