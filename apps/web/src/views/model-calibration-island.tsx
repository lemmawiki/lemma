import { AppProvider } from "../context/app-context";
import { ModelCalibration } from "./model-calibration";

export default function ModelCalibrationIsland({
  code,
}: {
  code: { arc2: string; arc3: string; arc4: string; arc5: string };
}) {
  return (
    <AppProvider>
      <ModelCalibration code={code} />
    </AppProvider>
  );
}
