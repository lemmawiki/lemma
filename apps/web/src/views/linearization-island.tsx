import { AppProvider } from "../context/app-context";
import { Linearization } from "./linearization";

export default function LinearizationIsland({
  code,
}: {
  code: { arc2: string; arc3: string; arc4: string };
}) {
  return (
    <AppProvider>
      <Linearization code={code} />
    </AppProvider>
  );
}
