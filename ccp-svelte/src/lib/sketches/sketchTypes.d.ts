import type p5 from 'p5';

export interface P5Sketch {
	sketch: (p: p5) => void;
	name?: string;
}

export interface PaperSketch {
	sketch: (paper: paper.PaperScope) => void;
	name?: string;
	options?: SketchOptions;
}

export interface SketchOptions {
	height?: number;
	width?: number;
}
