import type p5 from 'p5';

function testP5Sketch(p: p5) {
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

export const TestP5Sketch = {
	sketch: testP5Sketch,
	name: 'Test P5 Sketch'
};
