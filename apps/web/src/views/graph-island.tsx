import { AppProvider, type Language } from "../context/app-context";
import { Graph } from "./graph";

export default function GraphIsland({ language }: { language?: Language } = {}) {
  return (
    <AppProvider language={language}>
      <Graph />
    </AppProvider>
  );
}
