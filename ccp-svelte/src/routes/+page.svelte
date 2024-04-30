<script lang="ts">
	import PaperSketch from '$lib/components/PaperSketch.svelte';
	import { QRPlotter } from '$lib/sketches/paper/plotting/QRPlotter';

	/*
			TODO - sketch selection
			TODO generic sketch props (e.g. size 720p, 1080p, 4K, A4, A3,... debug, ...)
	 */

</script>

<!--<P5Sketch sketch={WaterRipples} />-->
<!--<PaperSketch sketch={TestPatterns} />-->
<PaperSketch sketch={QRPlotter} />
