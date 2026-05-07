import { AppProvider } from "../context/AppContext";
import { Home } from "./Home";

export default function HomeIsland() {
  return (
    <AppProvider>
      <Home />
    </AppProvider>
  );
}
