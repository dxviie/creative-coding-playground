import type { PaperSketch } from '$lib/sketches/sketchTypes';

// using https://github.com/papnkukn/qrcode-svg
// npm install qrcode-svg

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

		console.log('qr', qr);
		// Generate the SVG string
		const svg = qr.svg();

		// export the svg to file
		// const blob = new Blob([svg], { type: 'image/svg+xml' });
		// const url = URL.createObjectURL(blob);
		// const a = document.createElement('a');
		// a.href = url;
		// a.download = 'qr.svg';
		// document.body.appendChild(a);
		// a.click();
		// document.body.removeChild(a);
		// URL.revokeObjectURL(url);

		// Import the SVG into the Paper.js project
		const imported = p.project.importSVG(svg);

		// Position the imported SVG in the center of the view
		if (imported) {
			imported.position = p.view.center;
		}
	});

	p.project.view.onFrame = (event: { time: number; delta: number; count: number }) => {
		// const qr = QRCode({
		// 	content: 'http://github.com/',
		// 	padding: 4,
		// 	width: 256,
		// 	height: 256,
		// 	color: '#000000',
		// 	background: '#ffffff',
		// 	ecl: 'M'
		// });
		// let svg = qr.svg();
		// console.log('qr', qr, 'svg', svg);
		p.project.view.pause();
	};
}

export const QRPlotter: PaperSketch = {
	sketch: sketch,
	name: '_Template'
};
