import type { Size } from "./theme";

export const sizeClasses: Record<Size, string> = {
  xs: "h-6 px-[6px] text-[8px] rounded-[6px]",
  sm: "h-8 px-[12px] text-xs rounded-[8px]",
  md: "h-11 px-[20px] text-sm rounded-[10px]",
  lg: "h-[52px] px-[25px] text-base rounded-[12px]",
  xl: "h-14 px-[29px] text-lg rounded-[14px]",
};
