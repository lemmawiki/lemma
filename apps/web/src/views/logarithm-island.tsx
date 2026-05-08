import { AppProvider } from "../context/app-context";
import { Logarithm } from "./logarithm";

export default function LogarithmIsland({ code }: { code: { arc1: string; arc4: string } }) {
  return (
    <AppProvider>
      <Logarithm code={code} />
    </AppProvider>
  );
}
