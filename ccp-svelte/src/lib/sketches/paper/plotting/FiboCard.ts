import type { PaperSketch } from '$lib/sketches/sketchTypes';
import { hatchRectangle } from '$lib/sketches/paper/PaperTools';
import { PAPERJS_MM_TO_PT } from '$lib/sketches/SketchTools';
import { COPIC_YR16_MARKER } from '$lib/sketches/Pens';

const WIDTH = 420 * PAPERJS_MM_TO_PT;
const HEIGHT = 298 * PAPERJS_MM_TO_PT;

const CARD_WIDTH = 55 * PAPERJS_MM_TO_PT;
const CARD_HEIGHT = 85 * PAPERJS_MM_TO_PT;

const PATTERNS = ['fibonacci', 'test-grid'];
const PATTERN = PATTERNS[0];

function sketch(p: paper.PaperScope) {
	const rootLayer = new p.Layer({ name: 'root' });
	const orangeHatchingLayer = new p.Layer({ name: 'orange hatchings' });
	const blackHatchingLayer = new p.Layer({ name: 'black hatchings' });
	const cardsLayer = new p.Layer({ name: 'cards' });
	orangeHatchingLayer.addTo(rootLayer);
	cardsLayer.addTo(rootLayer);
	const canvas = new p.Path.Rectangle({
		point: [0, 0],
		size: [WIDTH, HEIGHT],
		strokeColor: 'black',
		fillColor: 'white'
	});
	canvas.addTo(rootLayer);

	const rects: paper.Path.Rectangle[] = [];
	const inverseRects: paper.Path.Rectangle[] = [];

	if (PATTERN === 'fibonacci') {
		let n1 = 2;
		let n2 = 3;
		let x = (WIDTH % CARD_WIDTH) / 2 - 5;

		while (x < WIDTH - (WIDTH % CARD_WIDTH) / 2) {
			const fibNext = n1 + n2;
			const xNext = Math.min(x + fibNext, WIDTH - (WIDTH % CARD_WIDTH) / 2);
			const from = [x, (HEIGHT % CARD_HEIGHT) / 2 - 5];
			const to = [xNext, HEIGHT - (HEIGHT % CARD_HEIGHT) / 2 + 5];
			console.debug('drawing rect at -- ', x, xNext, 'fib', fibNext);
			const rect = new p.Path.Rectangle({
				from: from,
				to: to,
				strokeColor: 'red',
				strokeWidth: 1
			});
			rect.addTo(rootLayer);
			rects.push(rect);

			const inverseRect = new p.Path.Rectangle({
				from: [WIDTH - from[0], from[1]],
				to: [WIDTH - to[0], to[1]],
				strokeColor: 'blue',
				strokeWidth: 1
			});
			inverseRect.addTo(rootLayer);
			inverseRects.push(inverseRect);

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

	const cards: paper.Path.Rectangle[] = [];
	for (let x = (WIDTH % CARD_WIDTH) / 2; x < WIDTH - CARD_WIDTH; x += CARD_WIDTH) {
		for (let y = (HEIGHT % CARD_HEIGHT) / 2; y < HEIGHT - CARD_HEIGHT; y += CARD_HEIGHT) {
			const card = new p.Path.Rectangle({
				from: [x, y],
				to: [x + CARD_WIDTH, y + CARD_HEIGHT],
				strokeColor: 'red',
				strokeWidth: 1
			});
			console.debug('card', card.bounds);
			card.addTo(cardsLayer);
			cards.push(card);
		}
	}

	console.info('cards', cardsLayer.children.length);

	const angle = 3; //Math.random() * 360;
	const inverseAngle = 30; //Math.random() * 360;
	const phi = 137.5 / rects.length; //Math.random() * 180;
	const inversePhi = 137.5 / rects.length;
	const fraction = 1;
	const spacing = 33; //Math.random() * 100 + 20;
	const inverseSpacing = 40; // Math.random() * 100 + 20;

	p.project.view.onFrame = (event: { time: number; delta: number; count: number }) => {
		console.info(
			'event',
			event,
			'angle',
			angle,
			'inverseAngle',
			inverseAngle,
			'phi',
			phi,
			'fraction',
			fraction,
			'spacing',
			spacing
		);
		orangeHatchingLayer.removeChildren();
		let myAngle = angle + event.count;
		let myInverseAngle = inverseAngle + event.count;
		for (let i = 0; i < rects.length; i++) {
			const rect = rects[i];
			const inverseRect = inverseRects[i];
			hatchRectangle(
				p,
				inverseRect,
				myInverseAngle,
				inverseSpacing,
				blackHatchingLayer,
				COPIC_YR16_MARKER
			);
			// hatchRectangle(
			// 	p,
			// 	inverseRect,
			// 	myInverseAngle - 137.5,
			// 	inverseSpacing * 2,
			// 	blackHatchingLayer,
			// 	COPIC_YR16_MARKER
			// );

			hatchRectangle(p, rect, myAngle, spacing, orangeHatchingLayer, COPIC_YR16_MARKER);
			// hatchRectangle(p, rect, myAngle - 137.5, spacing * 2, orangeHatchingLayer, COPIC_YR16_MARKER);

			myAngle += phi;
			myInverseAngle += inversePhi;
			// spacing = Math.max(fraction * spacing, 0.1);
			rect.remove();
			inverseRect.remove();
		}
		orangeHatchingLayer.bringToFront();
		cardsLayer.bringToFront();
		cardsLayer.opacity = 0; //0.5;

		// const fibonacciGenerator = fibonacci();

		// for (let i = 0; i < 12; i++) {
		// 	// draw 10 circles
		// 	const radius = fibonacciGenerator.next().value;
		//
		// 	let newPoint = [
		// 		radius + Math.random() * WIDTH - radius * 2,
		// 		radius + Math.random() * HEIGHT - radius * 2
		// 	];
		// 	const circle = new p.Path.Circle({
		// 		center: newPoint, //  [newPoint.x + radius, newPoint.y + radius],
		// 		radius: radius,
		// 		strokeColor: '#F7941D',
		// 		strokeWidth: 2 * PAPERJS_MM_TO_PT,
		// 		opacity: 0
		// 	});
		// 	hatchRectangle(p, circle, 45, 20, hatchingLayer, {
		// 		strokeColor: '#F7941D',
		// 		strokeWidth: 2 * PAPERJS_MM_TO_PT,
		// 		opacity: 0.66
		// 	});
		// }

		p.project.view.pause();
	};
	rootLayer.fitBounds(p.project.view.bounds.scale(0.9));

	function* fibonacci() {
		let [prev, curr] = [0, 1];
		while (true) {
			[prev, curr] = [curr, prev + curr];
			yield curr;
		}
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
