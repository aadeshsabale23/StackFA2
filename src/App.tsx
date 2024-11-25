import React from 'react';
import DrawingCanvas from './components/DrawingCanvas';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Drawing Canvas with Stack Visualization
          </h1>
          <p className="text-gray-600 mt-1">
            Create, undo, redo, and visualize your drawing actions
          </p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <DrawingCanvas />
      </main>
    </div>
  );
}

export default App;
