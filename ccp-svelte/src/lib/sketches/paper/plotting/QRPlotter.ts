import type { PaperSketch } from '$lib/sketches/sketchTypes';

// using https://github.com/papnkukn/qrcode-svg
// npm install qrcode-svg

const MM_TO_PT = 3.775;
const WIDTH = 15 * MM_TO_PT;
const HEIGHT = 15 * MM_TO_PT;
const PEN_WIDTH = 1 * MM_TO_PT;
const VIEW_SCALE = 15;
const HOR_COLOR = 'orange';
const VERT_COLOR = 'green';
const ALLOW_OVERLAP = true; // horizontal & vertical blocks start from the full set of blocks

function hasBlockAt(blocks: paper.Path.Rectangle[], point: paper.Point): boolean {
	return blocks.some((block) => block.contains(point));
}

async function sketch(p: paper.PaperScope) {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	import('qrcode-svg').then(({ default: QRCode }) => {
		/************************************************************************
											QR CODE GENERATION & PREPARATION
		 ************************************************************************/
		// Create a new QRCode
		const qr = new QRCode({
			content: 'https://qr.d17e.dev/abcd',
			padding: 0,
			width: 64,
			height: 64,
			color: '#000000',
			background: '#ffffff',
			ecl: 'M', // L, M, H, Q,
			join: false,
			predefined: false
		});

		// Generate the SVG string and import to paper
		const svg = qr.svg();
		p.project.clear();
		p.project.importSVG(svg);
		p.project.view.requestUpdate();
	});

	p.project.view.onFrame = (event: { time: number; delta: number; count: number }) => {
		console.debug('::onFrame::', 'time', event.time, 'delta', event.delta, 'count', event.count);
		const items = p.project.activeLayer.getItems({});
		if (items.length > 0) {
			p.project.clear();
			console.debug('qr items loaded:', items.length);

			// Target size rectangle
			const targetRect = new p.Path.Rectangle({
				from: [0, 0],
				to: [WIDTH, HEIGHT],
				strokeColor: 'black',
				strokeWidth: 0.1
			});

			// Make rectangle objects for the items and group on size
			const rectangleMap = new Map<number, paper.Path.Rectangle[]>();
			for (const item of items) {
				const rectangle = new p.Path.Rectangle({
					from: item.bounds.topLeft,
					to: item.bounds.bottomRight,
					strokeWidth: 0.1,
					strokeColor: 'orange'
				});
				const width = parseFloat(rectangle.bounds.width.toFixed(8));
				if (rectangleMap.has(width)) {
					rectangleMap.get(width)?.push(rectangle);
				} else {
					rectangleMap.set(width, [rectangle]);
				}
			}

			if (rectangleMap.size !== 2) {
				console.warn('unexpected number of sizes', rectangleMap.size);
			}

			// Remove the large blocks and do some analysis
			const qrFullSize = Math.max(...Array.from(rectangleMap.keys()));
			const qrBlockSize = Math.min(...Array.from(rectangleMap.keys()));
			const qrBlockDimensions = Math.floor(qrFullSize / qrBlockSize);
			const bigBlocks = rectangleMap.get(qrFullSize) || [];
			const qrBlocks = rectangleMap.get(qrBlockSize) || [];
			rectangleMap.clear();
			for (const rectangle of bigBlocks) {
				rectangle.remove();
			}
			for (const rectangle of qrBlocks) {
				rectangle.remove();
			}
			console.debug(
				'qrFullSize',
				qrFullSize,
				'qrBlockSize',
				qrBlockSize,
				'qrBlockCount',
				qrBlocks.length,
				'qrBlockDimensions',
				qrBlockDimensions
			);

			/************************************************************************
			 						GROUPING BLOCKS HORIZONTALLY & VERTICALLY
			 ************************************************************************/

			const targetBlockSize = WIDTH / qrBlockDimensions;
			// In the first pass we group horizontally
			let startX = -1;
			let endX = -1;
			const horizontalRectangles: paper.Path.Rectangle[] = [];
			const singleRectangles: paper.Path.Rectangle[] = [];
			for (let y = 0; y < qrBlockDimensions; y++) {
				for (let x = 0; x < qrBlockDimensions; x++) {
					const point = new p.Point(
						x * qrBlockSize + qrBlockSize / 2,
						y * qrBlockSize + qrBlockSize / 2
					);
					if (hasBlockAt(qrBlocks, point)) {
						if (startX < 0) startX = x;
						endX = x;
					} else {
						if (startX >= 0 && endX >= 0) {
							const r = new p.Path.Rectangle({
								from: [startX * targetBlockSize, y * targetBlockSize],
								to: [(endX + 1) * targetBlockSize, (y + 1) * targetBlockSize],
								fillColor: HOR_COLOR,
								opacity: 0.5
							});
							if (startX == endX) {
								singleRectangles.push(r);
							} else {
								horizontalRectangles.push(r);
							}
							startX = -1;
							endX = -1;
						}
					}
				}

				if (startX >= 0 && endX >= 0) {
					const r = new p.Path.Rectangle({
						from: [startX * targetBlockSize, y * targetBlockSize],
						to: [(endX + 1) * targetBlockSize, (y + 1) * targetBlockSize],
						fillColor: HOR_COLOR,
						opacity: 0.5
					});
					if (startX == endX) {
						singleRectangles.push(r);
					} else {
						horizontalRectangles.push(r);
					}
					startX = -1;
					endX = -1;
				}
			}
			console.debug(
				'horizontalRectangles',
				horizontalRectangles.length,
				'singleRectangles',
				singleRectangles.length
			);

			let startY = -1;
			let endY = -1;
			const verticalRectangles: paper.Path.Rectangle[] = [];
			for (let x = 0; x < qrBlockDimensions; x++) {
				for (let y = 0; y < qrBlockDimensions; y++) {
					let hasBlock = false;
					if (ALLOW_OVERLAP) {
						const point = new p.Point(
							x * qrBlockSize + qrBlockSize / 2,
							y * qrBlockSize + qrBlockSize / 2
						);
						hasBlock = hasBlockAt(qrBlocks, point);
					} else {
						const point = new p.Point(
							x * targetBlockSize + targetBlockSize / 2,
							y * targetBlockSize + targetBlockSize / 2
						);
						hasBlock = hasBlockAt(singleRectangles, point);
					}
					if (hasBlock) {
						if (startY < 0) startY = y;
						endY = y;
					} else {
						if (startY >= 0 && endY >= 0) {
							if (startY !== endY || !ALLOW_OVERLAP) {
								const r = new p.Path.Rectangle({
									from: [x * targetBlockSize, startY * targetBlockSize],
									to: [(x + 1) * targetBlockSize, (endY + 1) * targetBlockSize],
									fillColor: VERT_COLOR,
									opacity: 0.5
								});
								verticalRectangles.push(r);
							}
							startY = -1;
							endY = -1;
						}
					}
				}
				if (startY >= 0 && endY >= 0) {
					if (startY !== endY || !ALLOW_OVERLAP) {
						const r = new p.Path.Rectangle({
							from: [x * targetBlockSize, startY * targetBlockSize],
							to: [(x + 1) * targetBlockSize, (endY + 1) * targetBlockSize],
							fillColor: VERT_COLOR,
							opacity: 0.5
						});
						verticalRectangles.push(r);
					}
					startY = -1;
					endY = -1;
				}
			}
			console.debug('verticalRectangles', verticalRectangles.length);
			singleRectangles.forEach((r) => r.remove());
			singleRectangles.length = 0;
			targetRect.remove();

			/************************************************************************
			 								DRAWING THE ACTUAL PLOTTABLE LINES
			 ************************************************************************/

			let penWidth = PEN_WIDTH;
			if (PEN_WIDTH > targetBlockSize) {
				penWidth = targetBlockSize;
				console.warn(
					'penWidth (',
					penWidth,
					') exceeds targetBlockSize (',
					targetBlockSize,
					'), setting to targetBlockSize'
				);
			}
			const lines = Math.ceil(targetBlockSize / penWidth);
			let lineHeight = targetBlockSize / lines;
			if (lineHeight < 0) {
				lineHeight = targetBlockSize;
			}
			console.log(
				'lines',
				lines,
				'lineHeight',
				lineHeight,
				'targetBlockSize',
				targetBlockSize,
				'penWidth',
				penWidth
			);
			for (const rectangle of horizontalRectangles) {
				const yStart = rectangle.bounds.y + penWidth / 2;
				for (let l = 0; l < lines - 1; l++) {
					const y = yStart + l * lineHeight;
					new p.Path.Line({
						from: [rectangle.bounds.x + penWidth / 2, y],
						to: [rectangle.bounds.x + rectangle.bounds.width - penWidth / 2, y],
						strokeColor: 'black',
						strokeWidth: penWidth,
						opacity: 0.5,
						strokeCap: 'round'
					});
				}
				// last line, start from bottom
				const y = rectangle.bounds.y + rectangle.bounds.height - penWidth / 2;
				new p.Path.Line({
					from: [rectangle.bounds.x + penWidth / 2, y],
					to: [rectangle.bounds.x + rectangle.bounds.width - penWidth / 2, y],
					strokeColor: 'black',
					strokeWidth: penWidth,
					opacity: 0.5,
					strokeCap: 'round'
				});
				if (lines > 1) {
					// add vertical lines at the ends
					new p.Path.Line({
						from: [rectangle.bounds.x + penWidth / 2, rectangle.bounds.y + penWidth / 2],
						to: [
							rectangle.bounds.x + penWidth / 2,
							rectangle.bounds.y + rectangle.bounds.height - penWidth / 2
						],
						strokeColor: 'black',
						strokeWidth: penWidth,
						opacity: 0.5,
						strokeCap: 'round'
					});
					new p.Path.Line({
						from: [
							rectangle.bounds.x + rectangle.bounds.width - penWidth / 2,
							rectangle.bounds.y + penWidth / 2
						],
						to: [
							rectangle.bounds.x + rectangle.bounds.width - penWidth / 2,
							rectangle.bounds.y + rectangle.bounds.height - penWidth / 2
						],
						strokeColor: 'black',
						strokeWidth: penWidth,
						opacity: 0.5,
						strokeCap: 'round'
					});
				}
				rectangle.remove();
			}

			for (const rectangle of verticalRectangles) {
				for (let l = 0; l < lines - 1; l++) {
					const x = rectangle.bounds.left + l * lineHeight + penWidth / 2;
					new p.Path.Line({
						from: [x, rectangle.bounds.y + penWidth / 2],
						to: [x, rectangle.bounds.y + rectangle.bounds.height - penWidth / 2],
						strokeColor: 'black',
						strokeWidth: penWidth,
						opacity: 0.5,
						strokeCap: 'round'
					});
				}
				// last line, start from right
				const x = rectangle.bounds.left + rectangle.bounds.width - penWidth / 2;
				new p.Path.Line({
					from: [x, rectangle.bounds.y + penWidth / 2],
					to: [x, rectangle.bounds.y + rectangle.bounds.height - penWidth / 2],
					strokeColor: 'black',
					strokeWidth: penWidth,
					opacity: 0.5,
					strokeCap: 'round'
				});
				if (lines > 1) {
					// add horizontal lines at the ends
					new p.Path.Line({
						from: [rectangle.bounds.x + penWidth / 2, rectangle.bounds.y + penWidth / 2],
						to: [
							rectangle.bounds.x + rectangle.bounds.width - penWidth / 2,
							rectangle.bounds.y + penWidth / 2
						],
						strokeColor: 'black',
						strokeWidth: penWidth,
						opacity: 0.5,
						strokeCap: 'round'
					});
					new p.Path.Line({
						from: [
							rectangle.bounds.x + penWidth / 2,
							rectangle.bounds.y + rectangle.bounds.height - penWidth / 2
						],
						to: [
							rectangle.bounds.x + rectangle.bounds.width - penWidth / 2,
							rectangle.bounds.y + rectangle.bounds.height - penWidth / 2
						],
						strokeColor: 'black',
						strokeWidth: penWidth,
						opacity: 0.5,
						strokeCap: 'round'
					});
				}
				rectangle.remove();
			}

			p.project.activeLayer.position = p.project.view.center;
			p.view.scale(VIEW_SCALE);
			p.project.view.pause();
		}
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
		a.download = 'qr.svg';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		console.log('exported');
	};
}

export const QRPlotter: PaperSketch = {
	sketch: sketch,
	name: '_Template'
};
