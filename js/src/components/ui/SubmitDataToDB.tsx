/* eslint-disable prettier/prettier */
import { useHazardZoneStore } from "@/store/useHazardZoneDisplayStore";
import { useWaypointStore } from "@/store/useWaypointDisplayStore";
import { useIncidentStore } from "@/store/useIncidentDisplayStore";
import React from "react";

async function submitData(
  enpoint: string,
  data: unknown,
  successMsg = "Data successfully sent",
  errorMsg = "Failed to send data",
) {
  try {
    const response = await fetch(enpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    alert(successMsg);
  } catch (error) {
    console.error("Error submitting data:", error);
    alert(errorMsg);
  }
}

export const handleSubmit =
  (dataType: "hazardZones" | "waypoints" | "incidents") =>
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      let data;
      let endpoint = "";
      let successMsg = "";
      let errorMsg = "";

      if (dataType === "hazardZones") {
        data = useHazardZoneStore.getState().savedHazardZones;
        endpoint = "/api/hazardzones";
        successMsg = "Hazard zones submitted successfully!";
        errorMsg = "Failed to submit hazard zones. Please try again.";
      } else if (dataType === "waypoints") {
        data = useWaypointStore.getState().waypoints;
        endpoint = "/api/waypoints";
        successMsg = "Waypoints submitted successfully!";
        errorMsg = "Failed to submit waypoints. Please try again.";
      } else if (dataType === "incidents") {
        data = useIncidentStore.getState().incidents;
        endpoint = "/api/incidents";
        successMsg = "Incidents submitted successfully!";
        errorMsg = "Failed to submit incidents. Please try again.";
      } else {
        alert("Invalid data type specified.");
        return;
      }

      if (!data || data.length === 0) {
        alert(`No ${dataType} available to submit.`);
        return;
      }

      await submitData(endpoint, data, successMsg, errorMsg);
    };
