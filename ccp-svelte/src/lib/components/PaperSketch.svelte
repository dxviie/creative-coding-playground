<script lang="ts">
	import { onMount } from 'svelte';
	import paper from 'paper';
	import type { PaperSketch } from '$lib/sketches/sketchTypes';

	export let sketch : PaperSketch;

  let canvas : HTMLCanvasElement;

  onMount(() => {
    paper.setup(canvas);
    sketch.sketch(paper);
  });
</script>

<canvas class="paper-canvas" bind:this={canvas} data-paper-hidpi="off"></canvas>

<style>
    .paper-canvas {
        display: flex;
        width: 100%;
        height: 100%;
    }
</style>

