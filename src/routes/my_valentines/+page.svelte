<script>

    import {generateStyle} from "../../lib/functions.js";
    import Countdown from 'svelte-countdown/src/index.js'

    let backendUrl = "https://api_valentinka.splatjov.space"
    import { browser } from "$app/environment";
    let response;
    // eslint-disable-next-line no-unused-vars
    let valentines = [];
    // eslint-disable-next-line no-unused-vars
    let user;
    // eslint-disable-next-line no-unused-vars
    let count=0, countDef, countBM;
    let itsTime = false;
    let time;


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
                time = resp.headers.get('Time');
            }
        })
        await fetch(backendUrl + "/get_my_valentine", {
            method: "get",
            headers: new Headers({
                "X-Tg-Token": window.Telegram.WebApp.initData,
                "ngrok-skip-browser-warning": "69420",
            }),
            Origin: window.location.origin,
        }).then(resp => {
            if (resp.ok) {
                time = resp.headers.get('Time');
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
            console.log(valentines);
        })
    }
    function updateIfPossible(str) {
        if (str === "")
        {
            return "Нет текста";
        }
        return str;
    }
    function chooseOne(id, name) {
        if (name === "") return id;
        return name;
    }
    function matchType(str) {
        if (str === 'default') return "Обычная";
        else return 'Be mine';
    }

    function s(a)
    {
        if (a<10)
        {
            return '0'+a.toString();
        }
        return a.toString();
    }

    if (browser) {
        get_data();
    }

</script>
{#await countDef}
    <p>...waiting</p>
{:then number}
    <html lang="ru">
    <div style="display: flex; flex-direction: row; justify-content: space-between; padding-top: 0.5vh; padding-left: 4vw; padding-right: 4vw; width: 100vw">
        <div style="display: flex; justify-content: center; padding: 1vh">
            <lottie-player
                    autoplay
                    loop
                    mode="normal"
                    src="20_HEART_MENDING_OUT.json"
                    style="width: 14vh"
            ></lottie-player>
        </div>
        <p class = "simpletext" style="font-size: 9vw; text-align: right; margin-top: 2.5vh">Полученные валентинки</p>
    </div>
    <div id="block">
        <div class="list-group" style="width: 100vw; display: flex; flex-direction: column; justify-content: center; align-items: center">
            {#if valentines.length === 0}
                <p class = "simpletext" style="font-size: 6vw; text-align: center; margin-top:30vh">😔 Не расстраивайся, повезет в следующем году!</p>
            {/if}
            {#each valentines as valentine, index}
                <a href="/my_valentine?userID={valentine.receiver.id}&ID={valentine.id}" class="list-group-item list-group-item-action flex-column align-items-start" style="width: 90vw; {generateStyle(index, valentines)}">
                    <p class="simpletext" style="text-align: left; line-height: 1.2">{updateIfPossible(valentine.text.slice(0,50))}</p>
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="description" style="padding-top: 1vh">{chooseOne("ID: " + valentine.receiver.id, valentine.receiver.name)}</h5>
                        <small class="description" style="padding-top: 1vh">{matchType(valentine.type)}</small>
                    </div>
                </a>
            {/each}

        </div>
    </div>
    </html>
{/await}





<style>
    @import "../styles.css";
</style>