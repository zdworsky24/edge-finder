# Edge Finder — Roadmap

Goal: a +EV / arbitrage / line-shopping tool that's as useful as OddsJam at a fraction of the price.

Live app: https://zdworsky24.github.io/edge-finder/

## Where we are (Nov 10, 2026)

Built and working with live odds from The Odds API:

- **Books:** DraftKings, FanDuel, BetMGM, Caesars, Fanatics, Hard Rock (IL), Novig, Kalshi, Polymarket. Pinnacle is pulled as the fair-price reference only.
- **+EV tab:** finds bets priced better than the no-vig fair price, with a ¼-Kelly stake size.
- **Arbs tab:** finds guaranteed-profit pairs and splits the stake between them.
- **Middles tab:** finds both-sides bets at different numbers, with win/loss outcomes.
- **Odds tab:** full price screen with the best price highlighted and the fair line.
- **Filters:** sport, market, team search, min/max EV, odds range, books, Pinnacle-only, sort, hide, and a time window (6h / 24h / 3d / 7d / all).
- **Tap-to-compare sheet:** every book's price, EV, "your edge vs. that book," hold and line age.
- **Live updating:** auto-refresh (15s–5m), stale-line filter, beep/vibrate/notification alerts, Kalshi fees built in.

## The path to a product

### Step 1 — Prove the edges are real (next 2–4 weeks) ← WE ARE HERE
- [ ] Use the app daily; note anything missing or confusing
- [ ] Build a **bet log**: record bets from the app, track results, profit and **CLV** (closing line value)
- [ ] After 3–4 weeks, check: are we consistently beating the closing line?

### Step 2 — Shared backend + waitlist
- [ ] One server pulls odds once and serves every user, so data costs are shared
- [ ] User accounts
- [ ] Simple landing page + waitlist

### Step 3 — Beta with 10–20 bettors
- [ ] Recruit from your own network
- [ ] Free or cheap; learn what they'd actually pay and what they use
- [ ] Decide pricing tiers (target well under OddsJam; Outlier starts ~$20/mo, OddsShopper has a free tier)

### Step 4 — Business basics before charging
- [ ] **Data licensing:** confirm with the odds provider that reselling their data in a paid app is allowed (likely needs a commercial plan)
- [ ] Faster data feed once revenue supports it (arbs last seconds to minutes)
- [ ] Payments (some processors are strict with gambling-related products), terms of service, responsible-gambling language

## Feature ideas (backlog)
- Player props (biggest +EV volume, but uses a lot more data credits)
- AI assistant: plain-English questions over loaded odds, a "Why?" explanation on each bet, injury/news check via web search. Code does all math; the AI only explains.
- Daily edge summary
- More books/markets as accounts are added

## Differentiation ideas
- Prediction markets (Kalshi, Novig, Polymarket) treated as first-class
- Mobile-first design
- Illinois/Midwest focus
- AI explanations built on real sports knowledge
