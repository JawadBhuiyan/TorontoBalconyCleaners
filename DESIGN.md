```markdown
# Design System: The Urban Observatory

## 1. Overview & Creative North Star

**Creative North Star: "The Urban Observatory"**
This design system rejects the cluttered, utilitarian aesthetic typical of the cleaning industry. Instead, it adopts the perspective of a luxury Toronto penthouse: high-altitude clarity, expansive views, and the pristine reflection of floor-to-ceiling glass.

We break the "template" look through **intentional asymmetry** and **tonal depth**. By layering semi-transparent surfaces and utilizing a high-contrast typography scale, we transform a service-based interface into a high-end editorial experience. The goal is to make the user feel the "squeaky clean" result before they even book the service, using breathing room and light to evoke the fresh air of a high-rise balcony.

---

## 2. Colors & Surface Architecture

The palette is anchored in crisp whites and atmospheric blues, accented by a sophisticated "Secondary" red that provides professional authority.

### The "No-Line" Rule
**Prohibit 1px solid borders for sectioning.** Structural boundaries must be defined exclusively through background color shifts or subtle tonal transitions. For example, a `surface-container-low` section should sit directly against a `surface` background to create a soft, sophisticated edge.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—stacked sheets of frosted glass.
- **Background (`#fbf9f8`):** The base canvas.
- **Surface Tiers:** Use `surface-container-lowest` to `highest` to define importance. An inner card should use a slightly higher tier than its parent container to create a natural, "physical" lift.

### The Glass & Gradient Rule
To achieve the signature "Urban Observatory" look:
- **Glassmorphism:** Use `surface-container-lowest` at 70-80% opacity with a `backdrop-blur` (12px–20px) for floating navigation bars and modal overlays.
- **Signature Gradients:** Main CTAs should utilize a subtle linear gradient from `primary` (`#0060a9`) to `primary_container` (`#0094ff`) at a 135-degree angle. This adds "soul" and depth that flat color cannot replicate.

---

## 3. Typography

The typography system uses **Inter** to convey modern, architectural precision.

- **Display (Large/Medium):** Reserved for hero headlines. Use `display-lg` (3.5rem) with tight tracking (-0.02em) to create a bold, editorial impact.
- **Headlines:** Used to anchor sections. `headline-lg` (2rem) provides an authoritative voice that feels trustworthy and established.
- **Body Text:** Use `body-lg` (1rem) for general descriptions. Ensure generous line-height (1.6) to maintain the "airy" feel of the system.
- **Labels:** Use `label-md` in all-caps with increased letter-spacing (0.05em) for small eyebrows above headlines to lean into the premium editorial aesthetic.

---

## 4. Elevation & Depth

Hierarchy is achieved through **Tonal Layering** rather than traditional drop shadows.

- **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` background. This creates a soft, "squeaky clean" lift without the "dirty" look of heavy shadows.
- **Ambient Shadows:** When a float is required (e.g., a booking modal), use a shadow tinted with the `on-surface` color (`#1b1c1c`) at 4%–6% opacity with a blur radius of 32px or higher. Never use pure black or grey shadows.
- **The "Ghost Border" Fallback:** If a container requires a border for accessibility, use the `outline-variant` token at **20% opacity**. 100% opaque borders are strictly forbidden.
- **Glassmorphism Depth:** semi-transparent containers allow the sky-blue primary tones to bleed through, softening the layout and making it feel integrated with the "Toronto sky" background.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), white text, `xl` (1.5rem) roundedness. Padding: `3` (1rem) vertical, `6` (2rem) horizontal.
- **Secondary:** `surface-container-highest` background with `primary` text. No border.
- **Tertiary:** Purely typographic with a `primary` color and an underline that appears only on hover.

### Cards & Lists
- **Forbid Divider Lines:** Use vertical white space from the Spacing Scale (specifically `8` or `10`) to separate list items.
- **Card Styling:** Use `md` (0.75rem) or `lg` (1rem) roundedness. Background should be `surface-container-lowest` to pop against the `surface` background.

### Input Fields
- **Styling:** Use a `surface-container-low` background. Avoid a full perimeter border; instead, use a 2px `primary` bottom-bar that animates on focus.
- **Error State:** Use the `error` (`#ba1a1a`) token for helper text and the bottom-bar color.

### Custom "Skyline" Chips
- **Selection Chips:** Use `tertiary_fixed` for the background with `on_tertiary_fixed` for text. These represent the "clear view" of a cleaned balcony.

---

## 6. Do's and Don'ts

### Do
- **Do** use intentional asymmetry. For example, a hero image of a Toronto skyline can overlap two different surface containers.
- **Do** prioritize "white space" as a functional element. Use the `16` (5.5rem) and `20` (7rem) spacing tokens for major section padding.
- **Do** use the `secondary` (`#b3291f`) color sparingly—only for critical alerts or the final "Book Now" action.

### Don't
- **Don't** use 1px solid dividers or borders. It breaks the "glass-like" illusion and makes the UI feel "boxed in."
- **Don't** use high-contrast shadows. If the shadow is clearly visible as a "shape," it is too dark. It should feel like a soft glow.
- **Don't** crowd the layout. If a section feels "busy," increase the spacing token by one level and remove a container border.
- **Don't** use standard "cleaning" icons (buckets/mops). Use architectural icons (balcony railings, window outlines, skyline silhouettes) to maintain the premium feel.

---

## 7. Spacing & Grid

This system utilizes a **Soft Grid** based on the provided spacing scale.
- **Standard Gutters:** Use `6` (2rem) for mobile and `10` (3.5rem) for desktop.
- **Section Breathing Room:** Use `24` (8.5rem) to separate major content blocks (e.g., between the Hero and the Service Gallery) to maintain the "Airy" brand promise.```