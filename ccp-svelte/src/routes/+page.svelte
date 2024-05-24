<script lang="ts">
	import PaperSketch from '$lib/components/PaperSketch.svelte';
	import { BeHereNow } from '$lib/sketches/paper/plotting/BeHereNow';
	import { QRPlotter } from '$lib/sketches/paper/plotting/QRPlotter';
	import { TestPatterns } from '$lib/sketches/paper/plotting/TestPatterns';
	import { FiboCard } from '$lib/sketches/paper/plotting/FiboCard';
	import { Pane } from 'tweakpane';
	import { onMount } from 'svelte';

	/*
			TODO - sketch selection
			TODO generic sketch props (e.g. size 720p, 1080p, 4K, A4, A3,... debug, ...)
	 */

	let sketches = [
		{name: 'BeHereNow', sketch: BeHereNow},
		{name: 'TestPatterns', sketch: TestPatterns},
		{name: 'QRPlotter', sketch: QRPlotter},
		{name: 'Fibonacci', sketch: FiboCard},
	];

	let selectedSketch = sketches[3].sketch;

	onMount(() => {
		const PARAMS = {
			factor: 123,
			title: 'hello',
			color: '#F7941D',
		};

		const pane = new Pane({
			title: 'Parameters',
			expanded: false,
		});

		pane.addBinding(PARAMS, 'factor');
		pane.addBinding(PARAMS, 'title');
		pane.addBinding(PARAMS, 'color');
		// pane.hidden = true;
	});
</script>

<!--<P5Sketch sketch={WaterRipples} />-->
<!--<PaperSketch sketch={TestPatterns} />-->
<select bind:value={selectedSketch}>
	{#each sketches as {name, sketch}}
		<option value={sketch}>{name}</option>
	{/each}
</select>

<PaperSketch sketch={selectedSketch} />
<!--<PaperSketch sketch={QRPlotter} />-->
