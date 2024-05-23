import paper from 'paper';

export function hatchRectangle(
	p: paper.PaperScope,
	rect: paper.Path.Rectangle,
	angle: number,
	spacing: number
) {
	console.debug('hatchRectangle', 'rect', rect, 'angle', angle, 'spacing', spacing);
	const h = new p.Path.Line({
		from: [rect.bounds.x, rect.bounds.y - 100],
		to: [rect.bounds.x, rect.bounds.height + 100]
	});
	h.rotate(angle, [rect.bounds.x, rect.bounds.height / 2]);
	h.strokeWidth = 1;
	h.strokeColor = new p.Color('black');

	console.debug('finding start position');
	while (h.intersects(rect)) {
		h.translate([-spacing, 0]);
		console.debug('translating', h.bounds);
	}

	do {
		h.translate([spacing, 0]);
		const intersections = rect.getIntersections(h);
		if (intersections.length === 2) {
			const from = intersections[0].point;
			const to = intersections[1].point;
			const l = new p.Path.Line({ from: from, to: to });
			l.strokeWidth = 1;
			l.strokeColor = new p.Color('black');
			// if (rect.layer) {
			// 	rect.layer.addChild(l);
			// }
			console.debug('adding line', l.bounds);
		}
	} while (rect.getIntersections(h).length > 0);

	h.remove();
}
