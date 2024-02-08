<script lang="ts">
    import P5Sketch from "$lib/components/P5Sketch.svelte";
    import {testSketch} from "$lib/sketches/p5/testSketch";

    /*
        TODO - sketch selection
        TODO generic sketch props (e.g. size 720p, 1080p, 4K, A4, A3,... debug, ...)
     */

    let s = {
      sketch: testSketch
    };
</script>

<P5Sketch sketch={s} />

