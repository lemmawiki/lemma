import { AppProvider } from "../context/app-context";
import { ConfidentWrong } from "./confident-wrong";

export default function ConfidentWrongIsland({
  code,
}: {
  code: { arc2: string; arc3: string; arc5: string };
}) {
  return (
    <AppProvider>
      <ConfidentWrong code={code} />
    </AppProvider>
  );
}
