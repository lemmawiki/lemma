import { AppProvider } from "../context/app-context";
import { ParametricCurves } from "./parametric-curves";

export default function ParametricCurvesIsland() {
  return (
    <AppProvider>
      <ParametricCurves />
    </AppProvider>
  );
}
