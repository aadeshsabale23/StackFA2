export type Tool = 'pencil' | 'eraser' | 'circle' | 'rectangle' | 'triangle' | 'line';

export interface Point {
  x: number;
  y: number;
  color: string;
  lineWidth: number;
}

export interface DrawingState {
  points: Point[][];
  tool: Tool;
}