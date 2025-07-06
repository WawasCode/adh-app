"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

interface ViewHeaderCloseProps {
  onConfirm: () => void;
}

/**
 * ViewHeaderCloseWithConfirm renders a red "X" button.
 * On click, it shows a custom modal to confirm cancel action.
 */
export function ViewHeaderCloseWithConfirm({
  onConfirm,
}: ViewHeaderCloseProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* X Button */}
      <button
        onClick={() => setOpen(true)}
        className="text-red-500 text-xl font-bold"
        aria-label="Close"
      >
        ✕
      </button>

      {/* Modal */}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-6 w-11/12 max-w-md">
              <h2 className="text-lg font-semibold mb-2">
                Do you really want to cancel this process?
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                All unsaved changes will be lost.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  No, keep editing
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  onClick={() => {
                    setOpen(false);
                    onConfirm();
                  }}
                >
                  Yes, cancel
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
