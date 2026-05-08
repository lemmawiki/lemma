import { AppProvider } from "../context/app-context";
import { BitcoinSignature } from "./bitcoin-signature";

export default function BitcoinSignatureIsland({
  code,
}: {
  code: { arc2: string; arc4: string; arc5: string };
}) {
  return (
    <AppProvider>
      <BitcoinSignature code={code} />
    </AppProvider>
  );
}
