import { AppProvider } from "../context/app-context";
import { Entropy } from "./entropy";

export default function EntropyIsland() {
  return (
    <AppProvider>
      <Entropy />
    </AppProvider>
  );
}
