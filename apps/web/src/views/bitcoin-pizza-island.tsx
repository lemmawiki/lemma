import { AppProvider } from "../context/app-context";
import { BitcoinPizza } from "./bitcoin-pizza";

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
