import React, { useRef, useState, useEffect } from 'react';
import { Tool, Point, DrawingState } from '../types';
import Toolbar from './Toolbar';
import ColorPicker from './ColorPicker';
import StackVisualizer from './StackVisualizer';

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [undoStack, setUndoStack] = useState<DrawingState[]>([]);
  const [redoStack, setRedoStack] = useState<DrawingState[]>([]);
  const [tool, setTool] = useState<Tool>('pencil');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [showStack, setShowStack] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    redrawCanvas(ctx, canvas);
  }, [undoStack]);

  const drawShape = (ctx: CanvasRenderingContext2D, start: Point, end: Point, shape: Tool) => {
    ctx.beginPath();
    ctx.strokeStyle = start.color;
    ctx.lineWidth = start.lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch (shape) {
      case 'circle':
        const radius = Math.hypot(end.x - start.x, end.y - start.y);
        ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
        break;
      case 'rectangle':
        const width = end.x - start.x;
        const height = end.y - start.y;
        ctx.rect(start.x, start.y, width, height);
        break;
      case 'triangle':
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.lineTo(start.x - (end.x - start.x), end.y);
        ctx.closePath();
        break;
      case 'line':
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        break;
    }
    ctx.stroke();
  };

  const redrawCanvas = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    undoStack.forEach(state => {
      state.points.forEach(path => {
        if (path.length < 2) return;
        
        const start = path[0];
        const end = path[path.length - 1];
        
        ctx.beginPath();
        ctx.strokeStyle = start.color;
        ctx.lineWidth = start.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (['circle', 'rectangle', 'triangle', 'line'].includes(state.tool)) {
          drawShape(ctx, start, end, state.tool);
        } else {
          ctx.moveTo(start.x, start.y);
          path.forEach((point, index) => {
            if (index > 0) ctx.lineTo(point.x, point.y);
          });
          ctx.stroke();
        }
      });
    });
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setCurrentPath([{
      x,
      y,
      color: tool === 'eraser' ? '#ffffff' : color,
      lineWidth: tool === 'eraser' ? 20 : lineWidth
    }]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPoint = {
      x,
      y,
      color: tool === 'eraser' ? '#ffffff' : color,
      lineWidth: tool === 'eraser' ? 20 : lineWidth
    };

    setCurrentPath(prev => [...prev, newPoint]);

    if (['circle', 'rectangle', 'triangle', 'line'].includes(tool)) {
      redrawCanvas(ctx, canvas);
      drawShape(ctx, currentPath[0], newPoint, tool as Tool);
    } else {
      ctx.beginPath();
      ctx.moveTo(currentPath[currentPath.length - 1].x, currentPath[currentPath.length - 1].y);
      ctx.lineTo(x, y);
      ctx.strokeStyle = newPoint.color;
      ctx.lineWidth = newPoint.lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;

    setIsDrawing(false);
    if (currentPath.length > 0) {
      setUndoStack(prev => [...prev, { points: [currentPath], tool }]);
      setRedoStack([]);
    }
    setCurrentPath([]);
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    const lastState = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, lastState]);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, nextState]);
  };

  return (
    <div className="flex gap-8 p-8">
      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <Toolbar
            tool={tool}
            setTool={setTool}
            showStack={showStack}
            setShowStack={setShowStack}
            showColorPicker={showColorPicker}
            setShowColorPicker={setShowColorPicker}
            canUndo={undoStack.length > 0}
            canRedo={redoStack.length > 0}
            onUndo={undo}
            onRedo={redo}
          />

          {showColorPicker && (
            <ColorPicker
              color={color}
              setColor={setColor}
              lineWidth={lineWidth}
              setLineWidth={setLineWidth}
            />
          )}

          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="mt-4 border border-gray-300 rounded cursor-crosshair"
            style={{ width: '800px', height: '600px', backgroundColor: 'white' }}
          />
        </div>
      </div>

      {showStack && (
        <StackVisualizer
          undoStack={undoStack}
          redoStack={redoStack}
        />
      )}
    </div>
  );
}