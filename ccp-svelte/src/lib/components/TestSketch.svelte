<script lang="ts">
    import { onMount } from 'svelte';
    import type p5 from 'p5';

    export let sketch : (p: p5) => void;

    let canvas : HTMLElement;

    onMount(async () => {
        // check if we're in the browser
        if (typeof window === 'undefined') return;
        // dynamically load p5
        let p5 = await import('p5');
        console.log('p5 loaded!')
        console.log(p5)
        // create a new p5 instance
        new p5.default(sketch, canvas);
    });

</script>

<div bind:this={canvas}></div>
