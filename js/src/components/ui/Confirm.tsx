import { createPortal } from "react-dom";

interface ConfirmationDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

export function ConfirmationDialog({
  onConfirm,
  onCancel,
  message,
}: ConfirmationDialogProps) {
  return createPortal(
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-11/12 max-w-md">
        <h2 className="text-lg font-semibold mb-2">Confirm Deletion</h2>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
