<script lang="ts">
  import {onMount} from 'svelte';
  import type {P5Sketch} from "$lib/sketches/sketchTypes";

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

    let canvas : HTMLElement;

    onMount(async () => {
        if (typeof window === 'undefined') return;
        let p5 = await import('p5');
        new p5.default(sketch.sketch, canvas);
    });

</script>

<div bind:this={canvas}></div>
