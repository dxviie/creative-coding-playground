import type p5 from 'p5';

// from https://openprocessing.org/sketch/1678058

let cols: number;
let rows: number;
let current: any[] = [];
let previous: any[] = [];

const WHITE = 255;
const BLACK = 255 - WHITE;
const WIDTH = 192 * 5;
const HEIGHT = 108 * 5;

const dampening = 0.99;
let startTime = 0;

let step = 0;
const divisions = 6;

function sketch(p: p5) {
	p.setup = () => {
		startTime = p.millis();
		p.createCanvas(WIDTH, HEIGHT);
		p.frameRate(30);
		cols = p.width;
		rows = p.height;
		current = new Array(cols).fill(0).map(() => new Array(rows).fill(BLACK));
		previous = new Array(cols).fill(0).map(() => new Array(rows).fill(BLACK));
		console.log(current, previous);
		step = 0;
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
				const x = Math.round(cx + dx);
				const y = Math.round(cy + dy);
				if (x >= 0 && x < cols && y >= 0 && y < rows) {
					previous[x][y] = WHITE;
				}
			}
		}
	};

	const drawHorizontalBar = (cy: number, d: number) => {
		const r = Math.round(d / 2);
		for (let x = 0; x < cols; x++) {
			for (let y = cy - r; y < cy + r; y++) {
				previous[x][y] = WHITE;
			}
		}
	};

	const drawVerticalBar = (cx: number, d: number) => {
		const r = Math.round(d / 2);
		for (let y = 0; y < rows; y++) {
			for (let x = cx - r; x < cx + r; x++) {
				previous[x][y] = WHITE;
			}
		}
	};

	const drawCircle = (cx: number, cy: number, d: number) => {
		const r = d / 2;
		for (let dx = -r; dx <= r; dx++) {
			for (let dy = -r; dy <= r; dy++) {
				const x = Math.round(cx + dx);
				const y = Math.round(cy + dy);
				if (x >= 0 && x < cols && y >= 0 && y < rows) {
					const d = p.dist(cx, cy, x, y);
					if (d < r) {
						previous[x][y] = WHITE;
					}
				}
			}
		}
	};

	const drawCircleStroke = (cx: number, cy: number, d: number, strokeWidth: number) => {
		const r = d / 2;
		for (let dx = -r; dx <= r; dx++) {
			for (let dy = -r; dy <= r; dy++) {
				const x = Math.round(cx + dx);
				const y = Math.round(cy + dy);
				if (x >= 0 && x < cols && y >= 0 && y < rows) {
					const d = p.dist(cx, cy, x, y);
					if (d < r && d > r - strokeWidth) {
						if (!previous[x]) {
							continue;
						}
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

		// drawVerticalBar(p.mouseX, ((Math.sin(p.millis() / 1000) + 1) / 2) * 75);
		// drawVerticalBar(p.mouseX, 200);

		// drawCircleStroke(
		// 	p.mouseX,
		// 	p.mouseY,
		// 	((Math.sin(p.millis() / 1000) + 1) / 2) * 150,
		// 	((Math.cos(p.millis() / 1000) + 1) / 2) * 25
		// );

		// draw 10 circles at random points around the mouse
		// for (let i = 0; i < 100; i++) {
		// 	drawCircle(
		// 		// p.mouseX + p.random(-250, 250),
		// 		// p.mouseY + p.random(-250, 250),
		// 		p.random(0, p.width),
		// 		p.random(0, p.height),
		// 		p.random(1, 5)
		// 		// ((Math.cos(p.millis() / 1000) + 1) / 2) * 2
		// 	);
		// }
		// drawCircle(p.mouseX, p.mouseY, ((Math.sin(p.millis() / 1000) + 1) / 2) * 50);

		// drawCircleStroke(p.mouseX, p.mouseY, 175, 5);

		// drawCircleStroke(p.width / 2, p.height / 2, p.height / 1.5, 5);

		const x =
			p.width / 2 + (p.height / 4) * Math.sin(((Math.PI * 2) / divisions) * (step % divisions));
		const y =
			p.height / 2 + (p.height / 4) * Math.cos(((Math.PI * 2) / divisions) * (step % divisions));
		console.log(x, y);
		drawCircleStroke(x, y, p.height / 3, 5);

		// if (step % divisions === 0) {
		// 	drawCircle(p.width / 2, p.height / 2, p.height / 3);
		// }
		step++;

		// check if CTRL is pressed
		if (p.keyIsDown(17)) {
			console.log('CTRL is pressed');
		}
	};

	p.draw = () => {
		// log time and frame
		// console.log(p.frameCount, p.millis());
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

export const WaterRipples = {
	sketch: sketch,
	name: 'Water Ripples'
};
