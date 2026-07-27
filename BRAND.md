# Lighthouse International Learning Center — Brand Guide

Source of truth: `assets/lighthouse-logo-master.png` + the `@lighthousebsd` and `@lighthouseperbun` Instagram feeds. Colors below are sampled visually from those assets — treat as "close enough to build with," and swap in exact hex if a vector/source logo file turns up later.

Drop this file into any new repo as `BRAND.md` and reference it in the README so every site/app stays visually consistent across branches.

---

## 1. Logo

- **Primary lockup**: lighthouse icon + "LIGHTHOUSE" wordmark + "INTERNATIONAL LEARNING CENTER" tagline + "• MATH • ENGLISH • SCIENCE •" subject line, all in Navy. This is the master version — use it whenever there's room.
- **Compact lockup**: icon + "LIGHTHOUSE" + two-line tagline, no subject bullets — for tight spaces (favicons, social profile pics, letterheads).
- **Branch badge**: a rounded-rectangle pill in Terracotta with the branch name in cream condensed caps (e.g. "BSD CITY"), optionally paired with small black doodle accents (flower/starburst). Use this pattern any time a new branch needs distinguishing from the parent brand.
- **Icon alone**: the lighthouse tower + birds silhouette. Appears in both **Navy** and **Terracotta/red** across different posts — Navy is the safer default; the red variant shows up in map/expansion-announcement graphics. Pick one per product and stay consistent within it.

**Usage rules**
- Keep clear space around the icon roughly equal to the height of the lighthouse tower.
- Don't recolor the wordmark outside Navy or all-white (for dark backgrounds).
- The branch badge is a *tag*, not a replacement logo — always pair it with the full lockup, never standalone.
- Minimum size: keep "INTERNATIONAL LEARNING CENTER" legible — if it blurs, drop to the compact lockup instead of shrinking further.

---

## 2. Color Palette

| Token | Hex (approx.) | Role |
|---|---|---|
| `--navy` | `#1B2A47` | Primary — wordmark, headlines, primary UI text, icon default |
| `--terracotta` | `#A5482E` | Secondary — branch badges, CTAs, urgency/promo text |
| `--cream` | `#F3EAD8` | Text-on-terracotta, warm light backgrounds, badge fill |
| `--ocean-blue` | `#2E5C99` | Accent — alternate headline color in flyers, links |
| `--sage` | `#DCE3CB` | Soft background for kid/family-facing event content |
| `--paper` | `#F1EEE7` | Neutral light background (bio/spotlight posts) |
| `--ink` | `#16211C` | Body text on light backgrounds |
| `--black` | `#161616` | Decorative doodle accents only (flowers, bursts) — sparingly |

**Pairing patterns observed:**
- Navy + Cream + Terracotta = the "official" brand triad (logo, enrollment flyers, announcements).
- Sage + white illustration = kid-facing workshops/events (softer, playful register).
- Navy background + cream/white text = founder spotlights, staff bios, "serious credibility" posts.

```css
:root {
  --navy: #1B2A47;
  --terracotta: #A5482E;
  --cream: #F3EAD8;
  --ocean-blue: #2E5C99;
  --sage: #DCE3CB;
  --paper: #F1EEE7;
  --ink: #16211C;
  --black: #161616;
}
```

---

## 3. Typography

| Role | Style | Google Font |
|---|---|---|
| Wordmark / big headlines | Bold, condensed, all-caps sans | **Archivo Black** or **Anton** |
| Playful kid-event headlines | Rounded, thick outline, cartoon-ish | **Fredoka** or **Baloo 2** (bold/extrabold) |
| Script accents (sparingly) | Casual brush script | **Caveat** or **Permanent Marker** — one word max, never body text |
| Body copy / captions | Clean geometric sans | **Inter** or **Poppins** |
| Labels, dates, contact info | Same sans, smaller, wide letter-spacing | Inter, uppercase, `letter-spacing: 0.05em` |

```css
--font-display: 'Archivo Black', sans-serif;   /* wordmark, hero headlines */
--font-playful: 'Fredoka', sans-serif;          /* kid/event content only */
--font-script: 'Caveat', cursive;               /* rare accent word, never body */
--font-body: 'Inter', sans-serif;               /* everything else */
```

**Rule of thumb**: one register per piece of content. Official/enrollment/credibility content = Navy + Archivo Black + Inter. Kid workshop flyers = Sage + Fredoka + illustration. Don't mix the two registers in one design.

---

## 4. Voice & Content Patterns

- Warm, personal, first-person from staff ("I am thrilled to be hopping over to a new city...").
- Leads with **credibility markers**: years of experience (since 2012), student count, school partnerships, founder backgrounds.
- Consistent hashtag set: `#tempatlesbsdcity #bimbeldibsd #internationallearningcenterdibsd #bahasainggris`
- CTAs are direct and low-friction: "Contact us for inquiries," phone number + Instagram handle always visible.
- Nautical/lighthouse metaphor shows up in copy ("guiding light for students") — safe to lean on in taglines/microcopy.

---

## 5. Component Patterns

- **Info checklist rows** (`.feature-row`): navy rounded-rectangle border + checkmark badge in navy circle + bold caption text.
- **Promo badge** (`.badge-branch`): pill-shaped terracotta background, cream bold text — for "BSD CITY" / promo tags.
- **Curriculum trio**: IB / Cambridge / Pearson Edexcel logos always shown together as a credibility strip — never split.
- **Contact footer bar**: phone icon + number, Instagram icon + handle — consistent bottom pattern on all marketing pages.

```css
.badge-branch {
  display: inline-block;
  background: var(--terracotta);
  color: var(--cream);
  font-family: var(--font-display);
  padding: 8px 20px;
  border-radius: 24px;
  text-transform: uppercase;
}

.feature-row {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 2px solid var(--navy);
  border-radius: 12px;
  padding: 10px 16px;
  font-family: var(--font-body);
  font-weight: 600;
}
.feature-row .check {
  background: var(--navy);
  color: white;
  border-radius: 50%;
  width: 22px; height: 22px;
  display: flex; align-items: center; justify-content: center;
}
```

---

## 6. Assets

- `assets/lighthouse-logo-master.png` — the full navy lockup with lighthouse icon, wordmark, tagline, and subject line. Use as the canonical source; export cropped/compact/white versions from this as needed rather than recreating from scratch.

---

*Colors were sampled by eye from Instagram screenshots, not extracted from a design file — if a real logo/brand kit (Figma, Canva, Illustrator file) exists, pull exact hex/fonts from that and update this doc.*
