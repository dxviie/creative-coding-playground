<script lang="ts">
    import TestSketch from "$lib/components/P5Sketch.svelte";
    import {testSketch} from "$lib/sketches/TestSketch";

    let s = {
      sketch: testSketch
    };
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<TestSketch sketch={s} />

