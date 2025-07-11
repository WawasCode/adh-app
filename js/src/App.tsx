import "@/App.css";
import MobileLayout from "@/MobileUI";
import { LocalMapView } from "./map/LocalMapView";

/**
 * App component that renders the main application layout,
 * which is responsive and handles mobile/desktop views.
 */
export default function App() {
  return <MobileLayout />;
  return <LocalMapView />;
}
