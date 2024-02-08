<script lang="ts">
    import TestSketch from "$lib/components/TestSketch.svelte";
    import type p5 from 'p5';

    let s = (p : p5) => {
        p.setup = () => {
            p.createCanvas(400, 400);
            p.background(0);
        };
        p.draw = () => {
            p.fill(255);
            p.ellipse(p.mouseX, p.mouseY, 50, 50);
        };
    };
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<TestSketch sketch={s} />

