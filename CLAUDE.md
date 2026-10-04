# kult8 website

Static site for kult8 (kult8.com): social events in Tel Aviv, run by two women. Hebrew is the main language; every page has an English twin.

## Pages
| Hebrew (RTL) | English (LTR) | What it is |
|---|---|---|
| index.html | index-en.html | Home: event cards, mailing-list signup, organizer contact form |
| chairs.html | chairs-en.html | "משחק הכיסאות" / Musical Chairs: paid community dinner, rotating tables and games |
| frisbee.html | frisbee-en.html | "סושיאל פריזבי" / Social Frisbee: free team game at Park HaHorshot |

Shared: `events.js` (sheet loading, CSV parsing, date helpers), `logo.png`, `favicon.png`.

## Rules
- **Every change goes to both languages.** If you edit a Hebrew page, make the same change on its English twin, and the reverse.
- **Hebrew copy uses feminine plural for "we"** (two women run kult8): אנחנו יוצרות, not יוצרים.
- Fonts: Hebrew pages use Frank Ruhl Libre + Heebo; English pages use Fraunces + Manrope.
- **Never hardcode events.** Event cards and event details come from a published Google Sheet (CSV); the URL lives only in `events.js`. To change event content, the sheet is edited, not the code.
- No `mailto:` links. Contact goes through the organizer form or WhatsApp.
- Images load from files (`logo.png`), never as base64.
- kult8 is kept fully separate from Ro's other events brand. Never add links, names or infrastructure from it.

## Sheet columns (events tab)
event, type, title, date, time, duration, location_note, price, includes, food, capacity, registration_open, register_link, show_on_home, details_url, home_when, home_desc, is_new, plus English versions: title_en, home_when_en, home_desc_en, duration_en, location_note_en, includes_en, food_en, register_link_en.
An event with no `title_en` doesn't appear on English pages.

## Forms
- Mailing list → `https://witches.app.n8n.cloud/webhook/kult8-signup`, sends `name, email, phone, lang, source, submitted_at` (chairs pages add `interest`).
- Organizer contact → `https://witches.app.n8n.cloud/webhook/kult8-contact`, sends `name, organization, email, phone, message, lang, page, submitted_at`.
- All forms validate email (must contain @ and a dot) before sending.
- Every form sends `lang` ("he"/"en") and `source` (the page file name).

## Links
- WhatsApp: +1 929-580-8187 → `https://wa.me/19295808187?text=...` (footer of every page)
- Instagram: https://www.instagram.com/kult.8/

## Testing
- `?demo=open` / `?demo=closed` on any page: preview with built-in sample events instead of the live sheet.
- `?debug=1`: shows how many rows loaded from the sheet and any error.
- Before finishing a change: open the affected pages (both languages) at desktop and phone width (390px), check for console errors and sideways scrolling, and test forms with `?demo=open`.

## Git
- Work on `main`. Commit with a short, clear message describing the change. Ro reviews and pushes.

## Open items
- Collapse the organizer contact form behind a button (both languages).
- Optional: when `home_when` is empty and `date` is set, show the formatted date on the card.
- Optional: a 1200×630 link-preview image for WhatsApp shares.
