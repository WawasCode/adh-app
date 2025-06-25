"use client";

import { useEffect, useState, useMemo } from "react";
import { useLocationStore } from "@/store/useLocationStore";
import { useViewStore } from "@/store/useViewStore";
import { RemoteMapView } from "@/map/RemoteMapView";
import { BottomNav } from "@/views/MobileUICommon";
import { MobileMainOverlay } from "@/views/MobileMainOverlay";
import { MobileNavigationOverlay } from "@/views/MobileNavigationOverlay";
import { IncidentsPage } from "@/views/IncidentsPage";
import ConfigureHazard from "@/views/ConfigureHazard";
import ConfigureWaypoint from "@/views/ConfigureWaypoint";
import AddPlaceView1 from "@/views/AddPlaceView1";
import SelectSeverity from "@/views/SelectSeverity";
import SelectLocation from "@/views/SelectLocation";
import SelectZoneView from "@/views/SelectZoneView";
import SelectCircleDetailsView from "@/views/SelectCircleDetailsView";
import SelectCategoryView from "@/views/SelectCategoryView";

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

  const currentPageContent = useMemo(() => {
    const BottomNavComponent = (
      <BottomNav active={currentPage} onNavigate={setPage} />
    );

    if (currentPage === "main") {
      return (
        <MobileMainOverlay
          openNavigation={() => setPage("navigation")}
          openAddPlace1={() => setPage("addPlace1")}
          BottomNavComponent={BottomNavComponent}
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
      return (
        <div className="absolute inset-0 z-10 pointer-events-auto bg-white">
          <ConfigureHazard />
          <div className="absolute inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))]">
            {BottomNavComponent}
          </div>
        </div>
      );
    }

    if (currentPage === "configureWaypoint") {
      return (
        <div className="absolute inset-0 z-10 pointer-events-auto bg-white">
          <ConfigureWaypoint />
          <div className="absolute inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))]">
            {BottomNavComponent}
          </div>
        </div>
      );
    }

    if (currentPage === "selectSeverity") {
      return (
        <div className="absolute inset-0 z-10 pointer-events-auto bg-white">
          <SelectSeverity />
          <div className="absolute inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))]">
            {BottomNavComponent}
          </div>
        </div>
      );
    }

    if (currentPage === "addPlace1") {
      return (
        <div className="absolute inset-0 z-10 pointer-events-auto bg-white">
          <AddPlaceView1 />
          <div className="absolute inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))]">
            {BottomNavComponent}
          </div>
        </div>
      );
    }

    if (currentPage === "selectLocation") {
      return (
        <div className="absolute inset-0 z-10 pointer-events-auto bg-white">
          <SelectLocation />
          <div className="absolute inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))]">
            {BottomNavComponent}
          </div>
        </div>
      );
    }

    if (currentPage === "selectZone") {
      return (
        <div className="absolute inset-0 z-10 pointer-events-auto bg-white">
          <SelectZoneView />
          <div className="absolute inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))]">
            {BottomNavComponent}
          </div>
        </div>
      );
    }

    if (currentPage === "circleDetails") {
      return (
        <div className="absolute inset-0 z-10 pointer-events-auto bg-white">
          <SelectCircleDetailsView />
          <div className="absolute inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))]">
            {BottomNavComponent}
          </div>
        </div>
      );
    }

    if (currentPage === "selectCategory") {
      return (
        <div className="absolute inset-0 z-10 pointer-events-auto bg-white">
          <SelectCategoryView />
          <div className="absolute inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))]">
            {BottomNavComponent}
          </div>
        </div>
      );
    }

    // Fallback
    return (
      <div className="absolute inset-0 z-10 pointer-events-auto bg-white">
        <IncidentsPage />
        <div className="absolute inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))]">
          {BottomNavComponent}
        </div>
      </div>
    );
  }, [currentPage, setPage, goBack]);

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
