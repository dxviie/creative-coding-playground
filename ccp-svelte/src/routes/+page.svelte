<script lang="ts">
	import PaperSketch from '$lib/components/PaperSketch.svelte';
	import { BeHereNow } from '$lib/sketches/paper/plotting/BeHereNow';
	import { QRPlotter } from '$lib/sketches/paper/plotting/QRPlotter';
	import { TestPatterns } from '$lib/sketches/paper/plotting/TestPatterns';

	/*
			TODO - sketch selection
			TODO generic sketch props (e.g. size 720p, 1080p, 4K, A4, A3,... debug, ...)
	 */

	let sketches = [
		{name: 'BeHereNow', sketch: BeHereNow},
		{name: 'TestPatterns', sketch: TestPatterns},
		{name: 'QRPlotter', sketch: QRPlotter}
	];

	let selectedSketch = sketches[0].sketch;
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
