import { AppProvider, type Language } from "../context/app-context";
import { Home } from "./home";

export default function HomeIsland({ language }: { language?: Language } = {}) {
  return (
    <AppProvider language={language}>
      <Home />
    </AppProvider>
  );
}
