import type p5 from 'p5';

function sketch(p: p5) {
	p.setup = () => {
		p.createCanvas(1280, 720);
		p.background(0);
	};

	p.draw = () => {
		p.clear();
		p.background(0);
	};
}

export const _Template = {
	sketch: sketch,
	name: '_Template'
};
