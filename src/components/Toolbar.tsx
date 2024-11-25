import React from 'react';
import { Tool } from '../types';
import { Pencil, Eraser, Circle, Square, Triangle, Minus, Palette, Eye, EyeOff, Undo, Redo } from 'lucide-react';

interface ToolbarProps {
  tool: Tool;
  setTool: (tool: Tool) => void;
  showStack: boolean;
  setShowStack: (value: boolean) => void;
  showColorPicker: boolean;
  setShowColorPicker: (value: boolean) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

const tools = [
  { id: 'pencil', icon: Pencil, label: 'Pencil' },
  { id: 'eraser', icon: Eraser, label: 'Eraser' },
  { id: 'circle', icon: Circle, label: 'Circle' },
  { id: 'rectangle', icon: Square, label: 'Rectangle' },
  { id: 'triangle', icon: Triangle, label: 'Triangle' },
  { id: 'line', icon: Minus, label: 'Line' }
];

export default function Toolbar({
  tool, setTool, showStack, setShowStack, showColorPicker, setShowColorPicker, 
  canUndo, canRedo, onUndo, onRedo
}: ToolbarProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        {tools.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setTool(id as Tool)}
            className={`p-2 rounded-md flex items-center gap-2 transition-all ${
              tool === id 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-700 hover:bg-white/50'
            }`}
            title={label}
          >
            <Icon size={20} />
          </button>
        ))}
      </div>

      <div className="h-6 w-px bg-gray-300 mx-2" />

      <div className="flex gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-2 rounded-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
            bg-gray-100 hover:bg-gray-200 transition-colors"
          title="Undo"
        >
          <Undo size={20} />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-2 rounded-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
            bg-gray-100 hover:bg-gray-200 transition-colors"
          title="Redo"
        >
          <Redo size={20} />
        </button>
      </div>

      <div className="h-6 w-px bg-gray-300 mx-2" />

      <button
        onClick={() => setShowColorPicker(!showColorPicker)}
        className={`p-2 rounded-md flex items-center gap-2 transition-colors ${
          showColorPicker ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 hover:bg-gray-200'
        }`}
        title="Toggle Color Picker"
      >
        <Palette size={20} />
      </button>

      <button
        onClick={() => setShowStack(!showStack)}
        className={`p-2 rounded-md flex items-center gap-2 transition-colors ${
          showStack ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 hover:bg-gray-200'
        }`}
        title="Toggle Stack View"
      >
        {showStack ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}