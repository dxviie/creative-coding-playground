import type p5 from "p5";

export function testSketch(p: p5) {
  p.setup = () => {
    p.createCanvas(1280, 720);
    p.background(0);
  };
  p.draw = () => {
    p.clear();
    p.background(0);
    p.fill(255);
    p.ellipse(p.mouseX, p.mouseY, 50, 50);
  };
}