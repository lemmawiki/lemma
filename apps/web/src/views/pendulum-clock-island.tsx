import { AppProvider } from "../context/app-context";
import { PendulumClock } from "./pendulum-clock";

export default function PendulumClockIsland({ code }: { code: { arc4: string; arc6: string } }) {
  return (
    <AppProvider>
      <PendulumClock code={code} />
    </AppProvider>
  );
}
