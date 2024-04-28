import type { PaperSketch } from '$lib/sketches/sketchTypes';

const MM_TO_PT = 3.775;
const WIDTH = 186 * MM_TO_PT;
const HEIGHT = 190 * MM_TO_PT;

function drawE(p: paper.PaperScope, position: paper.Point, size: number) {
	const letterE = new p.CompoundPath({
		children: [
			new p.Path.Line(position, new p.Point(position.x, position.y + size)),
			new p.Path.Line(position, new p.Point(position.x + size, position.y)),
			new p.Path.Line(
				new p.Point(position.x, position.y + size / 2),
				new p.Point(position.x + size, position.y + size / 2)
			),
			new p.Path.Line(
				new p.Point(position.x, position.y + size),
				new p.Point(position.x + size, position.y + size)
			)
		],
		strokeColor: 'red',
		strokeWidth: 1
	});
	return letterE;
}

function drawB(p: paper.PaperScope, position: paper.Point, size: number) {
	const topPct = 0.75;
	const midPct = 0.75;
	const botPct = 0.75;
	const letterB = new p.CompoundPath({
		children: [
			new p.Path.Line(position, new p.Point(position.x, position.y + size)),
			new p.Path.Line(position, new p.Point(position.x + size * topPct, position.y)),
			new p.Path.Arc(
				new p.Point(position.x + size * topPct, position.y),
				new p.Point(position.x + size * ((topPct + midPct) / 2 + 0.01), position.y + size / 2),
				new p.Point(position.x + size * midPct, position.y + size / 2)
			),

			new p.Path.Line(
				new p.Point(position.x, position.y + size / 2),
				new p.Point(position.x + size * midPct, position.y + size / 2)
			),
			new p.Path.Arc(
				new p.Point(position.x + size * midPct, position.y + size / 2),
				new p.Point(position.x + size * ((midPct + botPct) / 2 + 0.01), position.y + size),
				new p.Point(position.x + size * botPct, position.y + size)
			),
			new p.Path.Line(
				new p.Point(position.x, position.y + size),
				new p.Point(position.x + size * botPct, position.y + size)
			)
		],
		strokeColor: 'red',
		strokeWidth: 1
	});
	return letterB;
}

function drawH(p: paper.PaperScope, position: paper.Point, size: number) {
	const letterH = new p.CompoundPath({
		children: [
			new p.Path.Line(position, new p.Point(position.x, position.y + size)),
			new p.Path.Line(
				new p.Point(position.x, position.y + size / 2),
				new p.Point(position.x + size, position.y + size / 2)
			),
			new p.Path.Line(
				new p.Point(position.x + size, position.y),
				new p.Point(position.x + size, position.y + size)
			),
			new p.Path.Line(
				new p.Point(position.x + size / 2, position.y + size * 0.8),
				new p.Point(position.x + size / 2, position.y + size * 1.6)
			)
		],
		strokeColor: 'red',
		strokeWidth: 1
	});
	return letterH;
}

function drawR(p: paper.PaperScope, position: paper.Point, size: number) {
	const topPct = 0.75;
	const midPct = 0.75;
	const letterR = new p.CompoundPath({
		children: [
			new p.Path.Line(position, new p.Point(position.x, position.y + size)),
			new p.Path.Line(position, new p.Point(position.x + size * topPct, position.y)),
			new p.Path.Arc(
				new p.Point(position.x + size * topPct, position.y),
				new p.Point(position.x + size * ((topPct + midPct) / 2 + 0.01), position.y + size / 2),
				new p.Point(position.x + size * midPct, position.y + size / 2)
			),

			new p.Path.Line(
				new p.Point(position.x, position.y + size / 2),
				new p.Point(position.x + size * midPct, position.y + size / 2)
			),
			new p.Path.Arc(
				new p.Point(position.x + size * midPct, position.y + size / 2),
				new p.Point(position.x + size, position.y + size),
				new p.Point(position.x + size, position.y + size)
			)
		],
		strokeColor: 'red',
		strokeWidth: 1
	});
	return letterR;
}

function drawN(p: paper.PaperScope, position: paper.Point, size: number) {
	const letterN = new p.CompoundPath({
		children: [
			new p.Path.Line(position, new p.Point(position.x, position.y + size)),
			new p.Path.Line(
				new p.Point(position.x, position.y),
				new p.Point(position.x + size, position.y + size)
			),
			new p.Path.Line(
				new p.Point(position.x + size, position.y),
				new p.Point(position.x + size, position.y + size)
			)
		],
		strokeColor: 'red',
		strokeWidth: 1
	});
	return letterN;
}

function drawO(p: paper.PaperScope, position: paper.Point, size: number) {
	const letterO = new p.CompoundPath({
		children: [
			new p.Path.Circle(new p.Point(position.x + size / 2, position.y + size / 2), size / 2),
			new p.Path.Line(
				new p.Point(position.x, position.y + size),
				new p.Point(position.x + size, position.y)
			)
		],
		strokeColor: 'red',
		strokeWidth: 1
	});
	return letterO;
}

function drawW(p: paper.PaperScope, position: paper.Point, size: number) {
	const letterW = new p.CompoundPath({
		children: [
			new p.Path.Line(position, new p.Point(position.x, position.y + size)),
			new p.Path.Line(
				new p.Point(position.x, position.y + size),
				new p.Point(position.x + size / 2, position.y + size / 2)
			),
			new p.Path.Line(
				new p.Point(position.x + size / 2, position.y + size / 2),
				new p.Point(position.x + size, position.y + size)
			),
			new p.Path.Line(
				new p.Point(position.x + size, position.y),
				new p.Point(position.x + size, position.y + size)
			)
		],
		strokeColor: 'red',
		strokeWidth: 1
	});
	return letterW;
}

function sketch(p: paper.PaperScope) {
	const paper = new p.Path.Rectangle({
		point: [0, 0],
		size: [WIDTH, HEIGHT],
		strokeColor: 'black'
	});
	// const img = new p.Raster('beherenow_b.png');
	// console.log(img);
	// img.fitBounds(paper.bounds);
	//
	// img.onLoad = () => {
	// 	console.log('img loaded');
	// 	const resolution = 10;
	// 	const step = WIDTH / resolution;
	// 	for (let x = 0; x < WIDTH; x += step) {
	// 		for (let y = 0; y < HEIGHT; y += step) {
	// 			const clr = img.getAverageColor(new p.Point(x, y));
	// 			if (clr && clr.gray < 0.5) {
	// 				const e = drawE(p, new p.Point(x, y), step);
	// 				e.scale(0.9);
	// 				paper.addChild(e);
	// 			}
	// 		}
	// 	}
	// 	img.opacity = 0;
	// 	console.log('done');
	// };

	const writeBeHereNow = (size: number, position: paper.Point) => {
		const scale = size > 2 ? 0.75 : 0.6;
		const b = drawB(p, position, size);
		b.scale(scale);
		const e = drawE(p, new p.Point(position.x + size, position.y), size);
		e.scale(scale);
		const h = drawH(p, new p.Point(position.x + 2 * size, position.y), size);
		h.scale(scale);
		const e2 = drawE(p, new p.Point(position.x + 3 * size, position.y), size);
		e2.scale(scale);
		const r = drawR(p, new p.Point(position.x + 4 * size, position.y), size);
		r.scale(scale);
		const e3 = drawE(p, new p.Point(position.x + 5 * size, position.y), size);
		e3.scale(scale);
		const n = drawN(p, new p.Point(position.x + 6 * size, position.y), size);
		n.scale(scale);
		const o = drawO(p, new p.Point(position.x + 7 * size, position.y), size);
		o.scale(scale);
		const w = drawW(p, new p.Point(position.x + 8 * size, position.y), size);
		w.scale(scale);
	};

	p.project.view.onFrame = (event: { time: number; delta: number; count: number }) => {
		console.debug('::onFrame::', 'time', event.time, 'delta', event.delta, 'count', event.count);
		// write beherenow in varying sizes
		let mm = 5;
		let offset = 10;
		for (let i = mm; i > 4.9; ) {
			for (let j = 0; j < 15; j++) {
				console.log('writing be here now', i, offset, 'j', j);
				const pointSize = i * MM_TO_PT;
				const wordPointSize = pointSize * 9;
				const times = Math.floor(WIDTH / wordPointSize);
				for (let t = 0; t < times; t++) {
					writeBeHereNow(pointSize, new p.Point(10 + t * wordPointSize, 10 + offset));
				}
				offset += pointSize + 0.1 * MM_TO_PT;
			}
			i -= 0.1;
		}

		p.project.view.pause();
	};

	p.project.view.onClick = (event: paper.MouseEvent) => {
		console.debug('::onClick::', 'event', event);
		// Export the project as an SVG
		const svg = p.project.exportSVG({ asString: true });

		// Create a blob from the SVG string
		const blob = new Blob([svg as string], { type: 'image/svg+xml' });

		// Create a URL for the blob
		const url = URL.createObjectURL(blob);

		// Create a download link for the SVG
		const a = document.createElement('a');
		a.href = url;
		a.download = 'output.svg';
		document.body.appendChild(a);
		a.click();

		// Clean up
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};
}

export const BeHereNow: PaperSketch = {
	sketch: sketch,
	name: 'be here, now'
};
