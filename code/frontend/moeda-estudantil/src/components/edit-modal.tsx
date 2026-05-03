import { X, Save } from "lucide-react";
import React, { useState } from "react";

interface Field {
  key: string;
  label: string;
  type?: "text" | "email" | "number";
}

interface EditModalProps {
  isOpen: boolean;
  title: string;
  fields: Field[];
  data: Record<string, any>;
  onSave: (updatedData: Record<string, any>) => void;
  onClose: () => void;
}

export function EditModal({ isOpen, title, fields, data, onSave, onClose }: EditModalProps) {
  const [formData, setFormData] = useState(data);

  if (!isOpen) return null;

  const handleChange = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="rounded-2xl p-6 max-w-md w-full animate-in" style={{ background: "var(--gradient-glass)" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-white/80 mb-2">
                {field.label}
              </label>
              <input
                type={field.type || "text"}
                value={formData[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 rounded-lg bg-mint text-mint-foreground font-semibold hover:bg-mint/90 transition flex items-center justify-center gap-2"
          >
            <Save className="h-4 w-4" /> Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
