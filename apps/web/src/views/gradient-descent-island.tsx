import { AppProvider } from "../context/app-context";
import { GradientDescent } from "./gradient-descent";

export default function GradientDescentIsland({
  code,
}: {
  code: { arc2: string; arc4: string; arc6: string };
}) {
  return (
    <AppProvider>
      <GradientDescent code={code} />
    </AppProvider>
  );
}
