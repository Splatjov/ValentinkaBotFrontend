<script>
    import {getContext} from 'svelte';
    import Popup from './Popup.svelte';
    import {modalMessage} from './stores.js'; // Import stores

    const {open} = getContext('simple-modal');
    export let func;

    export let showSurprise = () => {
        func();
        open(Popup);
    }
</script>

<p>
    <button on:click={showSurprise}>{$modalMessage}</button>
</p>