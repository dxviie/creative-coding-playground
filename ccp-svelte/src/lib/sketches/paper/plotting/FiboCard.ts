import type { PaperSketch } from '$lib/sketches/sketchTypes';
import { hatchRectangle } from '$lib/sketches/paper/PaperTools';

const MM_TO_PT = 3.775;
const WIDTH = 420 * MM_TO_PT;
const HEIGHT = 298 * MM_TO_PT;

const THRESHOLD = 1;

function sketch(p: paper.PaperScope) {
	const root = new p.Layer({ name: 'root' });
	const hatchings = new p.Layer({ name: 'hatchings' });
	hatchings.addTo(root);
	const canvas = new p.Path.Rectangle({
		point: [0, 0],
		size: [WIDTH, HEIGHT],
		strokeColor: 'black',
		fillColor: 'white'
	});
	canvas.addTo(root);

	let n1 = 13;
	let n2 = 21;
	let x = 0;

	const rects: paper.Path.Rectangle[] = [];

	while (x < WIDTH) {
		const xNext = Math.min(n1 + n2, WIDTH);
		console.debug('drawing rect at -- ', x, xNext);
		const rect = drawRect(x, xNext);
		rect.addTo(root);
		rects.push(rect);

		x = xNext;
		n1 = n2;
		n2 = x;
	}

	let angle = 45; //Math.random() * 360;
	const phi = 90; //Math.random() * 180;
	const fraction = 1.08; //Math.random() + 0.7;
	let spacing = 21; //Math.random() * 100 + 5;

	p.project.view.onFrame = (event: { time: number; delta: number; count: number }) => {
		console.info('angle', angle, 'phi', phi, 'fraction', fraction, 'spacing', spacing);
		for (let i = 0; i < rects.length; i++) {
			const rect = rects[i];
			hatchRectangle(p, rect, angle, spacing, hatchings, {
				strokeColor: 'orange',
				strokeWidth: 6 * MM_TO_PT,
				opacity: 0.66
				// angle: 45
			});
			angle += phi;
			spacing *= fraction;
			// rect.remove();
		}
		hatchings.bringToFront();

		root.fitBounds(p.project.view.bounds.scale(0.9));
		p.project.view.pause();
	};

	function drawRect(x0: number, x1: number) {
		let rect = new p.Path.Rectangle({
			from: [x0, 0],
			to: [x1, HEIGHT],
			strokeColor: 'transparent'
		});
		return rect;
	}

	/************************************************************************
			 												EVENT HANDLING
	 ************************************************************************/

	p.project.view.onClick = (event: paper.MouseEvent) => {
		console.debug('::onClick::', 'event', event);
		// export the svg to file
		const svg = p.project.exportSVG({ asString: true });
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		const blob = new Blob([svg], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'fibonacci.svg';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		console.log('exported');
	};
}

export const FiboCard: PaperSketch = {
	sketch: sketch,
	name: 'Fibonacci'
};
