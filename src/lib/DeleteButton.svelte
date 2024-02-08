<script>
    export let func;
    export let valID;
    export let message;
    async function pressed()
    {
        func(valID);
    }
</script>

<button on:click={pressed}>{message}</button>