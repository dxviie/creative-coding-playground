import type { PaperSketch } from '$lib/sketches/sketchTypes';
import paper from 'paper';

const A3_SIZE_IN_MM = [420, 297];
const A3_SIZE_IN_POINTS = A3_SIZE_IN_MM.map(mmToPoint);

async function sketch(p: paper.PaperScope) {
	// make an A3 sized rectangle
	const baseLayer = new p.Layer();
	const A3 = new p.Path.Rectangle({
		position: [0, 0],
		size: A3_SIZE_IN_POINTS,
		strokeColor: 'black',
		strokeWidth: 1
	});
	baseLayer.addChild(A3);

	const tiles = 10;
	const gap = mmToPoint(2);
	const height = mmToPoint(20);
	const tileWidth = A3.bounds.width / tiles - gap;
	const tileSize = new p.Size(tileWidth, height);
	for (let i = 0; i < tiles; i++) {
		const l = new p.Layer();
		const r = new p.Path.Rectangle({
			position: [tileSize.width * i + gap * (i + 1), 10],
			size: tileSize,
			strokeColor: 'black',
			strokeWidth: 1
		});
		l.addChild(r);
		l.translate([-A3.bounds.width / 2 + tileWidth / 2 - gap / 2, 0]);
		hatchRectangle(p, r, 45, i * 0.5 + 0.5);
		baseLayer.addChild(l);
	}

	console.log('exporting');
	// p.project.view.viewSize = g.bounds.size;
	const svg = await p.project.exportSVG({ asString: true, bounds: A3 });
	// @ts-expect-error we know svg is a string
	const blob = new Blob([svg], { type: 'image/svg+xml' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = 'test.svg';
	document.body.appendChild(a);
	a.click();
	console.log('exported');

	// scale to fit view
	baseLayer.fitBounds(p.project.view.bounds.scale(0.9));
}

function hatchRectangle(
	p: paper.PaperScope,
	rect: paper.Path.Rectangle,
	angle: number,
	mmSpacing: number
) {
	console.debug('hatchRectangle', rect, angle, mmSpacing, 1);
	const h = new p.Path.Line({
		from: [rect.bounds.x, rect.bounds.y - 100],
		to: [rect.bounds.x, rect.bounds.height + 100]
	});
	h.rotate(angle, [rect.bounds.x, rect.bounds.height / 2]);
	h.strokeWidth = 1;
	h.strokeColor = new p.Color('black');

	console.debug('finding start position');
	while (h.intersects(rect)) {
		h.translate([-mmToPoint(mmSpacing), 0]);
		console.debug('translating', h.bounds);
	}

	do {
		h.translate([mmToPoint(mmSpacing), 0]);
		const intersections = rect.getIntersections(h);
		if (intersections.length === 2) {
			const from = intersections[0].point;
			const to = intersections[1].point;
			const l = new p.Path.Line({ from: from, to: to });
			l.strokeWidth = 1;
			l.strokeColor = new p.Color('black');
			if (rect.layer) {
				rect.layer.addChild(l);
			}
		}
	} while (rect.getIntersections(h).length > 0);

	h.remove();
}

function mmToPoint(mm: number): number {
	return mm / 0.352778;
}

function pointToMm(point: number): number {
	return point * 0.352778;
}

export const TestPatterns: PaperSketch = {
	sketch: sketch,
	name: 'Test patterns for pen testing'
};
