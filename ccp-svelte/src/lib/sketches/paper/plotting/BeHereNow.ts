import type { PaperSketch } from '$lib/sketches/sketchTypes';

const MM_TO_PT = 3.775;
const WIDTH = 186 * MM_TO_PT;
const HEIGHT = 190 * MM_TO_PT;

const DEBUG = true;
const DEBUGSTROKE = DEBUG ? 3 : 0;

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

function lerp(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
	return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

const fillRectWithWords = (
	p: paper.PaperScope,
	rect: paper.Path.Rectangle,
	size: number,
	words: string,
	layer: paper.Layer,
	heart: paper.Path.Circle,
	staggerFraction = 0
) => {
	const letters = words.split('');
	let letterIndex = 0;
	let startIndex = 0;
	const location = new p.Point(rect.bounds.x, rect.bounds.y);
	let actualSize = size * 0.75;
	let fillIn = true;
	while (rect.contains(location)) {
		const distance = heart.bounds.center.getDistance(location);
		if (heart.contains(location)) {
			actualSize = size * 0.55;
			fillIn = false;
		} else {
			actualSize = size * lerp(distance, heart.bounds.height / 2, rect.bounds.height / 2, 0.7, 1);
			fillIn = true;
		}
		switch (letters[letterIndex]) {
			case 'b':
				layer.addChild(drawB(p, location, actualSize));
				break;
			case 'e':
				layer.addChild(drawE(p, location, actualSize));
				break;
			case 'h':
				layer.addChild(drawH(p, location, actualSize, fillIn));
				break;
			case 'r':
				layer.addChild(drawR(p, location, actualSize, fillIn));
				break;
			case 'n':
				console.log('drawing n');
				layer.addChild(drawN(p, location, actualSize));
				break;
			case 'o':
				layer.addChild(drawO(p, location, actualSize));
				break;
			case 'w':
				layer.addChild(drawW(p, location, actualSize));
				break;
			default:
				console.error('unknown letter', letters[letterIndex]);
		}
		location.x += size;
		letterIndex = (letterIndex + 1) % letters.length;
		if (location.x > rect.bounds.x + rect.bounds.width) {
			location.x = rect.bounds.x;
			location.y += size;
			letterIndex = (startIndex + Math.floor(staggerFraction * letters.length)) % letters.length;
			startIndex = letterIndex;
		}
	}
};

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
	let dot: null | paper.Path.Circle = null;
	let dotBounds: null | paper.Path.Rectangle = null;
	let dotCenter: null | paper.Path.Circle = null;

	const letterLayer = new p.Layer({ name: 'letters' });
	const boundsLayer = new p.Layer({ name: 'bounds' });

	/******************************************************************
	 * onFrame
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
				pin.strokeColor = 'green' as never;
				pin.strokeWidth = DEBUGSTROKE;
				pinBounds = new p.Path.Rectangle({
					point: [pin.bounds.x, pin.bounds.y],
					size: [pin.bounds.width, pin.bounds.height],
					strokeColor: 'blue',
					strokeWidth: DEBUGSTROKE
				});
				pin.addTo(boundsLayer);
				pinBounds.addTo(boundsLayer);
			}
			if (pinCenter && !pinCenterBounds) {
				pinCenter.fillColor = 'transparent' as never;
				pinCenter.strokeColor = 'green' as never;
				pinCenter.strokeWidth = DEBUGSTROKE;
				pinCenterBounds = new p.Path.Rectangle({
					point: [pinCenter.bounds.x, pinCenter.bounds.y],
					size: [pinCenter.bounds.width, pinCenter.bounds.height],
					strokeColor: 'blue',
					strokeWidth: DEBUGSTROKE
				});
				pinCenter.addTo(boundsLayer);
				pinCenterBounds.addTo(boundsLayer);
			}
		}

		// setup the dot
		if (!dot && !dotCenter) {
			const dotSize = 10 * MM_TO_PT;

			const centerPoint = new p.Point(
				canvas.bounds.x + canvas.bounds.width - dotSize * 1.5,
				canvas.bounds.y + dotSize * 1.5
			);
			dot = new p.Path.Circle({
				center: centerPoint,
				radius: dotSize,
				fillColor: 'transparent',
				strokeColor: 'green'
			});
			dotBounds = new p.Path.Rectangle({
				point: [dot.bounds.x, dot.bounds.y],
				size: [dot.bounds.width, dot.bounds.height],
				fillColor: 'transparent',
				strokeColor: 'blue',
				strokeWidth: DEBUGSTROKE
			});
			dotCenter = new p.Path.Circle({
				center: centerPoint,
				radius: dotSize / 3,
				fillColor: 'transparent',
				strokeColor: 'green'
			});
			dotCenter.translate([-dotSize / 16, -dotSize / 16]);
			pinCenter?.translate([-dotSize / 16, -dotSize / 16]);
			pinCenterBounds?.translate([-dotSize / 16, -dotSize / 16]);
		}

		// draw the letters
		if (pin && pinCenter && pinBounds && pinCenterBounds && dot && dotBounds && dotCenter) {
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

			fillRectWithWords(p, dotBounds, 6.66, 'now', letterLayer, dotCenter, 1 / 3);
			fillRectWithWords(p, pinBounds, 8.8, 'behere', letterLayer, pinCenter, 1 / 6);

			letterLayer.bringToFront();
			// p.project.view.scale(1.7); //, dot.bounds.center);

			// go over items in letterLayer and remove anything that's not inside the pin
			// let's do this recursively and only work in items that have bounds

			const toRemove: paper.Item[] = [];
			letterLayer.children.forEach((item) => {
				if (pin && item.bounds.center) {
					if (!pin.contains(item.bounds.center) && !dot?.contains(item.bounds.center)) {
						toRemove.push(item);
					}
				}
			});
			console.debug('toRemove', toRemove);
			toRemove.forEach((item) => {
				item.remove();
			});
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
	const topPct = 1 - 1 / 3;
	const midPct = 1 - 1 / 3;
	const botPct = 1 - 1 / 3;
	const horX = position.x + size / 16;
	const letterB = new p.CompoundPath({
		children: [
			new p.Path.Line(new p.Point(horX, position.y), new p.Point(horX, position.y + size)),
			new p.Path.Line(
				new p.Point(horX, position.y),
				new p.Point(position.x + size * topPct, position.y)
			),
			new p.Path.Arc(
				new p.Point(position.x + size * topPct, position.y),
				new p.Point(position.x + size * ((topPct + midPct) / 2 + 0.01), position.y + size / 2),
				new p.Point(position.x + size * midPct, position.y + size / 2)
			),

			new p.Path.Line(
				new p.Point(horX, position.y + size / 2),
				new p.Point(horX + size * midPct, position.y + size / 2)
			),
			new p.Path.Arc(
				new p.Point(position.x + size * midPct, position.y + size / 2),
				new p.Point(position.x + size * ((midPct + botPct) / 2 + 0.01), position.y + size),
				new p.Point(position.x + size * botPct, position.y + size)
			),
			new p.Path.Line(
				new p.Point(horX, position.y + size),
				new p.Point(horX + size * botPct, position.y + size)
			)
		],
		strokeColor: 'red',
		strokeWidth: 1
	});
	return letterB;
}

function drawH(
	p: paper.PaperScope,
	position: paper.Point,
	size: number,
	fillIn: boolean,
	horScale = 0.85
) {
	const sizeX = size * horScale;
	const padding = (size - sizeX) / 2;
	const horPart = sizeX / 4;
	const vertPart = size / 8;
	const letterH = new p.CompoundPath({
		children: [
			new p.Path.Line(
				new p.Point(position.x + padding, position.y),
				new p.Point(position.x + padding, position.y + size)
			),
			new p.Path.Line(
				new p.Point(position.x + padding, position.y + size / 2),
				new p.Point(position.x + padding + sizeX, position.y + size / 2)
			),
			new p.Path.Line(
				new p.Point(position.x + padding + sizeX, position.y),
				new p.Point(position.x + padding + sizeX, position.y + size)
			)
		],
		strokeColor: 'red',
		strokeWidth: 1
	});
	if (fillIn) {
		letterH.addChild(
			new p.Path.Line(
				new p.Point(position.x + padding + horPart * 2, position.y - vertPart),
				new p.Point(position.x + padding + horPart * 2, position.y + vertPart)
			)
		);
		letterH.addChild(
			new p.Path.Line(
				new p.Point(position.x + padding + horPart * 2, position.y + size - vertPart),
				new p.Point(position.x + padding + horPart * 2, position.y + size + vertPart)
			)
		);
	}
	return letterH;
}

function drawR(p: paper.PaperScope, position: paper.Point, size: number, fillIn = true) {
	const topPct = 0.75;
	const midPct = 0.75;
	const horPart = size / 4;
	const vertPart = size / 8;
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
	if (fillIn) {
		letterR.addChild(
			new p.Path.Line(
				new p.Point(position.x + horPart * 2, position.y + size - vertPart),
				new p.Point(position.x + horPart * 2, position.y + size + vertPart)
			)
		);
	}
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
