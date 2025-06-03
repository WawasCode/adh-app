"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "~/lib/utils";
import { Button } from "./Button";
import type { Size } from "~/styles/theme";
import { theme } from "~/styles/theme";

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: Size;
}

/**
 * IconButton component: a square button intended for icons.
 * @param size Size of the button, defaults to "md".
 */
export function IconButton({
  size = "md",
  className,
  ...rest
}: IconButtonProps) {
  return (
    <Button
      size="sm"
      variant="secondary"
      className={cn("p-0 flex items-center justify-center", className)}
      style={{
        width: theme.sizes[size].height,
        height: theme.sizes[size].height,
      }}
      {...rest}
    />
  );
}
