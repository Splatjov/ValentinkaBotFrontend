<script>
    import DeleteButton from "../../lib/DeleteButton.svelte";

    let backendUrl = "https://8b7d-37-47-138-143.ngrok-free.app"
    import { browser } from "$app/environment";
    let response;
    let valentines;
    let user;
    let count, countDef=0, countBM=0;
    async function get_data()
    {

        await fetch(backendUrl + "/get_valentine_info", {
            method: "get",
            headers: new Headers({
                "X-Tg-Token": window.Telegram.WebApp.initData,
                "ngrok-skip-browser-warning": "69420",
            }),
            Origin: window.location.origin,
        }).then(resp => {
            if (resp.ok) {
                return resp.json()
            }
            else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }).then(data => {
            valentines = data.valentines;
            user = data.user;
            count = data.countReceived;
            countDef = data.countSentDefault;
            countBM = data.countSentBeMine;
            console.log(valentines, user, count, countDef, countBM);
        })
    }
    async function delete_valentine(valID)
    {
        await fetch(backendUrl + "/delete_valentine", {
            method: "get",
            headers: new Headers({
                "X-Tg-Token": window.Telegram.WebApp.initData,
                "ngrok-skip-browser-warning": "69420",
                "valID": valID,
            }),
            Origin: window.location.origin,
        }).then(resp => {
            if (!resp.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            else {
                if (browser) {
                    location.reload();
                }

            }
        })
    }
    if (browser) {
        get_data();
    }


</script>

<div id="miniheader">
    <h3>Отправлено {countBM} из 5 be mine валентинок</h3>
    <h3>Отправлено {countDef} из 20 обычных валентинок</h3>
    {#if typeof valentines === 'object' }
        {#each valentines as valentine}
            {#if valentine.receiver.name !== ""}
                {#if valentine.text === ""}
                    <span >{valentine.id} - {valentine.receiver.name} - {"Без текста"} - {valentine.type}</span>
                {/if}
                {#if valentine.text !== ""}
                    <span >{valentine.id} - {valentine.receiver.name} - {valentine.text} - {valentine.type}</span>
                {/if}
            {/if}
            {#if valentine.receiver.name === ""}
                {#if valentine.text === ""}
                    <span >{valentine.id} - {valentine.receiver.id} - {"Без текста"} - {valentine.type}</span>
                {/if}
                {#if valentine.text !== ""}
                    <span >{valentine.id} - {valentine.receiver.id} - {valentine.text} - {valentine.type}</span>
                {/if}
            {/if}
            <DeleteButton valID={valentine.id} func={delete_valentine} message="Удалить валентинку {valentine.id}"></DeleteButton>
        {/each}
    {/if}
</div>

<style>
    @import "../styles.css";
</style>