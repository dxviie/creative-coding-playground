<script>
	import '../app.pcss';
    import * as Avatar from "$lib/components/ui/avatar";
</script>

<div class="page-container">

    <div class="page-header">
        <div class="header-left">
            <Avatar.Root>
                <Avatar.Image src="https://avatars.githubusercontent.com/u/42746902" />
            </Avatar.Root>
        </div>
        <div class="header-center">
            CCP
        </div>
        <div class="header-right">
            70b9ad66
        </div>
    </div>

    <div class="app-container">
        <slot />
    </div>

    <div class="page-footer">
    </div>
</div>

<style>
    .page-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        height: 100vh;
    }

    .page-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: .7rem;
        width: 100%;
        background-color: black;
        color: white;
        font-family: "Courier New", monospace;
    }

    .header-center {
        font-size: 1.5rem;
        font-weight: bold;
    }

    .app-container {
        /*background-color: aqua;*/
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .page-footer {
        width: 100%;
        padding: .7rem;
        background-color: black;
    }

</style>

