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
import { useMapStore } from "@/store/useMapStore";
import { useLocationStore } from "@/store/useLocationStore";

// Export Page type for consistent usage
export type Page = "main" | "navigation" | "incidents";

/**
 * SearchBar component with a leading search icon.
 */
export function SearchBar() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 h-5 w-5" />
      <Input
        type="text"
        placeholder="Search"
        className="rounded-xl pl-10 pr-4 py-3 text-sm"
      />
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
  const map = useMapStore((s) => s.map);
  const position = useLocationStore((s) => s.position);

  function handleInternalClick() {
    if (label === "Center" && map && position) {
      map.flyTo(position, 15);
    } else if (onClick) {
      onClick();
    }
  }

  return (
    <Button
      aria-label={label}
      onClick={handleInternalClick}
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
