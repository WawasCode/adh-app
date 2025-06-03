"use client";

import { useEffect, useState, useMemo } from "react";
import { RemoteMapView } from "@/map/RemoteMapView";
import { MobileMainOverlay } from "@/views/MobileMainOverlay";
import { MobileNavigationOverlay } from "@/views/MobileNavigationOverlay";
import { IncidentsPage } from "@/views/IncidentsPage";
import { BottomNav } from "./views/MobileUICommon";

type Page = "main" | "navigation" | "incidents";

/**
 * MobileLayout component that decides between mobile and desktop layouts.
 * Renders the map as a background and overlays the appropriate mobile view.
 */
export default function MobileLayout() {
  const [isMobile, setIsMobile] = useState(false);
  const [page, setPage] = useState<Page>("main");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const updateMobileStatus = () => {
      const isSmallScreen = mediaQuery.matches;
      const isTouchDevice = navigator.maxTouchPoints > 0;
      setIsMobile(isSmallScreen || isTouchDevice);
    };
    updateMobileStatus();
    mediaQuery.addEventListener("change", updateMobileStatus);
    return () => {
      mediaQuery.removeEventListener("change", updateMobileStatus);
    };
  }, []);

  function handleNav(targetPage: Page) {
    setPage(targetPage);
  }

  // Memoize the current page content to avoid re-renders from string comparisons in JSX.
  const currentPageContent = useMemo(() => {
    const navProps = {
      BottomNavComponent: <BottomNav active={page} onNavigate={handleNav} />,
    };

    if (page === "main") {
      return (
        <MobileMainOverlay
          openNavigation={() => handleNav("navigation")}
          BottomNavComponent={navProps.BottomNavComponent}
        />
      );
    }

    if (page === "navigation") {
      return (
        <MobileNavigationOverlay
          goBack={() => handleNav("main")}
          BottomNavComponent={navProps.BottomNavComponent}
        />
      );
    }

    return (
      <div className="absolute inset-0 z-10 pointer-events-auto bg-white">
        <IncidentsPage />
        <div className="absolute inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))]">
          {navProps.BottomNavComponent}
        </div>
      </div>
    );
  }, [page]);

  if (!isMobile) return <RemoteMapView />;

  return (
    <div className="relative w-screen overflow-hidden h-[100svh]">
      <div className="absolute inset-0 z-0">
        <RemoteMapView />
      </div>
      {currentPageContent}
    </div>
  );
}
