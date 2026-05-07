import { AppProvider } from "../context/AppContext";
import { Logarithm } from "./Logarithm";

export default function LogarithmIsland({ code }: { code: { arc1: string; arc3: string } }) {
  return (
    <AppProvider>
      <Logarithm code={code} />
    </AppProvider>
  );
}
