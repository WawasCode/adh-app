import { X } from "lucide-react";

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
}

export function CloseButton({
  onClick,
  className = "text-red-500 text-xl font-bold",
  ariaLabel = "Close",
}: CloseButtonProps) {
  return (
    <button onClick={onClick} className={className} aria-label={ariaLabel}>
      <X className="h-6 w-6" size={20} />
    </button>
  );
}

export default CloseButton;
