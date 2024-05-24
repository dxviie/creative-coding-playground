import type p5 from 'p5';

export interface P5Sketch {
	sketch: (p: p5, options?: SketchOptions) => void;
	name?: string;
}

export interface PaperSketch {
	sketch: (paper: paper.PaperScope, options?: SketchOptions) => void;
	name?: string;
}

export interface SketchOptions {
	height?: number;
	width?: number;
}

export type Vector2D = { x: number; y: number };

export type Pen = {
	strokeColor: string;
	strokeWidth: number;
	angle?: number;
	opacity?: number;
	name?: string;
};
