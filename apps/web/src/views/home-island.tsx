import { AppProvider } from "../context/app-context";
import { Home } from "./home";

export default function HomeIsland() {
  return (
    <AppProvider>
      <Home />
    </AppProvider>
  );
}
