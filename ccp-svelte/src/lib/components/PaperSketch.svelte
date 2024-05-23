<script lang="ts">
	import { onMount } from 'svelte';
	import paper from 'paper';
	import type { PaperSketch } from '$lib/sketches/sketchTypes';

	export let sketch : PaperSketch;

	let canvas : HTMLCanvasElement;
	let project : paper.Project;

	onMount(() => {
		paper.setup(canvas);
		project = paper.project;
	});

	// Reactive statement that runs whenever `sketch` changes
	$: {
		if (project) {
			project.clear();
		}
		paper.setup(canvas);
		project = paper.project;
		sketch.sketch(paper);
	}
</script>

<canvas class="paper-canvas" bind:this={canvas} data-paper-hidpi="off"></canvas>

<style>
    .paper-canvas {
        display: flex;
        width: 100%;
        height: 100%;
    }
</style>

