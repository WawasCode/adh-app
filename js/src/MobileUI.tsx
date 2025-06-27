"use client";

import { useLocationStore } from "@/store/useLocationStore";
import { useEffect, useState, useMemo } from "react";
import { RemoteMapView } from "@/map/RemoteMapView";
import { MobileMainOverlay } from "@/views/MobileMainOverlay";
import { MobileNavigationOverlay } from "@/views/MobileNavigationOverlay";
import { IncidentsPage } from "@/views/IncidentsPage";
import { BottomNav } from "./views/MobileUICommon";
const MARKER_DISPLAY_DELAY_MS = 1000;
const LOCATION_MAX_AGE_MS = 10000;
const LOCATION_TIMEOUT_MS = 5000;
type Page = "main" | "navigation" | "incidents";

/**
 * MobileLayout component that decides between mobile and desktop layouts.
 * Renders the map as a background and overlays the appropriate mobile view.
 */
export default function MobileLayout() {
  const [isMobile, setIsMobile] = useState(false);
  const [page, setPage] = useState<Page>("main");
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lon: number;
    name?: string;
  } | null>(null);

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

  const setPosition = useLocationStore((state) => state.setPosition);

  const setShowMarker = useLocationStore((state) => state.setShowMarker);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPosition([lat, lng]);

        setTimeout(() => setShowMarker(true), MARKER_DISPLAY_DELAY_MS);
      },
      (err) => {
        console.error("GPS error:", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: LOCATION_MAX_AGE_MS,
        timeout: LOCATION_TIMEOUT_MS,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [setPosition, setShowMarker]);

  function handleNav(targetPage: Page) {
    setPage(targetPage);
  }

  function handleLocationSelect(location: {
    lat: number;
    lon: number;
    name: string;
  }) {
    setSelectedLocation(location);
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
          onLocationSelect={handleLocationSelect}
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
        <RemoteMapView selectedLocation={selectedLocation || undefined} />
      </div>
      {currentPageContent}
    </div>
  );
}
