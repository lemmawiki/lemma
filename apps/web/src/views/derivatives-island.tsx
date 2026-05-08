import { AppProvider } from "../context/app-context";
import { Derivatives } from "./derivatives";

export default function DerivativesIsland({
  code,
}: {
  code: { arc2: string; arc3: string; arc5: string };
}) {
  return (
    <AppProvider>
      <Derivatives code={code} />
    </AppProvider>
  );
}
