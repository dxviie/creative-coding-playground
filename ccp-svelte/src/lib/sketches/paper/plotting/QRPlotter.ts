import type { PaperSketch } from '$lib/sketches/sketchTypes';

// using https://github.com/papnkukn/qrcode-svg
// npm install qrcode-svg

const MM_TO_PT = 3.775;
const WIDTH = 15 * MM_TO_PT;
const HEIGHT = 15 * MM_TO_PT;
const PEN_WIDTH = 0.2;
const PEN_WIDTH_PT = PEN_WIDTH * MM_TO_PT;
const VIEW_SCALE = 1;

function hasBlockAt(blocks: paper.Path.Rectangle[], point: paper.Point): boolean {
	return blocks.some((block) => block.contains(point));
}

async function sketch(p: paper.PaperScope) {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	import('qrcode-svg').then(({ default: QRCode }) => {
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

			const targetBlockSize = WIDTH / qrBlockDimensions;
			// In the first pass we group horizontally
			let startX = -1;
			let endX = -1;
			const groupedRects: paper.Path.Rectangle[] = [];
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
							groupedRects.push(
								new p.Path.Rectangle({
									from: [startX * targetBlockSize, y * targetBlockSize],
									to: [(endX + 1) * targetBlockSize, (y + 1) * targetBlockSize],
									fillColor: 'orange',
									opacity: 0.5
								})
							);
							startX = -1;
							endX = -1;
						}
					}
				}

				if (startX >= 0 && endX >= 0) {
					groupedRects.push(
						new p.Path.Rectangle({
							from: [startX * targetBlockSize, y * targetBlockSize],
							to: [(endX + 1) * targetBlockSize, (y + 1) * targetBlockSize],
							fillColor: 'green',
							opacity: 0.5
						})
					);
					startX = -1;
					endX = -1;
				}
			}
			console.debug('groupedRects', groupedRects.length);
			targetRect.remove();

			const lines = Math.floor(targetBlockSize / PEN_WIDTH_PT) + 1;
			const lineHeight = (targetBlockSize - PEN_WIDTH_PT) / (lines - 1);
			console.log(
				'lines',
				lines,
				'lineHeight',
				lineHeight,
				'targetBlockSize',
				targetBlockSize,
				'PEN_WIDTH_PT',
				PEN_WIDTH_PT
			);
			for (const rectangle of groupedRects) {
				for (let l = 0; l < lines; l++) {
					const y = rectangle.bounds.y + l * lineHeight;
					new p.Path.Line({
						from: [rectangle.bounds.x, y],
						to: [rectangle.bounds.x + rectangle.bounds.width, y],
						strokeColor: 'black',
						strokeWidth: PEN_WIDTH_PT,
						opacity: 0.5
					});
					rectangle.remove();
				}
			}

			p.project.activeLayer.position = p.project.view.center;
			p.view.scale(VIEW_SCALE);
			p.project.view.pause();
		}
	};

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
