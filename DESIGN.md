---
name: Austin Kostreba — Stone Rings
description: A two-sided professional card that moves from paper daylight to charcoal night.
colors:
  paper-cream: "#f7ecda"
  charcoal: "#252831"
  link-plum: "#63406d"
  coral: "#a44834"
  selection-ink: "#0f3e60"
  night-paper: "#17151c"
  night-text: "#f2e8d8"
  ember-link: "#eca16e"
  ember-focus: "#ee7a45"
---

# Stone Rings

The day visual reference is `assets/plates/stone-rings.png`, supplied by Austin. Preserve the authentic pigment contours and plum, mauve, gray, and terracotta colors of its five individual forms. Night replaces those forms with `assets/plates/ember-coals.png`: five tactile charcoal-and-ember forms in matching positions. Keep the existing paper texture and sparse asymmetrical composition.

## Typography and copy

Use Libre Baskerville for the name, with a clean capital A; use Inter for body copy. Both are self-hosted. Inter is intentional here: its neutral shapes closely match the supplied reference’s supporting text. Keep the name on one line where it fits; mobile sizing scales down with the viewport. Keep copy left aligned and separate from artwork.

The role reads “Software engineering manager at Renaissance.” Supporting copy describes work on software that helps educators understand student needs and coordinate support. Do not imply ownership of engineering across all Renaissance MTSS products. Preserve the supplied career history, education, and LinkedIn destination.

## Artwork and motion

Five independent crops preserve the reference’s positions and sizes. A one-time 2D canvas operation removes cream paper around the actual pigment contours so the page paper shows through. Cropped source images remain as a fallback. No WebGL, fluid solver, dye diffusion, shape distortion, or water effect.

Each ring follows an independent elliptical path of roughly 7–9 px horizontally and 9–11 px vertically. Its long, deliberately slow cycle feels suspended while remaining visible at rest. A nearby mouse or pen introduces up to 10 px of smoothly eased repulsion, limited to a 220 px neighborhood. The rings stay in their general locations. Touch retains ordinary scrolling. Motion stops offscreen or in a hidden document; reduced motion displays the original stationary composition.

## Layout and accessibility

Desktop preserves the reference’s left-hand introduction and right-hand artwork. Below 900 px, remove the decorative artwork and let the concise introduction stand alone as a focused business card. Artwork is decorative and hidden from assistive technology. LinkedIn remains the only external action in Day mode, with a plum underline, coral hover, and visible keyboard focus. Night mode has no external link.

## Day and night

A compact Day/Night switch above the name changes the role-specific copy. Day presents Austin’s work as a software engineering manager at Renaissance and links to LinkedIn. Night presents his paid-on-call firefighter role at West Metro Fire-Rescue District and mentions nights and weekends and the communities of New Hope and Crystal.

Night turns the paper charcoal while retaining its texture, crossfades the rings into banked ember coals with a slow diffuse heat glow, and changes links to ember orange. A single authored environmental plate fills most of the right side behind the five primary forms: a continuous bed of unique charcoal fragments, ash, occlusion, and smoky atmospheric depth rather than duplicated foreground assets. Keep the plate soft, dim, and masked into the paper so the original five remain dominant. Where View Transitions are available, the new state expands in a circular reveal from the switch. The reveal never blocks or disables the switch, and a repeated action interrupts the current reveal cleanly. Other browsers receive the same state with a soft color transition. Reduced motion switches immediately. The switch is a native button with `role="switch"`, a visible focus state, explicit Day/Night labels, and an accessible action label.

No cards, navigation, headshots, shadows, glass, literal flame graphics, emergency iconography, or additional decoration.
