import { AppProvider } from "../context/AppContext";
import { BitcoinPizza } from "./BitcoinPizza";

export default function BitcoinPizzaIsland({
  code,
}: {
  code: { arc1: string; arc2: string; arc3: string };
}) {
  return (
    <AppProvider>
      <BitcoinPizza code={code} />
    </AppProvider>
  );
}
