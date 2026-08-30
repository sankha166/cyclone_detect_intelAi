import { ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

import earthFallback from "@/assets/earth-auth-panel.jpg";

const GlobeScene = lazy(() => import("./GlobeScene"));

function GlobeFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <img
        src={earthFallback}
        alt="Earth from space with a cyclone over the Bay of Bengal"
        className="size-full scale-125 object-cover opacity-70"
        width={1024}
        height={1536}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
    </div>
  );
}

export function GlobeMount({ className }: { className?: string }) {
  return (
    <div className={className}>
      <ClientOnly fallback={<GlobeFallback />}>
        <Suspense fallback={<GlobeFallback />}>
          <GlobeScene />
        </Suspense>
      </ClientOnly>
    </div>
  );
}
