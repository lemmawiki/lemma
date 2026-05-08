import { AppProvider } from "../context/app-context";
import { SpikeParametric } from "./spike-parametric";

export default function SpikeParametricIsland() {
  return (
    <AppProvider>
      <SpikeParametric />
    </AppProvider>
  );
}
