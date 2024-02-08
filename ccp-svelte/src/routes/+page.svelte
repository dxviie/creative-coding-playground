<script lang="ts">
    import P5Sketch from "$lib/components/P5Sketch.svelte";
    import {testSketch} from "$lib/sketches/testSketch";

    let s = {
      sketch: testSketch
    };
</script>

<P5Sketch sketch={s} />

