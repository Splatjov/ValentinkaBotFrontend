<script>
    import { page } from '$app/stores';
    import { browser } from "$app/environment";
    import {Helper, Radio, Textarea} from "flowbite-svelte";
    import {redirect} from "../../lib/functions.js";


    let backendUrl = "https://api_valentinka.splatjov.space"
    if (browser) {
        window.Telegram.WebApp.setBackgroundColor("#EFEEF4");
        window.Telegram.WebApp.setHeaderColor("#EFEEF4");
        if (window.location.pathname !== '/') {
            window.Telegram.WebApp.BackButton.isVisible = true;
            window.Telegram.WebApp.onEvent('backButtonClicked', redirect)
        } else {
            window.Telegram.WebApp.BackButton.isVisible = false;
        }}


    const url = $page.url;
    let userid = url.searchParams.get('userID');
    let ID = url.searchParams.get('ID');
    let avatarlink = "avatar.png";
    let name = "Никто не выбран";
    let username = "не выбран";
    let id;
    let radioValue;
    let text;
    let time;
    let response;
    let itsTime = false;
    // eslint-disable-next-line no-unused-vars
    let valentines = [];
    let valentinesMine;

    // eslint-disable-next-line no-unused-vars
    let user, userMine;
    // eslint-disable-next-line no-unused-vars
    let count=0, countDef, countBM;
    let countMine=0, countDefMine, countBMMine;
    let mainValentine;
    let coValentine;
    let flag = false;
    function match(valentine)
    {

        if (valentine.receiver.id === 0) return undefined;
        for (let valentineMine of valentinesMine)
        {
            if (valentineMine.receiver.id === valentine.receiver.id && valentineMine.receiver.username === valentine.receiver.username && valentine.receiver.id.toString() === userid)
            {
                if (valentine.type === 'default' && valentineMine.type == 'be mine')
                {
                    flag = true;
                }
                return valentineMine;
            }
        }
    }
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
                time = resp.headers.get('Time');
                return resp.json()
            }
            else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }).then(data => {
            valentinesMine = data.valentines;
            userMine = data.user;
            countMine = data.countReceived;
            countDefMine = data.countSentDefault;
            countBMMine = data.countSentBeMine;
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
                itsTime = true;
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
            for (let valentine of valentines)
            {
                if (valentine.id.toString() === ID)
                {
                    text=valentine.text;
                    mainValentine = valentine;
                    coValentine = match(mainValentine);
                    radioValue=valentine.type;
                    text = valentine.text;
                }
            }
            console.log(valentines);
        })
    }

    async function displayProtectedImage() {
        // Fetch the image.
        name = 'loading'
        await fetch(backendUrl + "/get_user_info", {
            method: "get",
            headers: new Headers({
                "X-Tg-Token": window.Telegram.WebApp.initData,
                "ngrok-skip-browser-warning": "69420",
                "UserID": userid
            }),
            Origin: window.location.origin,
        }).then(response => {
            if (!response.ok) {
                id = userid;
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            time = response.headers.get('Time');
            return response.json();
        }).then(data => {
            name = data.name;
            username = data.username;
            id = data.id;
        });
        const responsePhoto = await fetch(backendUrl + "/get_user_photo", {
            method: "get",
            headers: new Headers({
                "X-Tg-Token": window.Telegram.WebApp.initData,
                "ngrok-skip-browser-warning": "69420",
                "UserID": userid
            }),
            Origin: window.location.origin,
        });
        if (responsePhoto.ok) {
            time = responsePhoto.headers.get('Time');
            const blob = await responsePhoto.blob();
            const objectUrl = URL.createObjectURL(blob);
            avatarlink = objectUrl;
        }
    }

    if (browser && userid != null) {
        displayProtectedImage();
    }

    async function handleOnSubmit() {
        let popupParams = {
            "title": "Ошибка!",
            "message": "",
            "buttons": [
                {
                    "type": "close"
                }
            ]
        }
        if (radioValue === '')
        {
            popupParams.message='Не выбран тип валентинки';
            window.Telegram.WebApp.showPopup(popupParams, redirect);
            return;
        }
        const response = await fetch(backendUrl + "/delete_valentine", {
            method: 'POST',
            headers: {
                "X-Tg-Token": window.Telegram.WebApp.initData,
                "ngrok-skip-browser-warning": "69420",
                "valID": ID,
            },
            body: text,
            Origin: window.location.origin,
        });

        if (response.status !== 200)
        {
            popupParams.message='Произошла ошибка во время удаления:(';
        }
        else
        {
            popupParams.message='Успешно удалено';
            popupParams.title='Успех!';
        }
        window.Telegram.WebApp.showPopup(popupParams, redirect);
    }
    const maxChars = 1000; // Change this to set your desired character limit

    function handleInput(event) {
        if (event.target.value.length > maxChars) {
            text = event.target.value.slice(0, maxChars);
        }
    }

    export function redirectV()
    {
        window.location.href = "/my_valentines";
    }
    if (browser) {
        window.Telegram.WebApp.onEvent('backButtonClicked', redirectV)
        get_data();
    }

</script>
<div style="display: flex; flex-direction: row; justify-content: space-between; padding-left: 5vw; padding-right: 5vw; padding-top: 2vh">
    <img id='avatar' src={avatarlink} alt="meow" />
    <div style="display: flex; flex-direction: column; justify-content: center; width: 60vw; text-align: right; align-items: flex-end; flex-wrap: wrap;">
        <p class = simpletext style="text-align: right;">От кого:</p>
        {#if username==="не выбран"}
            {#if id === '0' ||id === undefined}
                <p class="simpletext" style="text-align: right; font-size: 7vw; padding-top: 2vh; max-width: 60vw;  word-wrap: break-word;">Аноним</p>
                <p class="simpletext"
                   style="text-align: right; font-size: 10px; padding-top: 2vh;  max-width: 60vw;  word-wrap: break-word;">
                    🤐️ Видимо это останется тайной</p>
            {:else}
                <p class="simpletext" style="text-align: right; font-size: 7vw; padding-top: 2vh; max-width: 60vw;  word-wrap: break-word;">ID: {id}</p>
            {/if}
        {:else}
            <p class="simpletext" style="text-align: right; font-size: 7vw; padding-top: 1vh; max-width: 60vw;  word-wrap: break-word;">{name}</p>

            <p class="simpletext" style="text-align: right; font-size: 10px; padding-top: 1vh;  max-width: 60vw;  word-wrap: break-word;">username: {username}</p>
            <p class="simpletext" style="text-align: right; font-size: 10px; padding-top: 1vh;  max-width: 60vw;  word-wrap: break-word;">ID: {id}</p>
        {/if}
    </div>
</div>
<div style="display: flex; flex-direction: column; justify-content: left; max-width: 90vw; margin: 5vw; margin-top: 4vw">
    <Radio name = "typeChoose" aria-describedby="helper-checkbox-text" value="be mine" bind:group={radioValue} style="" disabled><p class="simpletext">Be mine</p></Radio>
    <Helper id="helper-checkbox-text" class="ps-6" style = "color: #737171; margin-bottom: 4vh">Анонимная валентинка, текст будет виден всегда, отправитель - только если получатель тоже отправит тебе “Be mine” валентинку. Идеально для признаний.</Helper>

    <Radio name = "typeChoose" aria-describedby="helper-checkbox-text" value="default" bind:group={radioValue} style="" disabled><p class="simpletext">Обычная</p></Radio>
    <Helper id="helper-checkbox-text" class="ps-6" style = "color: #737171; margin-bottom: 6vh">Обычная валентинка, неанонимная и их много.</Helper>

    <Textarea id="textarea-id" on:input={handleInput} placeholder="Your message" rows="4" name="message" style = "width: 90vw; resize: none;" disabled bind:value={text}/>
</div>
<div class = "simpleflex">
    {#if coValentine !== undefined}
        <p class="description" style="padding-bottom: 3vh; font-size: 15px;">
            {#if flag}
                ❓ А это точно взаимно? ❓
            {:else }
                💜 Это взаимно! 💜
            {/if}
        </p>
        <button onclick='location.href="/valentine?userID="+{userid}+"&ID="+{coValentine.id}' class='shine-box' style = "width: 90vw; background-color: #A12AAB;">
            А я что отправил?
        </button>
    {/if}

</div>


<style>
    @import "../styles.css";
</style>