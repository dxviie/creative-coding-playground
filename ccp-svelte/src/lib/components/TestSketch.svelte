<script lang="ts">
    import { onMount } from 'svelte';


    let canvas : HTMLElement;

    let p5;

    onMount(async () => {
        // check if we're in the browser
        // if (typeof window === 'undefined') return;
        // dynamically load p5
        p5 = await import('p5');
        console.log('p5 loaded!')
        console.log(p5)
        // create a new p5 instance
        new p5.default((p) => {
            p.setup = () => {
                p.createCanvas(400, 400);
                p.background(0);
            };
            p.draw = () => {
                p.fill(255);
                p.ellipse(p.mouseX, p.mouseY, 50, 50);
            };
        }, canvas);
    });

</script>

<div bind:this={canvas}>

</div>
