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
