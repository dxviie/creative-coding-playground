import type { PaperSketch } from '$lib/sketches/sketchTypes';

const MM_TO_PT = 3.775;
const WIDTH = 420 * MM_TO_PT;
const HEIGHT = 298 * MM_TO_PT;

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
		let n1 = 1;
		let n2 = 1;
		let x = n1 + n2;

		drawLine(n1).addTo(root);
		while (x < WIDTH) {
			drawLine(x).addTo(root);
			console.debug('drawing line at -- ', x);
			x = n1 + n2;
			n1 = n2;
			n2 = x;
		}

		root.fitBounds(p.project.view.bounds.scale(0.9));
		p.project.view.pause();
	};

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
