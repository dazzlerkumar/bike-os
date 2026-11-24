"use client";

import { useCallback, useState } from "react";
import { OdometerLoadingScreen } from "./odometer-loading-screen";

export function SiteOdometerLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showLoader, setShowLoader] = useState(true);

  const handleComplete = useCallback(() => {
    setShowLoader(false);
  }, []);

  return (
    <>
      {children}
      {showLoader && <OdometerLoadingScreen onComplete={handleComplete} />}
    </>
  );
}
