<script>

    let backendUrl = "https://8b7d-37-47-138-143.ngrok-free.app"
    import { browser } from "$app/environment";
    let response;
    let valentines;
    let user;
    let count, countDef, countBM;
    let itsTime = false;
    async function get_data()
    {
        await fetch(backendUrl + "/get_my_valentine", {
            method: "get",
            headers: new Headers({
                "X-Tg-Token": window.Telegram.WebApp.initData,
                "ngrok-skip-browser-warning": "69420",
            }),
            Origin: window.location.origin,
        }).then(resp => {
            if (resp.ok)
            {
                itsTime = true;
            }
        })
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
    if (browser) {
        get_data();
    }


</script>

<div id="block">
    <div id="header">
        <h3>Пока что я получил:</h3>
    </div>
    <div id="header">
        {#if count === undefined}
            <span id="big number">0</span>
        {/if}
        {#if count !== undefined}
            <span id="big number">{count}</span>
        {/if}
    </div>
    <div id="header">
        <h3>Валентинок</h3>
    </div>
    <div id="glupi">
        <button onclick="location.href='/my_valentines'">
            Мои Валентинки
        </button>
        {#if itsTime}
            <button onclick="location.href='/get_my_valentines'">
                Посмотреть мои валентинки
            </button>
        {:else}
            <button onclick="location.href='/send_valentine'">
                Отправить Валентинку
            </button>
        {/if}
    </div>

</div>



<style>
    @import "styles.css";
</style>