import React from 'react';
import { History } from 'lucide-react';
import { DrawingState } from '../types';

interface StackVisualizerProps {
  undoStack: DrawingState[];
  redoStack: DrawingState[];
}

export default function StackVisualizer({ undoStack, redoStack }: StackVisualizerProps) {
  const allActions = [...undoStack, ...redoStack.reverse()];
  const currentIndex = undoStack.length - 1;

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg p-4 w-64">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Stack Movements</h2>
          <History className="text-blue-500" size={20} />
        </div>
        
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="max-h-64 overflow-y-auto p-2 space-y-2">
            {allActions.map((_, index) => (
              <div
                key={index}
                className={`p-2 rounded-md text-sm font-medium transition-all ${
                  index === currentIndex
                    ? 'bg-blue-50 border border-blue-200 text-blue-700'
                    : index < currentIndex
                    ? 'bg-green-50 border border-green-100 text-green-700'
                    : 'bg-gray-50 border border-gray-100 text-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Action {index + 1}</span>
                  {index === currentIndex && (
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}