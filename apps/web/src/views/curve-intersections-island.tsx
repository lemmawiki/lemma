import { AppProvider } from "../context/app-context";
import { CurveIntersections } from "./curve-intersections";

export default function CurveIntersectionsIsland({ code }: { code: { arc4: string } }) {
  return (
    <AppProvider>
      <CurveIntersections code={code} />
    </AppProvider>
  );
}
