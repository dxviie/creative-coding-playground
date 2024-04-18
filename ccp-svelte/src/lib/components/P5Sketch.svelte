<script lang="ts">
	import { onMount } from 'svelte';
	import type { P5Sketch } from '$lib/sketches/sketchTypes';
	import type p5 from 'p5';

	/**
     *  GENUARY "CONTROLS"
     *    export let key = null;
     *    export let name = null;
     *    export let sketch = null;
     *    export let reset = null;
     *    export let debug = false;
     *    export let animate = true;
     *    export let ping = 0;
     *    export let record = false;
     *  TODO >>>  Sketch features
     *    FIRST
     *    - record frame & video
     *    - NO MORE reset -> sketch is the p5/paper/... sketch as is (cfr p5 type)
     *    UTOPIA
     *    - dynamiIc props system: number, range (min, max, step), color, boolean, string
     *      with automatic UI and data binding into sketch (somehow ?!)
     *
      */
    export let sketch : P5Sketch;

    let canvasWrapper : HTMLElement;
		let instance : p5;
		let recording = false;

    onMount(async () => {
        if (typeof window === 'undefined') return;
        let p5 = await import('p5');
				instance = new p5.default(sketch.sketch, canvasWrapper);
				const sketchDraw = instance.draw;
				instance.draw = () => {
					sketchDraw();
					if (recording) {
						let paddedFrame = String(instance.frameCount).padStart(10, '0');
						instance.saveCanvas(`frame-${paddedFrame}`, 'png');
					}
				}
		});
</script>

<div class="p5-wrapper" bind:this={canvasWrapper}></div>

<button on:click={() => recording = !recording}>{recording ? 'Stop Recording' : 'Start Recording'}</button>

<style>
		button {

		}
			.p5-wrapper {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100%;
				height: 100%;
		}
</style>

