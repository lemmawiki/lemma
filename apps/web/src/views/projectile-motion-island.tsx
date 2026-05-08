import { AppProvider } from "../context/app-context";
import { ProjectileMotion } from "./projectile-motion";

export default function ProjectileMotionIsland({
  code,
}: {
  code: { arc2: string; arc3: string; arc4: string };
}) {
  return (
    <AppProvider>
      <ProjectileMotion code={code} />
    </AppProvider>
  );
}
