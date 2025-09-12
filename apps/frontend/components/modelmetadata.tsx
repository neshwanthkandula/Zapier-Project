"use client";
import React, { useState, useEffect } from "react";

export const MetadataModal = ({
  title,
  metadataSchema,
  onSave,
  onClose,
}: {
  title: string;
  metadataSchema: { [key: string]: any }; // schema from backend
  onSave: (metadata: { [key: string]: any }) => void;
  onClose: () => void;
}) => {
  const [metadata, setMetadata] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);

  // Initialize metadata with empty strings
  useEffect(() => {
    const initial: { [key: string]: string } = {};
    Object.keys(metadataSchema).forEach((key) => {
      initial[key] = "";
    });
    setMetadata(initial);
  }, [metadataSchema]);

  const handleChange = (key: string, value: string) => {
    setMetadata((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    try {
      const parsed: Record<string, any> = {};

      Object.entries(metadata).forEach(([key, val]) => {
        if (!val) {
          parsed[key] = "";
          return;
        }

        const trimmed = val.trim();
        // Try parse JSON if looks like JSON
        if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
          try {
            parsed[key] = JSON.parse(trimmed);
          } catch {
            throw new Error(`Invalid JSON in field "${key}"`);
          }
        } else {
          parsed[key] = val; // keep as string
        }
      });

      setError(null);
      onSave(parsed);
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white shadow-xl rounded-xl p-6 w-96 max-w-lg">
        <h2 className="text-lg font-semibold mb-4">
          {title} Metadata
          <div className="text-xs font-light text-gray-500">
            *(Enter JSON or plain text values)
          </div>
        </h2>

        {/* Dynamic input fields */}
        {Object.keys(metadataSchema).map((key) => (
          <div className="mb-3" key={key}>
            <label className="block text-sm font-medium">{key}</label>
            <textarea
              value={metadata[key] || ""}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder='e.g. {"foo":"bar"} or simple text'
              className="w-full border rounded p-2"
              rows={3}
            />
          </div>
        ))}

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
