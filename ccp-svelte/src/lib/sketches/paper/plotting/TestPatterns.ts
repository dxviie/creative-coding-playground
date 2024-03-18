import type { PaperSketch } from '$lib/sketches/sketchTypes';
import paper from 'paper';

const A3_SIZE_IN_MM = [420, 297];
const A3_SIZE_IN_POINTS = A3_SIZE_IN_MM.map(mmToPoint);

async function sketch(p: paper.PaperScope) {
	// make an A3 sized rectangle
	const baseLayer = new p.Layer();
	const A3 = new p.Path.Rectangle({
		from: [0, 0],
		to: A3_SIZE_IN_POINTS,
		strokeColor: 'black',
		strokeWidth: 0
	});
	baseLayer.addChild(A3);

	const tiles = 4;
	const gap = mmToPoint(6);
	const height = mmToPoint(35);
	const tileWidth = A3.bounds.width / tiles - gap;
	for (let i = 0; i < tiles; i++) {
		const l = new p.Layer();
		const r = new p.Path.Rectangle({
			from: [gap * (i + 1) + tileWidth * i, 10],
			to: [gap * i + tileWidth * (i + 1), height],
			strokeColor: 'black',
			strokeWidth: 1
		});
		l.addChild(r);
		hatchRectangle(p, r, 45, mmToPoint(i * 2 + 1));
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
		h.translate([-mmSpacing, 0]);
		console.debug('translating', h.bounds);
	}

	do {
		h.translate([mmSpacing, 0]);
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
