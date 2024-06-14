<script lang="ts">
	import PaperSketch from '$lib/components/PaperSketch.svelte';
	import { BeHereNow } from '$lib/sketches/paper/plotting/BeHereNow';
	import { QRPlotter } from '$lib/sketches/paper/plotting/QRPlotter';
	import { TestPatterns } from '$lib/sketches/paper/plotting/TestPatterns';
	import { FiboCard } from '$lib/sketches/paper/plotting/FiboCard';
	import { Pane } from 'tweakpane';
	import { onMount } from 'svelte';
	import { WaterRipples } from '$lib/sketches/p5/dandly-ambient/WaterRipples';
	import type { Sketch } from '$lib/sketches/sketchTypes';
	import P5Sketch from '$lib/components/P5Sketch.svelte';

	/*
			TODO - sketch selection
			TODO generic sketch props (e.g. size 720p, 1080p, 4K, A4, A3,... debug, ...)
	 */

	let sketches = [
		{name: 'Be Here Now', sketch: BeHereNow},
		{name: 'Test Patterns', sketch: TestPatterns},
		{name: 'QR Plotter', sketch: QRPlotter},
		{name: 'Fibonacci', sketch: FiboCard},
		{name: 'Water Ripples', sketch: WaterRipples}
	];

	let selectedSketch : Sketch | null = null;

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

<select bind:value={selectedSketch}>
	{#each sketches as {name, sketch}}
		<option value={sketch}>{name}</option>
	{/each}
</select>

{#if selectedSketch && selectedSketch.type === 'p5'}
	<P5Sketch sketch={selectedSketch} />
{:else if selectedSketch && selectedSketch.type === 'paper'}
	<PaperSketch sketch={selectedSketch} />
{:else}
	<p>Unknown sketch type: {selectedSketch}</p>
{/if}
