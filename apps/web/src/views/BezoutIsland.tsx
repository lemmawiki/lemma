import { AppProvider } from "../context/AppContext";
import { Bezout } from "./Bezout";

export default function BezoutIsland({ code }: { code: { arc4: string; arc6: string } }) {
  return (
    <AppProvider>
      <Bezout code={code} />
    </AppProvider>
  );
}
