<script>
    import { page } from '$app/stores';
    import { browser } from "$app/environment";
    import {Helper, Label, Radio, Textarea} from "flowbite-svelte";
    import {redirect} from "../../lib/functions.js";


    let backendUrl = "https://8b7d-37-47-138-143.ngrok-free.app"



    const url = $page.url;
    let userid = url.searchParams.get('userID');
    let avatarlink = "https://i.pinimg.com/736x/50/7e/60/507e6098bc58ff5e9aa4097994996c60.jpg";
    let name = "Никто не выбран";
    let username = "не выбран";
    let id = "не выбран";
    let response;
    // eslint-disable-next-line no-unused-vars
    let valentines = [];
    // eslint-disable-next-line no-unused-vars
    let user;
    // eslint-disable-next-line no-unused-vars
    let count=0, countDef, countBM;
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
                redirect();
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
            console.log(valentines);
        })
    }

    async function displayProtectedImage() {
        // Fetch the image.
        name = 'loading'
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
            const blob = await responsePhoto.blob();
            const objectUrl = URL.createObjectURL(blob);
            avatarlink = objectUrl;
        }
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
            return response.json();
        }).then(data => {
            name = data.name;
            username = data.username;
            id = data.id;
        });
    }

    if (browser && userid != null) {
        displayProtectedImage();
    }
    if (browser)
    {
        console.log(window.Telegram.WebApp.showPopup);
    }
    let radioValue="";
    let text = "";
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
            window.Telegram.WebApp.showPopup(popupParams, console.log);
            return;
        }
        const response = await fetch(backendUrl + "/send_valentine", {
            method: 'POST',
            headers: {
                "X-Tg-Token": window.Telegram.WebApp.initData,
                "ngrok-skip-browser-warning": "69420",
                "receiverID": id,
                "valentineType": radioValue,
            },
            body: text,
            Origin: window.location.origin,
        });
        text = "";
        radioValue = '';

        if (response.status === 500)
        {
            popupParams.message='Произошла ошибка во время отправки:(';
        }
        else if (response.status === 406)
        {
            popupParams.message='Произошла ошибка: мы не можем найти тебя в базе данных, отправь сообщение боту в личных сообщениях';
        }
        else if (response.status === 409)
        {
            popupParams.message='Произошла ошибка: текст слишком длинный';
        }
        else if (response.status === 208)
        {
            popupParams.message='Ты уже отправлял этому пользователю валентинку!';
        }
        else if (response.status === 400)
        {
            popupParams.message='Ты отправил слишком много валентинок этого вида!';
        }
        else if (response.status !== 200)
        {
            popupParams.message='Произошла ошибка:(';
        }
        else
        {
            popupParams.message='Успешно отправлено';
            popupParams.title='Успех!';
        }
        window.Telegram.WebApp.showPopup(popupParams, console.log);
    }
    const maxChars = 1000; // Change this to set your desired character limit

    function handleInput(event) {
        if (event.target.value.length > maxChars) {
            text = event.target.value.slice(0, maxChars);
        }
    }
    function description()
    {
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

<div style="display: flex; flex-direction: row; justify-content: space-between; padding-left: 5vw; padding-right: 5vw; padding-top: 2vh">
    <img id='avatar' src={avatarlink} alt="meow" />
    <div style="display: flex; flex-direction: column; justify-content: center; width: 60vw; text-align: right; align-items: flex-end; flex-wrap: wrap;">
        <p class = simpletext style="text-align: right;">Кому:</p>
        {#if username=="не выбран"}
            <p class="simpletext" style="text-align: right; font-size: 7vw; padding-top: 2vh; max-width: 60vw;  word-wrap: break-word;">ID: {id}</p>

            <p class="simpletext" on:click={description} style="text-align: right; font-size: 10px; padding-top: 2vh;  max-width: 60vw;  word-wrap: break-word;">ℹ️ Пользователь еще не открывал бота</p>
        {:else}
            <p class="simpletext" style="text-align: right; font-size: 7vw; padding-top: 1vh; max-width: 60vw;  word-wrap: break-word;">{name}</p>

            <p class="simpletext" style="text-align: right; font-size: 10px; padding-top: 1vh;  max-width: 60vw;  word-wrap: break-word;">username: {username}</p>
            <p class="simpletext" style="text-align: right; font-size: 10px; padding-top: 1vh;  max-width: 60vw;  word-wrap: break-word;">ID: {id}</p>
        {/if}
    </div>
</div>
<div style="display: flex; flex-direction: column; justify-content: left; max-width: 90vw; margin: 5vw; margin-top: 4vw">
    <Radio name = "typeChoose" aria-describedby="helper-checkbox-text" value="be mine" bind:group={radioValue}>Be mine (Осталось {5-countBM})</Radio>
    <Helper id="helper-checkbox-text" class="ps-6" style = "color: #737171; margin-bottom: 2vh">Анонимная валентинка, текст будет виден всегда, отправитель - только если получатель тоже отправит тебе “Be mine” валентинку. Идеально для признаний.</Helper>

    <Radio name = "typeChoose" aria-describedby="helper-checkbox-text" value="default" bind:group={radioValue}>Обычная (Осталось {20-countDef})</Radio>
    <Helper id="helper-checkbox-text" class="ps-6" style = "color: #737171; margin-bottom: 4vh">Обычная валентинка, неанонимная и их много.</Helper>

    <Textarea id="textarea-id" on:input={handleInput} placeholder="Your message" rows="4" name="message" style = "width: 90vw; resize: none" bind:value={text}/>
    <Label for="textarea-id" class="mb-2" style="color: #737171; font-size: 3vw">Лимит: 1000 символов</Label>
</div>
<div class = "simpleflex">
    <p class="description" style="padding-bottom: 1vh; font-size: 10px">💡 Не шлют валентинки? Отправь ссылку на бота в истории или чате!</p>
    <button on:click={handleOnSubmit} style="width: 90vw">
        Отправить валентинку
    </button>
</div>


<style>
    @import "../styles.css";
</style>