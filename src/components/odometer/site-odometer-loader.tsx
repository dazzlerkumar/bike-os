"use client";

import { useState } from "react";
import { OdometerLoadingScreen } from "./odometer-loading-screen";

export function SiteOdometerLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showLoader, setShowLoader] = useState(true);

  const handleComplete = () => {
    setShowLoader(false);
  };

  return (
    <>
      {children}
      {true && <OdometerLoadingScreen onComplete={handleComplete} />}
    </>
  );
}
