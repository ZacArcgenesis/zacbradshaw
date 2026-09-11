# Putting the site online

GitHub Pages, free, no account limits to worry about. Written assuming you've never
used git. Takes about fifteen minutes the first time and about thirty seconds every
time after that.

---

## Before you start

You need a [GitHub account](https://github.com/signup) and
[git installed](https://git-scm.com/download/win). Both free.

Check git is working — open PowerShell in this folder and run:

```powershell
git --version
```

If that prints a version number, you're set.

---

## Step 1 — Preview it locally

Always look at it before you push it. In this folder:

```powershell
python preview.py
```

Then open <http://127.0.0.1:8899>. Press `Ctrl+C` in the terminal to stop.

**Use `preview.py`, not `python -m http.server`.** The built-in server ignores HTTP Range
requests, which means video scrubbing is dead locally — you can't drag the progress bar and
clicking a timestamp does nothing. That is purely a preview artefact; GitHub Pages serves
byte ranges correctly, so the live site is unaffected. `preview.py` handles ranges so the
local copy behaves the way the deployed one will.

> Double-clicking `index.html` also mostly works, but browsers block local video that way.
> The command above is the reliable preview.

> If a video ever spins forever, close the tab and open a fresh one. Chrome's media pipeline
> occasionally gets stuck after a server restart and a new tab clears it.

---

## Step 2 — Create the repository

On GitHub, click **New repository**.

- **Name:** `zacbradshaw` — this becomes your URL, so keep it clean. Avoid anything with
  "job", "application", or a company name in it; recruiters see the URL.
- **Public.** Pages needs it to be public on a free account. That's fine — nothing here
  is secret, the whole point is for people to see it.
- **Don't** tick "Add a README". You want it empty.

Leave that page open; you'll need the URL it shows you.

---

## Step 3 — Push this folder up

In PowerShell, in this folder. Replace `YOUR-USERNAME` with your GitHub username:

```powershell
git init
git add .
git commit -m "Application site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/zacbradshaw.git
git push -u origin main
```

The push will take a couple of minutes — it's carrying about 90 MB of video. That's
normal and it only happens once.

If it asks you to sign in, a browser window will open. Sign in there.

---

## Step 4 — Turn Pages on

In the repository on GitHub: **Settings** → **Pages** (left sidebar).

Under "Build and deployment", set **Source** to `Deploy from a branch`, **Branch** to
`main`, folder `/ (root)`. Click **Save**.

Wait two or three minutes, then load:

```
https://YOUR-USERNAME.github.io/zacbradshaw/
```

**Open it on your phone before you send it anywhere.** Recruiters open links between
meetings, on a phone, on cellular. That's the real test.

---

## Making changes later

Edit the files, preview locally, then:

```powershell
git add .
git commit -m "Added timestamps to call 01"
git push
```

Live again in about a minute.

---

## About the videos

Your two mock calls sit in `assets/calls/` and are served straight from the repo. That
works and it's the simplest setup — no YouTube account, no embeds, nothing to break.

Two limits to know about:

- **GitHub rejects any single file over 100 MB.** Yours are 42 MB and 48 MB, so you're
  fine. A future recording that's bigger will need to be compressed or hosted elsewhere.
- **Video served this way doesn't adapt to slow connections.** On weak cellular it will
  buffer where YouTube wouldn't.

If a file gets too big, or the buffering bothers you, upload it to YouTube as **unlisted**
(unlisted, not private — private videos won't embed) and swap the fields in `script.js`:

```js
file: "",
youtube: "dQw4w9WgXcQ",   // just the ID from the watch?v=... link
```

The page handles the rest, and the clickable timestamps keep working either way.

### The duplicate folder

The `Mock Calls/` folder holds your original files. `assets/calls/` holds the copies the
site actually uses. `.gitignore` keeps the originals out of the repo so you're not
uploading 90 MB twice. Once you're happy the site works, you can delete `Mock Calls/`
locally — or keep it as a backup, it costs nothing.

---

## A custom domain, if you want one

`YOUR-USERNAME.github.io/zacbradshaw` is perfectly respectable. But `zacbradshaw.com`
on a resume is better, and it's about $12 a year.

Buy the domain (Namecheap, Cloudflare, Porkbun — any of them). Then in your repo:
**Settings** → **Pages** → **Custom domain**, enter the domain, save. GitHub will tell
you exactly which DNS records to add at your registrar. Add them, wait an hour, tick
**Enforce HTTPS**.

---

## The part that isn't technical

The site doesn't work if nobody clicks it. Once it's live, the URL needs to be:

- In the header of your resume PDF, next to your phone number
- In your LinkedIn headline and the featured section
- In the **first line** of every application and every recruiter message — not the last

Something like: *"Before the resume — I put my mock calls and a 90-second intro here:
zacbradshaw.com. Judge the calls, not the CV."*

That's the whole play. The page handles the objection; you still have to make people
look at it.
