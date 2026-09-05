# Coffee++ — Client Site (Public Ordering)

The customer-facing half of the **Coffee++** booth ordering system. People browse
the menu, tell us **how they want to be called** (the name our staff shouts
when the order is ready — required), add their **name (required)** and
**email (optional)**, choose **GCash** or **Pay at Booth**, and get an
**Order QR** that carries the complete order — ready to be scanned at the
booth. Want more of the same order later? The staff can just scan the same
QR again — every scan adds another copy.

This app is **fully self-contained**: no server, no database, no admin pages.
It can be published anywhere Next.js runs. Booth operations (scanning, sales
tracking, reports) live in the separate `coffeepp-admin` project.

## Run locally

```bash
npm install        # or: bun install
npm run dev        # http://localhost:3000
```

## Run it in VS Code

1. Unzip the download, then **File → Open Folder… → `coffeepp-client`**.
2. Open the built-in terminal (**Ctrl + `**) and run the two commands above.
3. Ctrl+Click the `http://localhost:3000` link in the terminal output.

> Node 20+ required (or Bun — either works). No `.env`, no database, nothing
> else to configure — the whole menu lives in `src/data/menu.json`.

## Publish / deploy

```bash
npm run build
npm run start      # or deploy the repo to Vercel / Netlify / any Node host
```

### Deploy to Vercel via GitHub (recommended)

1. Put this folder on GitHub:
   - In VS Code: **Source Control → Publish to GitHub** (pick a name like
     `coffeepp-client`), **or** in the terminal:
     ```bash
     git init
     git add .
     git commit -m "Coffee++ client site"
     git branch -M main
     git remote add origin https://github.com/<your-username>/coffeepp-client.git
     git push -u origin main
     ```
2. Go to **vercel.com → Add New → Project → Import** your `coffeepp-client`
   repo. Vercel auto-detects Next.js — **no environment variables needed**.
3. Click **Deploy**. You get a live URL like `https://coffeepp-client.vercel.app`
   — that's the link you share with customers (QR codes on posters, etc.).
4. To change the menu later: edit `src/data/menu.json` → commit → push.
   Vercel redeploys automatically in about a minute.

> Tip: if `git commit` complains about identity, run
> `git config --global user.name "Your Name"` and
> `git config --global user.email "you@example.com"` first.
> Keep the `coffeepp-admin` project out of this repo — publish the client
> repo only.

## Editing the menu — `src/data/menu.json`

Everything the site shows comes from one local file:

| Field | What it controls |
| --- | --- |
| `booth.boothName` | Brand name shown in the countdown / hero |
| `booth.startDate` / `booth.endDate` | Countdown + when ordering is allowed (before opening the ORDER button explains the booth isn't open yet; after closing, ordering is disabled) |
| `booth.gcashNumber` | GCash number shown at checkout and in Payment & Contact |
| `booth.specsNumber` | Booth contact number |
| `booth.contactEmail` | Booth contact email (tap-to-email link; empty string hides it) |
| `products[]` | id, name, description, price, image, category, `available` (false = SOLD OUT), `hasTemperature` (HOT / COLD choice) |

Edit the file → redeploy. That's the whole workflow.

**Preferred workflow when you run the Booth Console:** open the console's
**Settings → Client site menu → Export coffeepp-menu.json**, replace
`src/data/menu.json` with the downloaded file, and redeploy this site. Prices,
availability and booth dates stay in sync automatically.

## How ordering works

1. Customer picks a product (HOT/COLD where offered, quantity up to 10).
2. **How should we call you?** — the call-out name (required). This is what
   the staff shouts when the order is ready, so a nickname works great.
3. Name is required; email is optional (validated when provided).
4. Payment method: **GCash** (number + instructions shown) or **Pay at Booth**.
5. The order is created **on the customer's device** — a compact ID like
   `ORD-K7F2Q9` and an **Order QR containing the full order data**
   (ID, call-out name, name, email, items, total, payment, timestamp).
6. The customer shows the QR at the booth; staff scan it in the Booth Console,
   which registers and tracks the order. **Re-scanning the same QR adds
   another copy of the order** — the customer can just ask for another scan
   if they want more.
7. Orders are saved on the device ("My Orders") so the QR can be re-opened
   anytime. Screenshots work too.

## Tech

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · shadcn/ui ·
`qrcode` for on-device QR generation · Zustand (persisted orders) ·
Fraunces + Plus Jakarta Sans.
