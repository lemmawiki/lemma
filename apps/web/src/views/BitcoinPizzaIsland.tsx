import { AppProvider } from "../context/AppContext";
import { BitcoinPizza } from "./BitcoinPizza";

export default function BitcoinPizzaIsland() {
  return (
    <AppProvider>
      <BitcoinPizza />
    </AppProvider>
  );
}
