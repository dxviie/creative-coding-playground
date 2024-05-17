import type { PaperSketch } from '$lib/sketches/sketchTypes';

const MM_TO_PT = 3.775;
const WIDTH = 186 * MM_TO_PT;
const HEIGHT = 190 * MM_TO_PT;

const DEBUG = true;
const DEBUGSTROKE = DEBUG ? 1 : 0;

// const writeBeHere = (p: paper.PaperScope, size: number, position: paper.Point) => {
// 	const scale = size > 2 ? 0.75 : 0.6;
// 	const actualSize = size * scale;
// 	const b = drawB(p, position, actualSize);
// 	const e = drawE(p, new p.Point(position.x + size, position.y), actualSize);
// 	const h = drawH(p, new p.Point(position.x + 2 * size, position.y), actualSize);
// 	const e2 = drawE(p, new p.Point(position.x + 3 * size, position.y), actualSize);
// 	const r = drawR(p, new p.Point(position.x + 4 * size, position.y), actualSize);
// 	const e3 = drawE(p, new p.Point(position.x + 5 * size, position.y), actualSize);
// };

const fillRectWithWords = (
	p: paper.PaperScope,
	rect: paper.Path.Rectangle,
	size: number,
	words: string,
	staggerFraction = 0
) => {};

function findChildByName<T extends paper.Item>(item: paper.Item, name: string): T | null {
	if (item.name === name) return item as T;
	if (item.children) {
		for (let i = 0; i < item.children.length; i++) {
			const result = findChildByName(item.children[i], name);
			if (result) return result as T;
		}
	}
	return null;
}

function sketch(p: paper.PaperScope) {
	// setup our canvas
	const canvas = new p.Path.Rectangle({
		point: [0, 0],
		size: [WIDTH, HEIGHT],
		strokeColor: 'black',
		opacity: 0.5
	});
	p.project.view.translate([
		(p.project.view.bounds.width - canvas.bounds.width) / 2,
		(p.project.view.bounds.height - canvas.bounds.height) / 2
	]);

	// import our shapes
	p.project.importSVG('beherenow-pin-shape-export-c.svg', {
		expandShapes: true,
		insert: true,
		applyMatrix: false,
		onLoad: (svg: never) => {
			console.debug('imported', svg);
			p.project.view.play();
		}
	});

	let pin: null | paper.Path = null;
	let pinBounds: null | paper.Path.Rectangle = null;
	let pinCenter: null | paper.Path = null;
	let pinCenterBounds: null | paper.Path.Rectangle = null;

	/******************************************************************
	 * Animation
	 ******************************************************************/
	p.project.view.onFrame = (event: { time: number; delta: number; count: number }) => {
		console.debug('::onFrame::', 'time', event.time, 'delta', event.delta, 'count', event.count);

		const items = p.project.activeLayer.getItems({});
		if (items.length > 0 && (!pin || !pinCenter || !pinBounds || !pinCenterBounds)) {
			pin = findChildByName(p.project.activeLayer, 'pin');
			pinCenter = findChildByName(p.project.activeLayer, 'pin-center');
			console.debug('pin', pin, 'pinCenter', pinCenter);

			// draw shapes and setup bounding boxes
			if (pin && !pinBounds) {
				pin.fillColor = 'transparent' as never;
				pin.strokeColor = 'red' as never;
				pin.strokeWidth = DEBUGSTROKE;
				pinBounds = new p.Path.Rectangle({
					point: [pin.bounds.x, pin.bounds.y],
					size: [pin.bounds.width, pin.bounds.height],
					strokeColor: 'blue',
					strokeWidth: DEBUGSTROKE
				});
			}
			if (pinCenter && !pinCenterBounds) {
				pinCenter.fillColor = 'transparent' as never;
				pinCenter.strokeColor = 'red' as never;
				pinCenter.strokeWidth = DEBUGSTROKE;
				pinCenterBounds = new p.Path.Rectangle({
					point: [pinCenter.bounds.x, pinCenter.bounds.y],
					size: [pinCenter.bounds.width, pinCenter.bounds.height],
					strokeColor: 'blue',
					strokeWidth: DEBUGSTROKE
				});
			}
		}

		if (pin && pinCenter && pinBounds && pinCenterBounds) {
			const scale = 0.5;
			const center = new p.Point(
				pinCenterBounds.bounds.x + pinCenterBounds.bounds.width / 2,
				pinCenterBounds.bounds.y + pinCenterBounds.bounds.height / 2
			);
			pin.scale(scale, center);
			pinBounds.scale(scale, center);
			pinCenterBounds.scale(scale, center);
			pinCenter.scale(scale, center);
			// calculate the difference between the paper center and the pin center
			const diff = new p.Point(
				canvas.bounds.center.x - center.x,
				canvas.bounds.center.y - center.y - 65
			);
			pin.translate(diff);
			pinBounds.translate(diff);
			pinCenter.translate(diff);
			pinCenterBounds.translate(diff);
		}
		p.project.view.pause();
	};

	/******************************************************************
	 * Debugging
	 ******************************************************************/
	p.project.view.onMouseMove = (event: paper.MouseEvent) => {
		if (pin) {
			console.debug('pin contains', pin.contains(event.point));
		}
	};

	/******************************************************************
	 * Export the SVG when the user clicks on the canvas
	 ******************************************************************/
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
		a.download = 'where-are-you.svg';
		document.body.appendChild(a);
		a.click();

		// Clean up
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		console.debug('SVG exported');
	};
}

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

function drawH(p: paper.PaperScope, position: paper.Point, size: number, horScale = 0.85) {
	const sizeX = size * horScale;
	const letterH = new p.CompoundPath({
		children: [
			new p.Path.Line(position, new p.Point(position.x, position.y + size)),
			new p.Path.Line(
				new p.Point(position.x, position.y + size / 2),
				new p.Point(position.x + sizeX, position.y + size / 2)
			),
			new p.Path.Line(
				new p.Point(position.x + sizeX, position.y),
				new p.Point(position.x + sizeX, position.y + size)
			)
			// new p.Path.Line(
			// 	new p.Point(position.x + size / 2, position.y + size * 0.8),
			// 	new p.Point(position.x + size / 2, position.y + size * 1.6)
			// )
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

export const BeHereNow: PaperSketch = {
	sketch: sketch,
	name: 'be here, now'
};
