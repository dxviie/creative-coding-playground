import paper from 'paper';
import type { PaperSketch } from '$lib/sketches/sketchTypes';

function sketch(p: paper.PaperScope) {
	new p.Path.Line({
		from: [0, 0],
		to: [paper.project.view.bounds.width, paper.project.view.bounds.height],
		strokeColor: 'black'
	});

	new p.Path.Line({
		from: [0, paper.project.view.bounds.height],
		to: [paper.project.view.bounds.width, paper.project.view.bounds.height],
		strokeColor: 'red',
		strokeWidth: 5
	});

	const circle = new p.Path.Circle({
		center: [paper.project.view.bounds.width / 2, paper.project.view.bounds.height / 2],
		radius: 50,
		strokeColor: 'blue',
		strokeWidth: 5
	});

	p.project.view.onFrame = (event: { time: number; delta: number; count: number }) => {
		circle.position.x = Math.sin(event.time) * 100 + paper.project.view.bounds.width / 2;
	};
}

export const TestPaperSketch: PaperSketch = {
	sketch: sketch,
	name: 'Test Paper Sketch'
};
