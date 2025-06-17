import {
  Search,
  Filter,
  Compass,
  Map as MapIcon,
  Info,
  Grid,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "~/lib/utils";
import { useEffect, useRef, useState } from "react";

// Export Page type for consistent usage
export type Page = "main" | "navigation" | "incidents";

interface PhotonFeature {
  properties: {
    name: string;
    street?: string;
    housenumber?: string;
    city?: string;
    postcode?: string;
    state?: string;
    country?: string;
    countrycode?: string;
    osm_key?: string;
    osm_value?: string;
    osm_type?: string;
    osm_id?: number;
    extent?: number[];
  };
  geometry: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  type: string;
}

interface SearchBarProps {
  onLocationSelect?: (location: {
    lat: number;
    lon: number;
    name: string;
    description?: string;
  }) => void;
}

/**
 * SearchBar component with a leading search icon.
 */
export function SearchBar({ onLocationSelect }: SearchBarProps = {}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PhotonFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle outside clicks to close results dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounced search function
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(true);
      fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lat=52.52&lon=13.405&limit=10`,
      )
        .then((response) => response.json())
        .then((data) => {
          setResults(data.features || []);
          setShowResults(true);
        })
        .catch((error) => console.error("Error searching locations:", error))
        .finally(() => setIsLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleResultSelect = (result: PhotonFeature) => {
    const [lon, lat] = result.geometry.coordinates;
    const mainLine = formatMainLine(result.properties);
    const secondaryLine = formatSecondaryLine(result.properties);

    setQuery(mainLine);
    setShowResults(false);

    if (onLocationSelect) {
      onLocationSelect({
        lat,
        lon,
        name: mainLine,
        description: secondaryLine,
      });
    }
  };

  const formatMainLine = (props: PhotonFeature["properties"]) => {
    // POI name takes priority
    if (props.name) {
      return (
        props.name +
        (props.housenumber
          ? ` (${props.street} ${props.housenumber})`
          : ` (${props.street})`)
      );
    }

    // Fallback to street address
    if (props.street) {
      return props.housenumber
        ? `${props.street} ${props.housenumber}`
        : props.street;
    }

    return "Unnamed location";
  };

  const formatSecondaryLine = (props: PhotonFeature["properties"]) => {
    const parts = [];

    // Add type information
    if (props.osm_value) {
      const type = props.osm_value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
      parts.push(type);
    }

    // Add city
    if (props.city) {
      parts.push(props.city);
    }

    // Add country
    if (props.country && props.country !== props.name) {
      parts.push(props.country);
    }

    return parts.join(", ");
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 h-5 w-5" />
        <Input
          type="text"
          placeholder="Search for a location"
          className="rounded-xl pl-10 pr-4 py-3 text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setShowResults(true)}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute mt-1 w-full bg-white rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
          {results.map((result, index) => {
            const mainLine = formatMainLine(result.properties);
            const secondaryLine = formatSecondaryLine(result.properties);

            return (
              <Button
                key={index}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left px-4 py-2",
                  "hover:bg-gray-100 focus:bg-gray-100",
                )}
                onClick={() => handleResultSelect(result)}
              >
                <div className="flex flex-col items-start w-full">
                  <span className="text-sm font-medium line-clamp-1 w-full">
                    {mainLine}
                  </span>
                  <span className="text-xs text-gray-500 line-clamp-1 w-full">
                    {secondaryLine}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * FilterButton – pill‑shaped button containing the filter icon.
 */
export function FilterButton() {
  return (
    <Button
      variant="ghost"
      className="flex items-center gap-1 rounded-full bg-white px-4 py-2 shadow text-gray-900 text-sm font-medium"
    >
      <Filter className="h-4 w-4" />
      <span>Filter</span>
    </Button>
  );
}

/**
 * CompassButton – square card with compass icon and "N" label below.
 */
export function CompassButton() {
  return (
    <div className="flex flex-col items-center">
      <Button
        variant="ghost"
        className="w-16 h-16 bg-white rounded-2xl shadow flex items-center justify-center p-0"
      >
        <Compass className="h-7 w-7" />
      </Button>
    </div>
  );
}

interface MapIconButtonProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

/**
 * MapIconButton
 * @param icon Icon component to render inside the button.
 * @param label Accessible label for the button.
 * @param onClick Optional click handler for the button.
 */
export function MapIconButton({
  icon: Icon,
  label,
  onClick,
}: MapIconButtonProps) {
  return (
    <Button
      aria-label={label}
      onClick={onClick}
      variant="ghost"
      className="w-12 h-12 bg-white rounded-md shadow flex items-center justify-center p-0"
    >
      <Icon className="h-5 w-5" />
    </Button>
  );
}

/**
 * BottomNav – persistent bottom navigation bar.
 * @param active The currently active page.
 * @param onNavigate Handler function to navigate between pages.
 */
export function BottomNav({
  active,
  onNavigate,
}: {
  active: Page;
  onNavigate: (page: Page) => void;
}) {
  return (
    <nav className="bg-white rounded-2xl shadow-lg flex justify-around py-3">
      <NavItem
        icon={MapIcon}
        isActive={active === "main"}
        onClick={() => onNavigate("main")}
        label="Map"
      />
      <NavItem
        icon={Info}
        isActive={active === "incidents"}
        onClick={() => onNavigate("incidents")}
        label="Incidents"
      />
      <NavItem icon={Grid} isActive={false} onClick={() => {}} label="Grid" />
      <NavItem
        icon={Settings}
        isActive={false}
        onClick={() => {}}
        label="Settings"
      />
    </nav>
  );
}

/**
 * NavItem – icon‑only navigation action.
 * @param icon Icon component to display.
 * @param isActive Whether this item is currently active.
 * @param onClick Handler function when clicked.
 * @param label Accessibility label.
 */
function NavItem({
  icon: Icon,
  isActive,
  onClick,
  label,
}: {
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <Button
      variant="ghost"
      className={`flex flex-col items-center h-auto p-1 ${isActive ? "text-primary-500 font-medium" : ""}`}
      onClick={onClick}
      aria-label={label}
    >
      <Icon className="h-6 w-6" />
    </Button>
  );
}

interface InputProps {
  icon: React.ReactNode;
  placeholder: string;
}

/**
 * InputWithIcon
 * @param icon Icon component to render inside the input.
 * @param placeholder Placeholder text for the input field.
 */
export function InputWithIcon({ icon, placeholder }: InputProps) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
        {icon}
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        className="rounded-xl pl-10 pr-4 py-3 text-sm"
      />
    </div>
  );
}

interface ChipProps {
  icon: React.ElementType;
  label: string;
}

/**
 * CategoryChip
 * @param icon Icon component to render inside the chip.
 * @param label Text label for the chip.
 */
export function CategoryChip({ icon: Icon, label }: ChipProps) {
  return (
    <Button
      variant="outline"
      className="flex items-center gap-1 rounded-full bg-white shadow px-3 py-1 text-sm h-auto"
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Button>
  );
}
