import type p5 from "p5";

export interface P5Sketch {
  sketch: (p: p5) => void;
  name?: string;
}

export interface SketchOptions {
  // height with default value 20
  height?: number;
  // width with default value 20
  width?: number;
}