# Interactive fluid / ink background references

Research date: 2026-09-07

## Recommendation

Use **Pavel Dobryakov's WebGL Fluid Simulation** as the physics and pointer-interaction reference, and **Volcomix's Ink Drop** as the visual reference. The former already has the core behavior the current background lacks: a persistent velocity field, dye advection, vorticity, and pointer movement injected as force instead of a displaced graphic that springs back. The latter is the closest direct reference for the desired “single ink droplet spreading and curling in water” look.

For integration ergonomics, inspect **fluid-cursor** and **smokey-fluid-cursor**. They package the same class of solver as a full-screen site background and expose the useful tuning parameters directly.

## Ranked live examples

### 1. PavelDoGreat — WebGL Fluid Simulation

- **Live:** <https://paveldogreat.github.io/WebGL-Fluid-Simulation/>
- **Source:** <https://github.com/PavelDoGreat/WebGL-Fluid-Simulation>
- **Why open it:** Best general physics reference. Dragging through the canvas injects velocity and dye into a continuously evolving fluid field; motion curls, advects, and dissipates instead of snapping back to a predefined pose.
- **Technique:** WebGL fragment-shader stable-fluid solver: velocity/dye advection, curl and vorticity confinement, divergence, iterative pressure solve, and gradient subtraction. Its own README points to NVIDIA's GPU fluid chapter and earlier GPU fluid experiments as foundations. [Source README](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation#readme)
- **Visual fit:** Excellent motion and disturbance, but the default rainbow splats are not the target art direction. Retune to one dark dye, transparent/light background, slow dissipation, a localized initial emitter, and gentler periodic force.
- **Interaction caveat:** The stock desktop handler is mouse-down gated. For the requested pass-through hover, remove that guard and inject a velocity splat from every meaningful pointer delta. Amanda Ghassaei's demo below is the cleaner exact reference for hover-applies-force behavior.
- **Portability:** Static HTML/JS/WebGL and explicitly mobile-capable. It is the most established implementation here, but its source is a large single script rather than a modern component.
- **License:** MIT. Preserve its copyright/license notice when adapting. [License](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation/blob/master/LICENSE)

### 2. Volcomix — Ink Drop

- **Live:** <https://volcomix.github.io/ink-drop/>
- **Source:** <https://github.com/Volcomix/ink-drop>
- **Why open it:** Closest visual reference to the requested subject: a dark ink drop rendered and simulated in real time rather than a generic neon smoke trail.
- **Technique:** TypeScript/Vite/WebGL2 project. The project cites GPU fluid simulation, real-time 3D fluids, ink diffusion, and drops settling in liquid as its direct technical references. [Source README](https://github.com/Volcomix/ink-drop#readme)
- **Visual fit:** Best target for density, tendrils, soft edges, depth, and the “ink suspended in water” read.
- **Interaction:** Treat primarily as the visual/continuous-motion reference. Verify the exact desired pointer response in the live demo before borrowing its input model; Pavel's velocity “splat” interaction is the clearer reference for mouse disturbance.
- **Portability:** Modern WebGL2 source, but more specialized and likely heavier to extract than a flat 2D background solver.
- **License:** MIT. [License](https://github.com/Volcomix/ink-drop/blob/main/LICENSE)

### 3. Amanda Ghassaei — gpu-io fluid

- **Live:** <https://apps.amandaghassaei.com/gpu-io/examples/fluid/>
- **Source:** <https://github.com/amandaghassaei/gpu-io/tree/main/examples/fluid>
- **Why open it:** Best exact interaction reference. The official demo describes touch/mouseover as applying force; particles follow the velocity field and leave translucent trails, producing a convincing ink-in-water response without requiring a click.
- **Technique:** A GPU fluid velocity field plus many advected particles, built with the author's `gpu-io` library. This is more particle-trail based than Pavel's advected dye texture, but the pointer-force contract is exactly the requested one.
- **Visual fit:** Strong wispy trails and flow; less like one dense volumetric droplet out of the box. Borrow the input behavior even if the final rendering uses Pavel/Volcomix-style dye.
- **Portability:** Current modular library available on npm; WebGL2 with WebGL1 fallback. Adds a framework-sized graphics dependency compared with copying a focused solver.
- **License:** MIT. [Repository/license](https://github.com/amandaghassaei/gpu-io)

### 4. Taha Bakri — fluid-cursor

- **Live:** <https://tahabakri.github.io/fluid-cursor/>
- **Source:** <https://github.com/tahabakri/fluid-cursor>
- **Why open it:** Strong site-background integration example. It shows fluid composited over typography and includes Ink, Smoke, Neon, and Mono presets plus live controls.
- **Interaction:** Each cursor move adds both a velocity push and dye; the effect therefore continues to curl and flow after the pointer passes rather than returning to an origin. [Implementation description](https://github.com/tahabakri/fluid-cursor#how-it-works)
- **Useful knobs:** curl, velocity and dye dissipation, splat radius/force, pressure iterations, threshold, and edge softness. These map closely to the desired art-direction controls. [Preset documentation](https://github.com/tahabakri/fluid-cursor#configure-it)
- **Portability:** Vanilla JS + Vite, no runtime dependency. Also provides good production details: `prefers-reduced-motion`, pause on hidden tab, and a graceful WebGL2 fallback.
- **License:** MIT, with the adapted Pavel Dobryakov license/notice retained. [License and attribution](https://github.com/tahabakri/fluid-cursor#license)

### 5. smokey-fluid-cursor

- **Source / usage demo:** <https://github.com/faraasat/smokey-fluid-cursor>
- **npm:** <https://www.npmjs.com/package/smokey-fluid-cursor>
- **Why open it:** Fastest portability reference. It exposes an `initFluid()` API and can be loaded as an npm package, ES module from a CDN, or global script.
- **Interaction:** Mouse and touch input feed a WebGL fluid solver. Configuration exposes simulation/dye resolution, density and velocity dissipation, pressure iterations, curl, splat radius/force, shading, transparency, and color timing. [README configuration](https://github.com/faraasat/smokey-fluid-cursor#%EF%B8%8F-configuration)
- **Visual fit:** Defaults are colorful smoke, but monochrome dye + transparency + lower color update speed should move it toward ink. Good implementation reference, less compelling art reference than Ink Drop.
- **Portability:** Best API surface in this list; suitable for quickly proving the interaction before custom rendering. Confirm bundle/performance in this site before committing.
- **License caution:** The repository page currently exposes no visible license file in its file list. Do **not** copy source until licensing is confirmed with the maintainer/package metadata; using the published package under its declared terms is a separate decision.

### 6. haxiomic — GPU Fluid Experiments

- **Live:** <https://haxiomic.github.io/GPU-Fluid-Experiments/>
- **Source:** <https://github.com/haxiomic/GPU-Fluid-Experiments>
- **Why open it:** Foundational, stripped-down GPU fluid experiment cited by Pavel's and Volcomix's projects. Useful for understanding the underlying field simulation without site-specific styling.
- **Visual fit:** Excellent swirling-flow reference; likely requires substantial rendering/art-direction work to resemble a single black droplet.
- **Portability/license:** Use as technical reading unless the repository's license terms are confirmed. The live experiment is useful regardless; lack of an obvious license should be treated as “all rights reserved,” not implicit permission.

## Additional visual / interaction references

These are useful to open, but they are not the recommended implementation bases.

- **Inkwash:** <https://johnowhitaker.github.io/inkwash/> — source at <https://github.com/johnowhitaker/inkwash>. A single-file WebGL2 “living water” drawing app where dark ink flows and bleeds only through wet regions. Great reference for diffusion, paper-like edges, and restrained monochrome rendering; the interaction is painting/wetting rather than disturbing an existing hero droplet. The repository does not present a visible license in its root listing, so treat it as inspiration unless permission is clarified.
- **Sumi:** <https://sumi.kiira.in/> — an interactive suminagashi/marbling tool with direct mouse-drag distortion and real-time flowing patterns. Very close to the tactile “cursor combs through suspended ink” feeling, but no public source/license was located, so use it only as a behavioral and visual reference.
- **Three.js WebGPU compute water:** <https://threejs.org/examples/webgpu_compute_water.html> — click and move to disturb a persistent simulated surface. It is water-height displacement rather than dye/ink advection, but clearly demonstrates the desired interaction contract: the pointer deposits disturbance into simulation state. Source is part of the MIT-licensed Three.js examples: <https://github.com/mrdoob/three.js/blob/dev/examples/webgpu_compute_water.html>.
- **Three.js WebGL GPGPU water:** <https://threejs.org/examples/webgl_gpgpu_water.html> — same interaction lesson with broader WebGL-era compatibility; visually less relevant than a dye solver. Source: <https://github.com/mrdoob/three.js/blob/dev/examples/webgl_gpgpu_water.html>.
- **isuruK2003 Fluid Simulation:** <https://isuruk2003.github.io/fluid-simulation/> — source at <https://github.com/isuruK2003/fluid-simulation>. Particularly useful behavior reference: a nozzle continuously emits swirling dye/smoke, ordinary mouse movement adds velocity, and click-drag adds density as well. That division closely matches “hover disturbs the existing droplet.” No declared license was found, so do not copy the implementation without permission.
- **Jérémie Piellard Navier–Stokes WebGL:** <https://piellardj.github.io/navier-stokes-webgl/> — source at <https://github.com/piellardj/navier-stokes-webgl>. Its adjustable stream provides autonomous forcing, while controls expose timestep, solver steps, brush radius/strength, velocity, and pressure. Visually scientific and pointer-down gated, but useful for tuning and ambient-flow ideas. The package declares the ISC license.

## Suggested build brief

The handoff agent should build this as a **stateful fluid simulation**, not as a mesh/image following the pointer.

1. Seed one restrained black/charcoal dye mass near the current droplet location.
2. Keep it alive autonomously with a very low-amplitude, slowly varying force/emitter so it swirls even when the pointer is idle.
3. Convert pointer movement into localized velocity splats based on pointer delta and speed. The pointer should push, shear, and divide the existing dye; it should not translate the whole composition.
4. Let the disturbed state persist and naturally advect/dissipate. No spring-to-origin animation.
5. Tune vorticity high enough for tendrils, velocity dissipation high enough for lingering movement, and dye dissipation slow enough to preserve the hero silhouette.
6. Composite the canvas transparently behind content; test contrast against both the page background and typography.
7. Support touch, `prefers-reduced-motion`, visibility pause, resolution/DPR caps, resize recovery, and a static fallback.

The fastest spike is Pavel's solver with a monochrome palette and a localized autonomous emitter. If that 2D result lacks the volumetric “ink in water” depth, keep its velocity/pointer model but borrow Ink Drop's density shading and soft 3D presentation.

## Primary technical references

- NVIDIA GPU Gems, Chapter 38, “Fast Fluid Dynamics Simulation on the GPU”: <https://developer.nvidia.com/gpugems/gpugems/part-vi-beyond-triangles/chapter-38-fast-fluid-dynamics-simulation-gpu>
- Pavel Dobryakov source and MIT license: <https://github.com/PavelDoGreat/WebGL-Fluid-Simulation>
- Volcomix Ink Drop source and references: <https://github.com/Volcomix/ink-drop>
- Three.js official examples/source: <https://github.com/mrdoob/three.js/tree/dev/examples>
