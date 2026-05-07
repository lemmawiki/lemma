import { AppProvider } from "../context/AppContext";
import { Logarithm } from "./Logarithm";

export default function LogarithmIsland() {
  return (
    <AppProvider>
      <Logarithm />
    </AppProvider>
  );
}
