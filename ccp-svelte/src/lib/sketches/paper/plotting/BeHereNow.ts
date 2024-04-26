import type { PaperSketch } from '$lib/sketches/sketchTypes';

const MM_TO_PT = 2.83464567;
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

function sketch(p: paper.PaperScope) {
	const paper = new p.Path.Rectangle({
		point: [0, 0],
		size: [WIDTH, HEIGHT],
		strokeColor: 'black'
	});
	const img = new p.Raster('beherenow_b.png');
	console.log(img);
	img.fitBounds(paper.bounds);

	// const letterGrid = new p.Group();
	img.onLoad = () => {
		console.log('img loaded');
		const resolution = 10;
		const step = WIDTH / resolution;
		for (let x = 0; x < WIDTH; x += step) {
			for (let y = 0; y < HEIGHT; y += step) {
				const clr = img.getAverageColor(new p.Point(x, y));
				if (clr && clr.gray < 0.5) {
					const e = drawE(p, new p.Point(x, y), step);
					e.scale(0.9);
					paper.addChild(e);
				}
			}
		}
		img.opacity = 0;
		console.log('done');
	};

	p.project.view.onFrame = (event: { time: number; delta: number; count: number }) => {
		console.debug('::onFrame::', 'time', event.time, 'delta', event.delta, 'count', event.count);
		p.project.view.pause();
	};

	p.project.view.onClick = (event: paper.MouseEvent) => {
		console.debug('::onClick::', 'event', event);
		paper.exportSVG({ asString: true });
	};
}

export const BeHereNow: PaperSketch = {
	sketch: sketch,
	name: 'be here, now'
};
