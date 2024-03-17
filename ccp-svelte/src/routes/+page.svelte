<script lang="ts">
  import PaperSketch from "$lib/components/PaperSketch.svelte";
  import {TestPaperSketch} from "$lib/sketches/paper/TestPaperSketch";

  /*
      TODO - sketch selection
      TODO generic sketch props (e.g. size 720p, 1080p, 4K, A4, A3,... debug, ...)
   */

</script>

<!--<P5Sketch sketch={TestP5Sketch} />-->
<PaperSketch sketch={TestPaperSketch} />
