import { AppProvider } from "../context/app-context";
import { Graph } from "./graph";

export default function GraphIsland() {
  return (
    <AppProvider>
      <Graph />
    </AppProvider>
  );
}
