import type p5 from 'p5';
import type { P5Sketch } from '$lib/sketches/sketchTypes';

// from https://openprocessing.org/sketch/1678058

let cols: number;
let rows: number;
let current: any[] = [];
let previous: any[] = [];

const WHITE = 255;
const BLACK = 255 - WHITE;
const WIDTH = 192 * 5;
const HEIGHT = 108 * 5;

const dampening = 0.95;

function sketch(p: p5) {
	p.setup = () => {
		p.createCanvas(WIDTH, HEIGHT);
		p.frameRate(30);
		cols = p.width;
		rows = p.height;
		current = new Array(cols).fill(0).map(() => new Array(rows).fill(BLACK));
		previous = new Array(cols).fill(0).map(() => new Array(rows).fill(BLACK));
		console.log(current, previous);
	};

	p.mouseDragged = () => {
		if (p.mouseX < 0 || p.mouseX >= cols || p.mouseY < 0 || p.mouseY >= rows) {
			return;
		}
		previous[p.mouseX][p.mouseY] = WHITE;
		// previous[p.mouseX + 1][p.mouseY] = WHITE;
		// previous[p.mouseX - 1][p.mouseY] = WHITE;
		// previous[p.mouseX][p.mouseY + 1] = WHITE;
		// previous[p.mouseX][p.mouseY - 1] = WHITE;
	};

	const drawSquare = (cx: number, cy: number, d: number) => {
		const r = d / 2;
		for (let dx = -r; dx <= r; dx++) {
			for (let dy = -r; dy <= r; dy++) {
				const x = cx + dx;
				const y = cy + dy;
				if (x >= 0 && x < cols && y >= 0 && y < rows) {
					previous[x][y] = WHITE;
				}
			}
		}
	};

	const drawHorizontalBar = (cy: number, d: number) => {
		const r = d / 2;
		for (let x = 0; x < cols; x++) {
			for (let y = cy - r; y < cy + r; y++) {
				previous[x][y] = WHITE;
			}
		}
	};

	const drawCircle = (cx: number, cy: number, d: number) => {
		const r = d / 2;
		for (let dx = -r; dx <= r; dx++) {
			for (let dy = -r; dy <= r; dy++) {
				const x = cx + dx;
				const y = cy + dy;
				if (x >= 0 && x < cols && y >= 0 && y < rows) {
					const d = p.dist(cx, cy, x, y);
					if (d < r) {
						previous[x][y] = WHITE;
					}
				}
			}
		}
	};

	p.mouseClicked = () => {
		if (p.mouseX < 0 || p.mouseX >= cols || p.mouseY < 0 || p.mouseY >= rows) {
			return;
		}
		// -
		// drawSquare(p.mouseX, p.mouseY, 250);
		// -
		// drawHorizontalBar(p.height / 2, 200);
		// -
		// let m = p.height / 2;
		// drawHorizontalBar(m / 2, 50);
		// drawHorizontalBar(m, 50);
		// drawHorizontalBar(m + m / 2, 50);
		// -
		drawCircle(p.mouseX, p.mouseY, 250);
	};

	p.draw = () => {
		p.background(BLACK);
		p.loadPixels();
		for (let i = 1; i < cols - 1; i++) {
			for (let j = 1; j < rows - 1; j++) {
				current[i][j] =
					(previous[i - 1][j] + previous[i + 1][j] + previous[i][j - 1] + previous[i][j + 1]) / 2 -
					current[i][j];
				current[i][j] = current[i][j] * dampening;
				const index = (j * cols + i) * 4;
				p.pixels[index] = current[i][j];
				p.pixels[index + 1] = current[i][j];
				p.pixels[index + 2] = current[i][j];
			}
		}
		p.updatePixels();

		const temp = previous;
		previous = current;
		current = temp;
	};
}

export const WaterRipples: P5Sketch = {
	sketch: sketch,
	name: 'Water Ripples',
	type: 'p5'
};
