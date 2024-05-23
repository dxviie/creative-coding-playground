import type { PaperSketch } from '$lib/sketches/sketchTypes';
import { hatchRectangle } from '$lib/sketches/paper/PaperTools';

const MM_TO_PT = 3.775;
const WIDTH = 420 * MM_TO_PT;
const HEIGHT = 298 * MM_TO_PT;

const THRESHOLD = 1;

function sketch(p: paper.PaperScope) {
	let root = new p.Layer({ name: 'root' });
	let canvas = new p.Path.Rectangle({
		point: [0, 0],
		size: [WIDTH, HEIGHT],
		strokeColor: 'black',
		fillColor: 'transparent'
	});
	canvas.addTo(root);

	p.project.view.onFrame = (event: { time: number; delta: number; count: number }) => {
		let n1 = 13;
		let n2 = 21;
		let x = 0;

		const rects = [];

		while (x < WIDTH) {
			const xNext = Math.min(n1 + n2, WIDTH);
			console.info('drawing rect at -- ', x, xNext);
			const rect = drawRect(x, xNext);
			rect.addTo(root);
			rects.push(rect);

			x = xNext;
			n1 = n2;
			n2 = x;
		}

		let angle = 0;
		let phi = 5; //137.5;
		for (let i = 0; i < rects.length; i++) {
			const rect = rects[i];
			// if (rect.bounds.width > THRESHOLD) {
			hatchRectangle(p, rect, angle, 10);
			angle += phi;
			rect.remove();
			// }
		}

		root.fitBounds(p.project.view.bounds.scale(0.9));
		p.project.view.pause();
	};

	function drawRect(x0: number, x1: number) {
		let rect = new p.Path.Rectangle({
			from: [x0, 0],
			to: [x1, HEIGHT],
			strokeColor: 'black'
		});
		return rect;
	}

	function drawLine(x: number) {
		let line = new p.Path.Line({
			from: [x, 0],
			to: [x, HEIGHT],
			strokeColor: 'black'
		});
		return line;
	}
}

export const FiboCard: PaperSketch = {
	sketch: sketch,
	name: 'Fibonacci'
};
