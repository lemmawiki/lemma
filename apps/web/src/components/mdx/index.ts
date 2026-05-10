// One-stop import for MDX-side components. MDX files do:
//
//   import { Term, Exercise, ToolSpec, ShannonBars, ... } from "@/components/mdx";
//
// To add a new widget to the MDX vocabulary:
//   1. Build an .astro wrapper here (reads Astro.currentLocale, passes to React)
//   2. Re-export below
//
// Naming convention: the MDX tag is the export name. Translators write
// `<Term>`, `<Exercise>`, `<ShannonBars>` and they Just Work in any locale —
// the wrapper reads the URL locale at render time.

export { default as Term } from "./term.astro";
export { default as Exercise } from "./exercise.astro";
export { default as Solution } from "./solution.astro";
export { default as ToolSpec } from "./tool-spec.astro";
export { default as Counterexample } from "./counterexample.astro";
export { default as WhyNotTaught } from "./why-not-taught.astro";
export { default as Compute } from "./compute.astro";
export { default as CodeBlock } from "./code-block.astro";
export { default as JourneyDays } from "./journey-days.astro";
export { default as Dialect } from "./dialect.astro";
export { default as ListenButton } from "./listen-button.astro";
export { default as History } from "./history.astro";
export { default as Check } from "./check.astro";

// Widgets
export { default as ShannonBars } from "./shannon-bars.astro";
export { default as PizzaSlider } from "./pizza-slider.astro";
export { default as ThreeDoors } from "./three-doors.astro";
export { default as ConicIntersect } from "./conic-intersect.astro";
export { default as ReliabilityDiagram } from "./reliability-diagram.astro";
export { default as ControlPoints } from "./control-points.astro";
export { default as DoublingLadder } from "./doubling-ladder.astro";
export { default as Launch } from "./launch.astro";
export { default as LossLandscape } from "./loss-landscape.astro";
export { default as SameCurve } from "./same-curve.astro";
export { default as ScoreCooker } from "./score-cooker.astro";
export { default as SecantToTangent } from "./secant-to-tangent.astro";
export { default as SignAndVerify } from "./sign-and-verify.astro";
export { default as TangentApproximation } from "./tangent-approximation.astro";
export { default as TfIdfCooker } from "./tf-idf-cooker.astro";
export { default as ImageCompressionCooker } from "./image-compression-cooker.astro";
export { default as PortfolioMixer } from "./portfolio-mixer.astro";
export { default as TerminalVelocityCooker } from "./terminal-velocity-cooker.astro";
export { default as TwoPendulums } from "./two-pendulums.astro";
export { default as TwoStacks } from "./two-stacks.astro";
export { default as VectorRoles } from "./vector-roles.astro";
