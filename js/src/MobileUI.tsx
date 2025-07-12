"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useLocationStore } from "@/store/useLocationStore";
import { useViewStore } from "@/store/useViewStore";
import { RemoteMapView } from "@/map/RemoteMapView";
import { BottomNav } from "@/views/MobileUICommon";
import { MobileMainOverlay } from "@/views/MobileMainOverlay";
import { MobileNavigationOverlay } from "@/views/MobileNavigationOverlay";
import { IncidentsPage } from "@/views/IncidentsPage";
import AddPlace from "@/views/AddPlace";
import ConfigureHazard from "@/views/HazardConfiguration";
import ConfigureWaypoint from "@/views/WaypointConfiguration";
import SelectWaypointType from "@/views/WaypointSelectType";
import SelectWaypointLocation from "@/views/WaypointSelectAddress";
import SelectSeverity from "@/views/HazardSelectSeverity";
import SelectLocation from "@/views/HazardSelectLocationType";
import SelectZone from "@/views/HazardZoneSelectZone";
import SelectAddress from "./views/HazardIncidentSelectAddress";

const MARKER_DISPLAY_DELAY_MS = 1000;
const LOCATION_MAX_AGE_MS = 10000;
const LOCATION_TIMEOUT_MS = 5000;

/**
 * MobileLayout component that decides between mobile and desktop layouts.
 * Renders the map as a background and overlays the appropriate mobile view.
 */
export default function MobileLayout() {
  const [isMobile, setIsMobile] = useState(false);
  const { currentPage, setPage, goBack } = useViewStore();

  const setPosition = useLocationStore((s) => s.setPosition);
  const setShowMarker = useLocationStore((s) => s.setShowMarker);
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

  function handleLocationSelect(location: {
    lat: number;
    lon: number;
    name: string;
  }) {
    setSelectedLocation(location);
  }

  // Memoize the current page content to avoid re-renders from string comparisons in JSX.
  const currentPageContent = useMemo(() => {
    const BottomNavComponent = (
      <BottomNav active={currentPage} onNavigate={setPage} />
    );
    /**
     * Helper to wrap a page component with consistent layout styling and bottom nav
     */
    function renderPage(component: React.ReactElement) {
      return (
        <div className="absolute inset-0 z-10 pointer-events-auto bg-white">
          {component}
          <div className="absolute inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))]">
            {BottomNavComponent}
          </div>
        </div>
      );
    }

    if (currentPage === "main") {
      return (
        <MobileMainOverlay
          openNavigation={() => setPage("navigation")}
          openAddPlace={() => setPage("addPlace")}
          BottomNavComponent={BottomNavComponent}
          onLocationSelect={handleLocationSelect}
        />
      );
    }

    if (currentPage === "navigation") {
      return (
        <MobileNavigationOverlay
          goBack={goBack}
          BottomNavComponent={BottomNavComponent}
        />
      );
    }

    if (currentPage === "configureHazard") {
      return renderPage(<ConfigureHazard />);
    }

    if (currentPage === "configureWaypoint") {
      return renderPage(<ConfigureWaypoint />);
    }

    if (currentPage === "selectSeverity") {
      return renderPage(<SelectSeverity />);
    }

    if (currentPage === "addPlace") {
      return renderPage(<AddPlace />);
    }

    if (currentPage === "selectLocation") {
      return renderPage(<SelectLocation />);
    }

    if (currentPage === "waypointType") {
      return renderPage(<SelectWaypointType />);
    }

    if (currentPage === "selectZone") {
      return renderPage(<SelectZone />);
    }

    if (currentPage === "selectAddress") {
      return renderPage(<SelectAddress />);
    }

    if (currentPage === "waypointLocation") {
      return renderPage(<SelectWaypointLocation />);
    }

    // Fallback
    return renderPage(<IncidentsPage />);
  }, [currentPage, setPage, goBack]);

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
