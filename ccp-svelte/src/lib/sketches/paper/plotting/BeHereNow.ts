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

const writeBeHere = (p: paper.PaperScope, size: number, position: paper.Point) => {
	const scale = size > 2 ? 0.75 : 0.6;
	const actualSize = size * scale;
	const b = drawB(p, position, actualSize);
	const e = drawE(p, new p.Point(position.x + size, position.y), actualSize);
	const h = drawH(p, new p.Point(position.x + 2 * size, position.y), actualSize);
	const e2 = drawE(p, new p.Point(position.x + 3 * size, position.y), actualSize);
	const r = drawR(p, new p.Point(position.x + 4 * size, position.y), actualSize);
	const e3 = drawE(p, new p.Point(position.x + 5 * size, position.y), actualSize);
};

const fillRectWithWords = (
	p: paper.PaperScope,
	rect: paper.Path.Rectangle,
	size: number,
	words: string,
	staggerFraction = 0
) => {};

function findChildByName(item, name) {
	if (item.name === name) return item;
	if (item.children) {
		for (var i = 0; i < item.children.length; i++) {
			var result = findChildByName(item.children[i], name);
			if (result) return result;
		}
	}
	return null;
}

function drawPathForSegments(p: paper.PaperScope, segments) {
	var path = new p.Path();
	segments.forEach(function (segment) {
		path.add(segment);
	});
	path.closed = true;
	path.strokeColor = 'orangered';
	path.strokeWidth = 1;
}

function drawCustomRectangleAround(p: paper.PaperScope, item) {
	drawPathForSegments(p, item.segments);
	var segments = item.segments;
	var minX = Infinity,
		minY = Infinity,
		maxX = -Infinity,
		maxY = -Infinity;

	segments.forEach(function (segment) {
		var point = segment.point;
		if (point.x < minX) minX = point.x;
		if (point.y < minY) minY = point.y;
		if (point.x > maxX) maxX = point.x;
		if (point.y > maxY) maxY = point.y;
	});

	var rectangle = new p.Path.Rectangle({
		point: [minX, minY],
		size: [maxX - minX, maxY - minY],
		strokeColor: 'green',
		strokeWidth: 1
	});
	// Optionally, you can send the rectangle to the back to ensure it doesn't cover the shape
	// rectangle.sendToBack();
}

function sketch(p: paper.PaperScope) {
	const paper = new p.Path.Rectangle({
		point: [0, 0],
		size: [WIDTH, HEIGHT],
		strokeColor: 'black',
		opacity: 0.5
	});
	p.project.importSVG('beherenow-pin-shape-export-c.svg', {
		expandShapes: true,
		insert: true,
		applyMatrix: false,
		onLoad: (svg) => {
			console.debug('imported', svg);
			p.project.view.play();
		}
	});

	let pin: null | paper.Path = null;
	let pinBounds: null | paper.Path.Rectangle = null;
	let pinCenter: null | paper.Path = null;
	let pinCenterBounds: null | paper.Path.Rectangle = null;

	p.project.view.onFrame = (event: { time: number; delta: number; count: number }) => {
		console.debug('::onFrame::', 'time', event.time, 'delta', event.delta, 'count', event.count);

		const items = p.project.activeLayer.getItems({});
		if (items.length > 0) {
			console.debug('items loaded:', items.length, items);
			pin = findChildByName(p.project.activeLayer, 'pin');
			pinCenter = findChildByName(p.project.activeLayer, 'pin-center');
			console.debug('pin', pin, 'pinCenter', pinCenter);

			if (pin) {
				pin.fillColor = 'transparent';
				pin.strokeColor = 'red';
				pin.strokeWidth = 1;
				console.debug('pin bounds', pin.bounds);
				console.debug('pin segments', pin.segments);
				pinBounds = new p.Path.Rectangle({
					point: [pin.bounds.x, pin.bounds.y],
					size: [pin.bounds.width, pin.bounds.height],
					strokeColor: 'blue',
					strokeWidth: 1
				});
			}
			if (pinCenter) {
				console.debug('pinCenter bounds', pinCenter.bounds);
				pinCenter.fillColor = 'transparent';
				pinCenter.strokeColor = 'red';
				pinCenter.strokeWidth = 1;
				pinCenterBounds = new p.Path.Rectangle({
					point: [pinCenter.bounds.x, pinCenter.bounds.y],
					size: [pinCenter.bounds.width, pinCenter.bounds.height],
					strokeColor: 'blue',
					strokeWidth: 1
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
				paper.bounds.center.x - center.x,
				paper.bounds.center.y - center.y - 65
			);
			const translate = new p.Point(-pinBounds.bounds.width / 4, -pinBounds.bounds.height / 4);
			pin.translate(diff);
			pinBounds.translate(diff);
			pinCenter.translate(diff);
			pinCenterBounds.translate(diff);
		}

		p.project.view.pause();
	};
	// p.project.view.scale(0.6);

	p.project.view.translate([
		(p.project.view.bounds.width - paper.bounds.width) / 2,
		(p.project.view.bounds.height - paper.bounds.height) / 2
	]);

	p.project.view.onMouseMove = (event) => {
		if (pin) {
			console.debug('contains', pin.contains(event.point));
		}
		p.project.activeLayer.selected = false;
		if (event.item) {
			console.debug('::onMouseMove::', 'event', event, 'event.item', event.item);
			event.item.selected = true;
		}
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
