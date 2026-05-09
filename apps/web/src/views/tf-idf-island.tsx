import { AppProvider } from "../context/app-context";
import { TfIdf } from "./tf-idf";

export default function TfIdfIsland({
  code,
}: {
  code: { arc2: string; arc3: string; arc5: string };
}) {
  return (
    <AppProvider>
      <TfIdf code={code} />
    </AppProvider>
  );
}
