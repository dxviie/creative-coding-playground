import type { PaperSketch } from '$lib/sketches/sketchTypes';

function sketch(p: paper.PaperScope) {
	new p.Path.Line({
		from: [0, 0],
		to: [p.project.view.bounds.width, p.project.view.bounds.height],
		strokeColor: 'black'
	});

	const circle = new p.Path.Circle({
		center: [p.project.view.bounds.width / 2, p.project.view.bounds.height / 2],
		radius: 50,
		strokeColor: 'blue',
		strokeWidth: 5
	});

	p.project.view.onFrame = (event: { time: number; delta: number; count: number }) => {
		circle.position.x = Math.sin(event.time) * 100 + p.project.view.bounds.width / 2;
	};
}

export const _Template: PaperSketch = {
	sketch: sketch,
	name: '_Template'
};
