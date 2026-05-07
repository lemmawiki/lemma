import { AppProvider } from "../context/AppContext";
import { SpikeParametric } from "./SpikeParametric";

export default function SpikeParametricIsland() {
  return (
    <AppProvider>
      <SpikeParametric />
    </AppProvider>
  );
}
