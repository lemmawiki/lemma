import { AppProvider } from "../context/app-context";
import { Vectors } from "./vectors";

export default function VectorsIsland({ code }: { code: { arc3: string; arc4: string } }) {
  return (
    <AppProvider>
      <Vectors code={code} />
    </AppProvider>
  );
}
