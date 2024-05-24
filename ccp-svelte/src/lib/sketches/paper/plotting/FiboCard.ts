import type { PaperSketch } from '$lib/sketches/sketchTypes';
import { hatchRectangle } from '$lib/sketches/paper/PaperTools';
import { PAPERJS_MM_TO_PT } from '$lib/sketches/SketchTools';
import { COPIC_YR16_MARKER } from '$lib/sketches/Pens';

const WIDTH = 420 * PAPERJS_MM_TO_PT;
const HEIGHT = 298 * PAPERJS_MM_TO_PT;

const PATTERNS = ['fibonacci', 'test-grid'];
const PATTERN = PATTERNS[0];

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

	let n1 = 2;
	let n2 = 3;
	let x = 0;

	const rects: paper.Path.Rectangle[] = [];

	if (PATTERN === 'fibonacci') {
		while (x < WIDTH) {
			const fibNext = n1 + n2;
			const xNext = Math.min(x + fibNext, WIDTH);
			console.info('drawing rect at -- ', x, xNext, 'fib', fibNext);
			const rect = new p.Path.Rectangle({
				from: [x, 0],
				to: [xNext, HEIGHT],
				strokeColor: 'red',
				strokeWidth: 1
			});
			rect.addTo(root);
			rects.push(rect);

			x = xNext;
			n1 = n2;
			n2 = fibNext;
		}
	} else if (PATTERN === 'test-grid') {
		const blockSize = 150;
		for (let x = (WIDTH % blockSize) / 2; x < WIDTH - blockSize; x += blockSize) {
			for (let y = (HEIGHT % blockSize) / 2; y < HEIGHT - blockSize; y += blockSize) {
				const rect = new p.Path.Rectangle({
					from: [x, y],
					to: [x + blockSize, y + blockSize],
					strokeColor: 'red',
					strokeWidth: 1
				});
				rects.push(rect);
			}
		}
	}

	let angle = 45; //Math.random() * 360;
	const phi = 4; //Math.random() * 180;
	const fraction = 1; //Math.random() + 0.7;
	let spacing = 21; //Math.random() * 100 + 5;

	p.project.view.onFrame = (event: { time: number; delta: number; count: number }) => {
		console.debug(
			'event',
			event,
			'angle',
			angle,
			'phi',
			phi,
			'fraction',
			fraction,
			'spacing',
			spacing
		);
		for (let i = 0; i < rects.length; i++) {
			const rect = rects[i];
			hatchRectangle(p, rect, angle, spacing, hatchings, COPIC_YR16_MARKER);
			angle += phi;
			spacing *= fraction;
			rect.remove();
		}
		hatchings.bringToFront();

		// root.fitBounds(p.project.view.bounds.scale(0.9));
		p.project.view.pause();
	};

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
