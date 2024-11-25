import React from 'react';
import { COLORS, LINE_WIDTHS } from '../constants';

interface ColorPickerProps {
  color: string;
  setColor: (color: string) => void;
  lineWidth: number;
  setLineWidth: (width: number) => void;
}

export default function ColorPicker({
  color,
  setColor,
  lineWidth,
  setLineWidth,
}: ColorPickerProps) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold mb-2">Colors</h3>
      <div className="flex flex-wrap gap-2">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              color === c ? 'border-blue-500 scale-110' : 'border-gray-300 hover:scale-105'
            }`}
            style={{ backgroundColor: c }}
            title={c}
          />
        ))}
      </div>
      <h3 className="text-sm font-semibold mt-4 mb-2">Brush Size</h3>
      <div className="flex flex-wrap gap-2">
        {LINE_WIDTHS.map((width) => (
          <button
            key={width}
            onClick={() => setLineWidth(width)}
            className={`w-8 h-8 rounded flex items-center justify-center border transition-all ${
              lineWidth === width ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
            }`}
            title={`${width}px`}
          >
            <div
              className="rounded-full bg-black"
              style={{ width: width, height: width }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}