import type { PaperSketch } from '$lib/sketches/sketchTypes';
import paper from 'paper';
import { hatchRectangle } from '$lib/sketches/paper/PaperTools';

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
		hatchRectangle(p, r, 45, mmToPoint(i * 0.5 + 0.5));
		baseLayer.addChild(l);
	}

	let longRect = new p.Path.Rectangle({
		position: [100, 5],
		size: [50, 800],
		strokeColor: 'black',
		strokeWidth: 1
	}).addTo(baseLayer);
	hatchRectangle(p, longRect, 45, 5);

	p.project.view.onClick = async (event: paper.MouseEvent) => {
		console.log('exporting');
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
	};

	// scale to fit view
	baseLayer.fitBounds(p.project.view.bounds.scale(0.9));
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
