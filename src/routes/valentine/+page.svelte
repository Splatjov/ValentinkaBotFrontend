<script>
    import {page} from '$app/stores';
    import {browser} from "$app/environment";
    import {Helper, Label, Radio, Textarea} from "flowbite-svelte";
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
        }
    }


    const url = $page.url;
    let userid = url.searchParams.get('userID');
    let ID = url.searchParams.get('ID');
    console.log(userid, ID);
    let avatarlink = "avatar.png";
    let name = "Никто не выбран";
    let username = "не выбран";
    let id;
    let radioValue;
    let text;
    let time;
    let response;
    // eslint-disable-next-line no-unused-vars
    let valentines = [];
    let valentinesMine = [];
    let itsTime = false;
    let flag = false;
    let mainValentine, coValentine;
    // eslint-disable-next-line no-unused-vars
    let user;
    // eslint-disable-next-line no-unused-vars
    let count = 0, countDef, countBM;

    function match(valentine) {
        if (valentine.receiver.id === 0) return undefined;
        for (let valentineMine of valentinesMine) {
            if (valentineMine.receiver.id === valentine.receiver.id && valentineMine.receiver.username === valentine.receiver.username && valentine.receiver.id.toString() === userid) {
                if (valentine.type === 'be mine' && valentineMine.type == 'default') {
                    flag = true;
                }
                return valentineMine;
            }
        }
    }

    async function get_data() {
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
        }).then(data => {
            if (data) {
                valentinesMine = data.valentines;
            }
        });
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
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }).then(data => {
            valentines = data.valentines;
            user = data.user;
            count = data.countReceived;
            countDef = data.countSentDefault;
            countBM = data.countSentBeMine;
            for (let valentine of valentines) {
                if (valentine.id.toString() === ID && userid === valentine.receiver.id.toString()) {
                    text = valentine.text;
                    radioValue = valentine.type;
                    mainValentine = valentine;
                    coValentine = match(mainValentine);
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
        }).catch(error => {
            console.error(error);
        });
        if (responsePhoto && responsePhoto.ok) {
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
        if (radioValue === '') {
            popupParams.message = 'Не выбран тип валентинки';
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

        if (response.status !== 200) {
            popupParams.message = 'Произошла ошибка во время удаления:(';
        } else {
            popupParams.message = 'Успешно удалено';
            popupParams.title = 'Успех!';
        }
        window.Telegram.WebApp.showPopup(popupParams, redirect);
    }

    const maxChars = 1000; // Change this to set your desired character limit

    function handleInput(event) {
        if (event.target.value.length > maxChars) {
            text = event.target.value.slice(0, maxChars);
        }
    }

    function description() {
        let popupParams = {
            "message": "Пользователя нет в базе данных, поэтому бот не может узнать его имя и username, но это не мешает сохранить твою валентинку, так что он/а точно также сможет увидеть валентинку когда она станет доступна.",
            "buttons": [
                {
                    "type": "close"
                }
            ]
        }
        window.Telegram.WebApp.showPopup(popupParams, console.log);
    }

    if (browser) {
        get_data();
    }

</script>
{#await id}
    <p>...waiting</p>
{:then number}
    <div style="display: flex; flex-direction: row; justify-content: space-between; padding-left: 5vw; padding-right: 5vw; padding-top: 2vh">
        <img id='avatar' src={avatarlink} alt="meow"/>
        <div style="display: flex; flex-direction: column; justify-content: center; width: 60vw; text-align: right; align-items: flex-end; flex-wrap: wrap;">
            <p class=simpletext style="text-align: right;">Кому:</p>
            {#if username === "не выбран"}
                <p class="simpletext"
                   style="text-align: right; font-size: 7vw; padding-top: 2vh; max-width: 60vw;  word-wrap: break-word;">
                    ID: {id}</p>

                <p class="simpletext" on:click={description}
                   style="text-align: right; font-size: 10px; padding-top: 2vh;  max-width: 60vw;  word-wrap: break-word;">
                    ℹ️ Пользователь еще не открывал бота</p>
            {:else}
                <p class="simpletext"
                   style="text-align: right; font-size: 7vw; padding-top: 1vh; max-width: 60vw;  word-wrap: break-word;">{name}</p>

                <p class="simpletext"
                   style="text-align: right; font-size: 10px; padding-top: 1vh;  max-width: 60vw;  word-wrap: break-word;">
                    username: {username}</p>
                <p class="simpletext"
                   style="text-align: right; font-size: 10px; padding-top: 1vh;  max-width: 60vw;  word-wrap: break-word;">
                    ID: {id}</p>
            {/if}
        </div>
    </div>
    {#if coValentine}
        <div style="display: flex; flex-direction: column; justify-content: left; max-width: 90vw; margin: 5vw; margin-top: 4vw">
            <Radio name="typeChoose" aria-describedby="helper-checkbox-text" value="be mine" bind:group={radioValue}
                   style="" disabled><p class="simpletext" style="padding-bottom: 0">Be mine</p></Radio>
            <Helper id="helper-checkbox-text" class="ps-6" style="color: #737171; margin-bottom: 4vh; padding-top: 0">
                Анонимная валентинка, текст будет виден всегда, отправитель - только если получатель тоже отправит тебе
                “Be mine” валентинку. Идеально для признаний.
            </Helper>

            <Radio name="typeChoose" aria-describedby="helper-checkbox-text" value="default" bind:group={radioValue}
                   style="" disabled><p class="simpletext">Обычная</p></Radio>
            <Helper id="helper-checkbox-text" class="ps-6" style="color: #737171; margin-bottom: 6vh">Обычная
                валентинка, неанонимная и их много.
            </Helper>

            <Textarea id="textarea-id" on:input={handleInput} placeholder="Your message" rows="4" name="message"
                      style="width: 90vw; resize: none;" disabled bind:value={text}/>
        </div>
        <div class="simpleflex">
            <p class="description" style="padding-bottom: 3vh; font-size: 15px;">
                {#if flag}
                    ❓ А это точно взаимно? ❓
                {:else }
                    💜 Это взаимно! 💜
                {/if}
            </p>
            <button onclick='location.href="/my_valentine?userID="+{userid}+"&ID="+{coValentine.id}' class='shine-box'
                    style="width: 90vw; background-color: #A12AAB;">
                А что мне отправили?
            </button>
        </div>
    {:else}
        <div style="display: flex; flex-direction: column; justify-content: left; max-width: 90vw; margin: 5vw; margin-top: 4vw">
            <Radio name="typeChoose" aria-describedby="helper-checkbox-text" value="be mine" bind:group={radioValue}
                   style="" disabled>Be mine (Осталось {5 - countBM})
            </Radio>
            <Helper id="helper-checkbox-text" class="ps-6" style="color: #737171; margin-bottom: 2vh">Анонимная
                валентинка,
                текст будет виден всегда, отправитель - только если получатель тоже отправит тебе “Be mine” валентинку.
                Идеально для признаний.
            </Helper>

            <Radio name="typeChoose" aria-describedby="helper-checkbox-text" value="default" bind:group={radioValue}
                   style="" disabled>Обычная (Осталось {20 - countDef})
            </Radio>
            <Helper id="helper-checkbox-text" class="ps-6" style="color: #737171; margin-bottom: 4vh">Обычная
                валентинка,
                неанонимная и их много.
            </Helper>

            <Textarea id="textarea-id" on:input={handleInput} placeholder="Your message" rows="4" name="message"
                      style="width: 90vw; resize: none;" disabled bind:value={text}/>
            <Label for="textarea-id" class="mb-2" style="color: #737171; font-size: 3vw">Лимит: 1000 символов</Label>
        </div>
            <div class="simpleflex">
                <p class="description" style="padding-bottom: 1vh; font-size: 10px">💡 Удалил валентинку? Не забудь
                    отправить
                    новую!</p>
                <button on:click={handleOnSubmit} style="width: 90vw; background-color: #FF6262">
                    Удалить валентинку
                </button>
            </div>
    {/if}

{/await}


<style>
    @import "../styles.css";
</style>