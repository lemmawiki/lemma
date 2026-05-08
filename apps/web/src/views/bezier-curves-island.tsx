import { AppProvider } from "../context/app-context";
import { BezierCurves } from "./bezier-curves";

export default function BezierCurvesIsland({
  code,
}: {
  code: { arc2: string; arc3: string; arc4: string };
}) {
  return (
    <AppProvider>
      <BezierCurves code={code} />
    </AppProvider>
  );
}
