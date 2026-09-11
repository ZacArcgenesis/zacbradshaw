/* ==========================================================================
   EDIT THIS FILE TO UPDATE THE PAGE.

   Everything you'll need to change lives in the two blocks below. You do not
   need to touch index.html or styles.css.

   Rules that matter:
     - Keep the quote marks. "like this".
     - Keep the commas at the end of each line.
     - An empty value ("") just means "not ready yet". The page handles it.
   ========================================================================== */


/* --------------------------------------------------------------------------
   1. YOUR INTRO VIDEO
   --------------------------------------------------------------------------
   Two ways to do this. Use ONE of them, leave the other as "".

   file:    a video sitting in this project, e.g. "assets/intro.mp4"
            (keep it under 100 MB; GitHub rejects files bigger than that)
   youtube: just the ID from an unlisted YouTube link. If the link is
            https://www.youtube.com/watch?v=dQw4w9WgXcQ
            then the ID is                       dQw4w9WgXcQ
-------------------------------------------------------------------------- */

const INTRO = {
  file: "",
  youtube: "",
};


/* --------------------------------------------------------------------------
   2. YOUR MOCK CALLS
   --------------------------------------------------------------------------
   Each { ... } block is one call. Copy a whole block to add a fourth.

   title    What was being sold and what went wrong. Be specific. This is the
            line that decides whether anyone presses play.
   watchFor One sentence of context: what the offer is, or the skill on show.
   marks    The timestamps worth jumping to. 2-4 per call is right.
            t    = where it happens, as it reads on the player, e.g. "7:12"
            note = what you're doing there, in your own words

   >> The marks are the most valuable thing on this page. Do not skip them. <<
-------------------------------------------------------------------------- */

const CALLS = [
  {
    title: "Selling a program that puts people on the TED stage",
    watchFor: "A real offer from a real company. It's the one I worked through my whole training program on.",
    file: "assets/calls/mock-call-tedtalk.mp4",
    youtube: "",
    marks: [
      { t: "3:14",  note: "Uncovering the true motivation" },
      { t: "15:27", note: "Working through self-doubt" },
      { t: "38:11", note: "Overcoming objections" },
    ],
  },
  {
    title: "Selling a program that helps men save their marriage",
    watchFor: "A real offer: helping men become the man they want to be and the one their wife needs. I ran the company's own call outline.",
    file: "assets/calls/mock-call-coaching.mp4",
    youtube: "",
    marks: [
      { t: "2:07",  note: "Pushing past the surface reasoning to go deeper" },
      { t: "4:32",  note: "Uncovering the urgency" },
      { t: "11:31", note: "Discovering the true fear" },
      { t: "39:47", note: "Overcoming objections" },
    ],
  },
];


/* ==========================================================================
   Below here is the machinery. You shouldn't need to change any of it.
   ========================================================================== */

const $ = (sel, root = document) => root.querySelector(sel);

/** "7:12" or "1:02:30" -> seconds */
function toSeconds(stamp) {
  const parts = String(stamp).split(":").map(Number);
  if (parts.some(Number.isNaN)) return 0;
  return parts.reduce((total, part) => total * 60 + part, 0);
}

/** 3111 -> "51:51" */
function asClock(seconds) {
  const total = Math.round(seconds);
  const m = Math.floor(total / 60);
  return `${m}:${String(total % 60).padStart(2, "0")}`;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

/** Builds the video/iframe/placeholder that goes inside a .player__stage */
function buildStage(stage, source, emptyMessage) {
  stage.replaceChildren();

  if (source.file) {
    const video = el("video");
    video.src = source.file;
    video.controls = true;
    video.preload = "metadata";
    video.playsInline = true;
    stage.append(video);
    return { kind: "file", node: video };
  }

  if (source.youtube) {
    const frame = el("iframe");
    frame.src = `https://www.youtube-nocookie.com/embed/${source.youtube}?rel=0`;
    frame.title = source.title || "Recording";
    frame.allow = "accelerometer; encrypted-media; picture-in-picture; fullscreen";
    frame.allowFullscreen = true;
    frame.loading = "lazy";
    stage.append(frame);
    return { kind: "youtube", node: frame, id: source.youtube };
  }

  const empty = el("div", "player__empty");
  empty.append(el("strong", null, "No recording yet"));
  empty.append(el("p", null, emptyMessage));
  stage.append(empty);
  return { kind: "empty" };
}

/** Jump a player to a timestamp and start it */
function seekTo(player, stamp) {
  const seconds = toSeconds(stamp);
  if (player.kind === "file") {
    player.node.currentTime = seconds;
    player.node.play().catch(() => { /* autoplay blocked; the seek still landed */ });
  } else if (player.kind === "youtube") {
    player.node.src =
      `https://www.youtube-nocookie.com/embed/${player.id}?rel=0&start=${seconds}&autoplay=1`;
  }
}

/* --- Intro video --------------------------------------------------------- */

// Until there's an intro video, the player hides rather than showing an empty
// frame. A missing section reads better to a visitor than a broken one. Set
// INTRO above and it reappears on its own.
if (INTRO.file || INTRO.youtube) {
  buildStage($("#introStage"), INTRO, "");
} else {
  $("#introPlayer").remove();
}

/* --- Call cards ---------------------------------------------------------- */

function renderCall(call, index) {
  const hasRecording = Boolean(call.file || call.youtube);

  const card = el("article", "call" + (hasRecording ? "" : " call--pending"));

  const head = el("div", "call__head");
  head.append(el("span", "call__no", `Call ${String(index + 1).padStart(2, "0")}`));
  head.append(
    el("h3", "call__title", call.title || "Not recorded yet")
  );

  if (call.watchFor) {
    head.append(el("p", "call__watch", call.watchFor));
  } else if (!hasRecording) {
    head.append(
      el("p", "call__watch", "Recorded soon. It will show up here, unedited, like the others.")
    );
  }
  card.append(head);

  const grid = el("div", "call__grid");

  const player = el("div", "player");
  const bar = el("div", "player__bar");
  bar.append(el("span", "dot"));
  bar.append(el("span", "player__label", `Call ${String(index + 1).padStart(2, "0")}`));
  const meta = el("span", "player__meta", hasRecording ? "Unedited" : "Pending");
  bar.append(meta);
  player.append(bar);

  const stage = el("div", "player__stage");
  player.append(stage);
  grid.append(player);

  const handle = buildStage(stage, call, "This one hasn't been recorded yet.");

  // Show the real runtime once the browser knows it. Telling someone a call is
  // 46 minutes up front is fairer than letting them discover it after pressing
  // play, and it's what makes the timestamps below obviously worth using.
  if (handle.kind === "file") {
    handle.node.addEventListener("loadedmetadata", () => {
      if (Number.isFinite(handle.node.duration)) {
        meta.textContent = `Unedited · ${asClock(handle.node.duration)}`;
      }
    });
  }

  const marks = el("div", "marks");
  if (call.marks && call.marks.length) {
    marks.append(el("p", "marks__kind", "Jump to"));
    call.marks.forEach((mark) => {
      const button = el("button", "mark");
      button.type = "button";
      button.append(el("span", "mark__t", mark.t));
      button.append(el("span", "mark__note", mark.note));
      button.addEventListener("click", () => seekTo(handle, mark.t));
      marks.append(button);
    });
  }
  if (marks.childElementCount) grid.append(marks);

  card.append(grid);
  return card;
}

const callList = $("#callList");
CALLS.forEach((call, index) => callList.append(renderCall(call, index)));

// The page never nags a visitor about unfinished fields; it just leaves them
// out. The reminder lives here instead, where only Zac will run into it.
CALLS.forEach((call, index) => {
  if (!(call.file || call.youtube)) return;
  const missing = [];
  if (!call.watchFor) missing.push("watchFor");
  if (!call.marks || !call.marks.length) missing.push("marks");
  if (missing.length) {
    console.warn(
      `Call 0${index + 1} is missing ${missing.join(" and ")}. See RECORD-THIS.md. ` +
      `The page renders fine without them, but the timestamps are what make a long call worth clicking.`
    );
  }
});

// Only promise clickable timestamps once some exist.
const callsHint = $("#callsHint");
if (callsHint) {
  if (CALLS.some((c) => c.marks && c.marks.length)) {
    callsHint.textContent =
      "I've marked the moments worth your time. Click a timestamp and the recording jumps there.";
  } else {
    callsHint.remove();
  }
}

/* --- Resume document card ------------------------------------------------ */

// The gradient at the foot of the card signals there is more page below it.
// Once you reach the end it has nothing left to signal, so it gets out of the
// way rather than sitting on top of the last line.
const docBody = $(".doc__body");
const docFade = $(".doc__fade");

if (docBody && docFade) {
  const updateFade = () => {
    const atEnd = docBody.scrollTop + docBody.clientHeight >= docBody.scrollHeight - 4;
    docFade.style.opacity = atEnd ? "0" : "1";
  };
  docBody.addEventListener("scroll", updateFade, { passive: true });
  window.addEventListener("resize", updateFade);
  updateFade();
}

/* --- Timecode rail: progress, active section, zone-aware colour ---------- */

const rail = $("#rail");
const railFill = $("#railFill");
const links = Array.from(rail.querySelectorAll("a"));
const sections = links
  .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
  .filter(Boolean);

const railList = rail.querySelector(".rail__list");
let ticking = false;
let lastActive = -1;

function updateRail() {
  ticking = false;

  const scrolled = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(scrolled / scrollable, 1) : 0;
  const vertical = window.matchMedia("(min-width: 60rem)").matches;
  railFill.style[vertical ? "height" : "width"] = `${progress * 100}%`;
  railFill.style[vertical ? "width" : "height"] = "100%";

  // Active section: the last one whose top has passed the middle of the viewport.
  // Mid-viewport matters on desktop: the rail sits there, so its colour always
  // matches the zone it is actually drawn over.
  const line = scrolled + window.innerHeight * 0.5;
  let active = 0;
  sections.forEach((section, index) => {
    if (section.offsetTop <= line) active = index;
  });

  links.forEach((link, index) =>
    link.setAttribute("aria-current", index === active ? "true" : "false")
  );
  rail.dataset.on = sections[active].dataset.zone || "dark";

  // On phones the rail is a horizontal strip, so the active timecode can end up
  // off-screen. Pull it back into view whenever it changes.
  if (active !== lastActive) {
    lastActive = active;
    if (railList.scrollWidth > railList.clientWidth) {
      const link = links[active];
      railList.scrollTo({
        left: link.offsetLeft - (railList.clientWidth - link.offsetWidth) / 2,
        behavior: "smooth",
      });
    }
  }
}

function onScroll() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(updateRail);
  }
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
updateRail();

/* --- Load-in ------------------------------------------------------------- */

const intro = ["#open .eyebrow", "#open .ident", "#open .display", "#open .lede", "#open .player"];
intro.forEach((sel, index) => {
  const node = $(sel);
  if (!node) return;
  node.classList.add("rise");
  node.style.animationDelay = `${index * 90}ms`;
});
