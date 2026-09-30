# Toronto Balcony Cleaners (TBC)

A modern, premium web application for Toronto Balcony Cleaners — built on **Cloudflare Workers** with a luxury "Urban Observatory" design system.

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | Cloudflare Workers (via Wrangler) |
| **Language** | JavaScript (ES Modules) |
| **Assets** | Static files served from `public/` via Workers Assets |
| **Styling** | Custom design system (CSS variables + utility classes) — see `DESIGN.md` |
| **Typography** | Inter (self-hosted or CDN) |
| **Deployment** | Wrangler CLI → Cloudflare Workers |
| **Dev Environment** | Miniflare (local Workers simulation) |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js ≥ 20** (Wrangler v4 requirement)
- **npm** (or pnpm/yarn/bun)
- **Cloudflare account** (for deployment)

### Installation
```bash
# Clone and install dependencies
cd TBC
npm install
```

### Development
```bash
# Start local dev server (Miniflare)
npm run dev
# → Opens at http://localhost:8787 (default Wrangler port)
```

### Deploy
```bash
# Deploy to Cloudflare Workers (preview by default)
npm run deploy

# Or deploy to a specific environment
wrangler deploy --env production
```
---

## 📁 Project Structure

```
TBC/
├── public/                 # Static assets (served directly)
│   ├── index.html          # Entry HTML
│   ├── styles.css          # Compiled/authored CSS
│   ├── app.js              # Client-side JS
│   └── assets/             # Images, fonts, etc.
├── src/
│   └── worker.js           # Cloudflare Worker entry point
├── DESIGN.md               # Design system specification (THE source of truth)
├── wrangler.toml           # Workers configuration
├── package.json            # Scripts & dependencies
└── .gitignore
```

### Key Files

| File | Purpose |
|------|---------|
| `src/worker.js` | Worker logic — routing, API handlers, HTML rewriting, etc. |
| `public/index.html` | Base HTML shell (should reference `/styles.css`, `/app.js`) |
| `wrangler.toml` | Binding config, vars, compatibility date, assets directory |
| `DESIGN.md` | **Complete design system** — colors, typography, components, rules |

---

## 🎨 Design System: "The Urban Observatory"

The entire visual language is documented in **[`DESIGN.md`](./DESIGN.md)**. It is the **single source of truth** for all UI decisions.

### Core Principles
- **No 1px borders** — use surface tier shifts for boundaries
- **Glassmorphism** — `surface-container-lowest` at 70–80% opacity + `backdrop-blur(12–20px)`
- **Tonal elevation** — layer `surface-container-*` tiers instead of drop shadows
- **Intentional asymmetry** — editorial, penthouse-feel layouts
- **Generous spacing** — `16` (5.5rem) / `24` (8.5rem) section padding

### Quick Reference

| Token Category | Key Values |
|----------------|------------|
| **Primary** | `#0060a9` (sky blue) → `#0094ff` (gradient) |
| **Secondary** | `#b3291f` (deep red — sparingly, for CTAs/alerts) |
| **Surfaces** | `surface` → `surface-container-lowest` … `surface-container-highest` |
| **Typography** | Inter — Display (3.5rem), Headline (2rem), Body (1rem, 1.6 line-height) |
| **Rounded** | `xl` (1.5rem) buttons, `md`/`lg` (0.75/1rem) cards |
| **Spacing Scale** | 4px base — tokens `0`–`24` (0–8.5rem) |

> **Rule:** Never hardcode hex values in CSS. Use the semantic tokens defined in `DESIGN.md` (or CSS custom properties mapped to them).

---

## ⚙️ Configuration

### `wrangler.toml`
```toml
name = "toronto-balcony-cleaners"
compatibility_date = "2024-09-23"
main = "src/worker.js"

[assets]
directory = "./public"
binding = "ASSETS"

[vars]
BUSINESS_EMAIL = "bookings@torontobalconycleaners.com"
FROM_EMAIL = "noreply@torontobalconycleaners.com"
```

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `BUSINESS_EMAIL` | Where booking inquiries are sent | Yes |
| `FROM_EMAIL` | Sender address for transactional emails | Yes |

> **Secrets** (API keys, email credentials) should be set via `wrangler secret put` — never committed.

---

## 🛠 Development Workflow

### Adding a New Page/Route
1. Create `public/your-page.html` (or add a route handler in `src/worker.js`)
2. Link styles/scripts using absolute paths: `/styles.css`, `/app.js`
3. Test locally with `npm run dev`

### Styling Approach
- Author CSS in `public/styles.css` using **CSS custom properties** that mirror the design tokens
- Utility classes (e.g., `.btn-primary`, `.card`, `.glass-nav`) are defined in the same file
- **No build step** for CSS — keep it browser-native

### Client-Side JS
- `public/app.js` runs in the browser
- Use for: mobile nav toggle, form enhancements, smooth scroll, interstitial animations
- Keep it lightweight; no framework runtime

---

## 📦 Deployment

### Environments
Configure multiple environments in `wrangler.toml`:
```toml
[env.preview]
vars = { ENVIRONMENT = "preview" }

[env.production]
vars = { ENVIRONMENT = "production" }
```

Then deploy:
```bash
# Preview (default)
npm run deploy

# Production
wrangler deploy --env production
```

### Custom Domain
1. Add domain in Cloudflare Dashboard → Workers & Pages → Custom Domains
2. Ensure DNS is proxied (orange cloud)
3. HTTPS/SSL is automatic

---

## 🔧 Common Commands

```bash
# Local development with live reload
npm run dev

# Tail logs from deployed worker
wrangler tail

# Put a secret (e.g., RESEND_API_KEY)
wrangler secret put RESEND_API_KEY

# List secrets
wrangler secret list

# View deployed worker details
wrangler whoami
wrangler deployments list
```

---

## 🧪 Testing Checklist (Pre-Deploy)

- [ ] `npm run dev` loads without console errors
- [ ] Mobile nav works (hamburger → drawer)
- [ ] Forms submit → Worker handles POST → email sent
- [ ] Glassmorphism surfaces render correctly (backdrop-blur)
- [ ] Gradients on primary buttons visible
- [ ] No 1px solid borders anywhere
- [ ] Spacing tokens used consistently (no magic numbers)
- [ ] `secondary` red used **only** for final CTA / critical alerts
- [ ] Typography scale respected (Display → Headline → Body → Label)

---

## 📚 Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- [Workers Assets Binding](https://developers.cloudflare.com/workers/configuration/bindings/assets/)
- [Miniflare Local Development](https://github.com/cloudflare/miniflare)

---

## 🤝 Contributing

1. Read `DESIGN.md` **before** touching UI
2. Follow the "No-Line" and "Glass & Gradient" rules
3. Keep `src/worker.js` focused on routing/edge logic
4. Static assets belong in `public/`
5. Run `npm run dev` and verify visually before PR

---

**Built with care for Toronto's high-rise living.** 🏙️