import { AppProvider } from "../context/app-context";
import { Bezout } from "./bezout";

export default function BezoutIsland({ code }: { code: { arc4: string; arc6: string } }) {
  return (
    <AppProvider>
      <Bezout code={code} />
    </AppProvider>
  );
}
