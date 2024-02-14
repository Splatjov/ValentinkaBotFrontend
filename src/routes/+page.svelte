<script>

    import {ping} from "../lib/functions.js";
    import Countdown from 'svelte-countdown/src/index.js'
    import {generateStyle} from "../lib/functions.js";


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
            console.log(valentines);
            fillList(valentines);

            countBM = data.countSentBeMine;
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
    import { Listgroup } from 'flowbite-svelte';
    let links = [];
    function fillList(valentines)
    {
        for (let valentine of valentines)
        {
            let obj = {
                text: updateIfPossible(updateIfPossible(valentine.text.slice(0,50))),
                name: chooseOne("ID: " + valentine.receiver.id, valentine.receiver.name),
                href: "/valentine?ID="+valentine.id+"&userID="+valentine.receiver.id,
                type: valentine.type,
            }
            console.log(obj.href);
            links.push(obj);
            links = links;
        }

    }
    if (browser) {
        get_data();
    }

</script>
{#await countDef}
    <p>...waiting</p>
{:then number}
    <html lang="ru">
    <div id="block">
        <div style="display: flex; justify-content: center; padding: 1vh">
            <lottie-player
                    autoplay
                    loop
                    mode="normal"
                    src="20_HEART_MENDING_OUT.json"
                    style="width: 10vh"
            ></lottie-player>
        </div>
        <div class = "simpletext" style="display: flex; justify-content: center; flex-direction: column; align-items: center; padding: 1vh">
            <h3 style="max-width: 75vw">Отправьте валентинку другу или любимому человеку.</h3>
            <h3 style="max-width: 90vw">Проверьте, взаимны ли ваши чувства?</h3>
        </div>
        <div class="simpleflex">
            {#if itsTime}
                <button class='shine-box' style = "width: 90vw; background-color: #A12AAB;" onclick="location.href='/my_valentines'">
                    {#if count === 0}
                        Посмотреть ❤️‍🩹 для меня
                    {:else}
                        Посмотреть {count} ❤️‍🩹
                    {/if}
                </button>
            {:else}
                <button style = "width: 90vw; opacity: 0.5; cursor: not-allowed; pointer-events: none;" onclick="location.href='/get_my_valentines'" disabled>
                    {#if count === 0}
                        Посмотреть ❤️‍🩹 для меня
                    {:else}
                        Посмотреть {count} ❤️‍🩹
                    {/if}
                </button>
                <p class="description" style="padding-bottom: 2vh">🔒 Будет доступно с 14 февраля в 12:00 по UTC+3</p>
            {/if}
            {#if itsTime}
                <button style = "width: 90vw; margin-bottom: 1vh; opacity: 0.5; cursor: not-allowed; pointer-events: none;" on:click={ping}>
                    Отправить валентинку
                </button>
            {:else}
                <button style = "width: 90vw; margin-bottom: 1vh" on:click={ping} >
                    Отправить валентинку
                </button>
            {/if}

        </div>
        <div style="display: flex; flex-direction: row; justify-content: space-between; padding-top: 0.5vh; padding-left: 4vw; padding-right: 4vw">
            <p class = "naming">Валентинки от меня:</p>
            <Countdown from="2024-02-14 12:00:00" dateFormat="YYYY-MM-DD H:m:s" zone="Europe/Moscow" let:remaining>
                <div class="whatever">
                    {#if remaining.done === false}
                        {#if remaining.years === 0 && remaining.months === 0&& remaining.weeks === 0 && remaining.days === 0}
                            <p class = "naming" style="color: #A12AAB">До отправки: {s(remaining.hours)}:{s(remaining.minutes)}:{s(remaining.seconds)}</p>
                        {:else }
                            <p class = "naming" style="color: #A12AAB">Отправятся 14.02</p>
                        {/if}
                    {:else}
                        <p class = "naming" style="color: #A12AAB">Время пришло!</p>
                    {/if}
                </div>
            </Countdown>
        </div>
        <div class="list-group" style="width: 100vw; display: flex; flex-direction: column; justify-content: center; align-items: center">
            {#if links.length === 0}
                <p class = "simpletext" style="font-size: 6vw; text-align: center; margin-top:16vh; width: 90vw">😱 Ого, ты еще ничего никому не отправил, время это исправить</p>
            {/if}
            {#if links.length > 0}
                <Listgroup active items={links} let:item class="w-48" style="width: 90vw">
                    <div style="display: flex; flex-direction: column; gap: 1vh">
                        <p class="simpletext" style="text-align: left; font-size: 15px; line-height: 1.2">{item.text}</p>
                        <div style="display: flex; flex-direction: row; justify-content: space-between">
                            <p class="description">{item.name}</p>
                            <p class="description">{matchType(item.type)}</p>
                        </div>
                    </div>
                </Listgroup>
            {/if}
        </div>
    </div>
    </html>
{/await}





<style>
    @import "styles.css";
</style>