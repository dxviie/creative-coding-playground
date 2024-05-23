import paper from 'paper';
import { getTranslationVector } from '$lib/sketches/SketchTools';

export function hatchRectangle(
	p: paper.PaperScope,
	rect: paper.Path.Rectangle,
	angle: number,
	spacing: number
) {
	const translation = getTranslationVector(angle, spacing);
	if (translation.x < 0) {
		translation.x *= -1;
		translation.y *= -1;
	}
	const inverse = { x: -translation.x, y: -translation.y };
	console.info(
		'hatchRectangle',
		'rect',
		rect.bounds,
		'angle',
		angle,
		'spacing',
		spacing,
		'translation',
		translation
	);
	const h = new p.Path.Line({
		from: [rect.bounds.x, rect.bounds.y - rect.bounds.height * 4],
		to: [rect.bounds.x, rect.bounds.y + rect.bounds.height * 4],
		strokeWidth: 1,
		strokeColor: 'red'
	});
	h.rotate(angle, [rect.bounds.x, rect.bounds.y + rect.bounds.height / 2]);
	// h.strokeWidth = 1;
	// h.strokeColor = new p.Color('black');
	console.debug('finding start position');
	while (h.intersects(rect)) {
		h.translate(inverse);
		console.debug('translating', h.bounds);
	}
	console.info('start position', h.bounds);

	do {
		h.translate(translation);
		const intersections = rect.getIntersections(h);
		if (intersections.length === 2) {
			const from = intersections[0].point;
			const to = intersections[1].point;
			const l = new p.Path.Line({ from: from, to: to });
			l.strokeWidth = 1;
			l.strokeColor = new p.Color('black');
			console.debug('adding line', l.bounds);
		}
	} while (rect.getIntersections(h).length > 0);

	h.remove();
}
