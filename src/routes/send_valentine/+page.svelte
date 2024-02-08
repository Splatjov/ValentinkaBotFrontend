<script>
    import Radio from "../../lib/Radio.svelte";
    import { page } from '$app/stores';
    import { browser } from "$app/environment";
    import Content from '../../lib/Content.svelte';
    import Modal from 'svelte-simple-modal';
    import { modalMessage, surpriseMessage } from '../../lib/stores.js';

    let backendUrl = "https://8b7d-37-47-138-143.ngrok-free.app"

    export async function ping() {
        await surpriseMessage.set('отправка...');
        if (name !== "Никто не выбран" && name !== "loading") {
            handleOnSubmit();
            return;
        }
        await surpriseMessage.set('проверь сообщения в боте!');
        await fetch(backendUrl + "/ping", {
            method: "get",
            headers: new Headers({
                "X-Tg-Token": window.Telegram.WebApp.initData,
                "ngrok-skip-browser-warning": "69420",
            }),
            Origin: window.location.origin,
        });
        window.Telegram.WebApp.openTelegramLink("https://t.me/valentinka_kalbot")
        window.Telegram.WebApp.close();
    }

    const url = $page.url;
    let userid = url.searchParams.get('userID');
    let avatarlink = "https://i.pinimg.com/736x/50/7e/60/507e6098bc58ff5e9aa4097994996c60.jpg";
    let name = "Никто не выбран";
    let username = "не выбран";
    let id = "не выбран";

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
            modalMessage.set('Отправить валентинку');
            if (!response.ok) {
                name = "Пользователь еще не запускал бота";
                username = "я ещё не знаю:(";
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
    let radioValue;
    let text = "";
    modalMessage.set("Выбрать человека");
    const options = [{
        value: 'be mine',
        label: 'Be mine',
    }, {
        value: 'default',
        label: 'Обычная',
    }]

    async function handleOnSubmit() {
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
        radioValue = 'be mine';
        if (response.status === 500)
        {
            await surpriseMessage.set('произошла ошибка во время отправки:(');
        }
        else if (response.status === 406)
        {
            await surpriseMessage.set('произошла ошибка: мы не можем найти тебя в базе данных, отправь сообщение боту в личных сообщениях');
        }
        else if (response.status === 409)
        {
            await surpriseMessage.set('произошла ошибка: текст слишком длинный');
        }
        else if (response.status === 208)
        {
            await surpriseMessage.set('ты уже отправлял этому пользователю валентинку!');
        }
        else if (response.status === 400)
        {
            await surpriseMessage.set('ты отправил слишком много валентинок этого вида!');
        }
        else if (response.status !== 200)
        {
            await surpriseMessage.set('произошла ошибка:(');
        }
        else
        {
            await surpriseMessage.set('отправлено!');
        }

    }

</script>



<div id="minitext">
    <h3>Чтобы отправить валентинку, тебе нужно выбрать его из своих контактов</h3>
</div>
<div id="imgblock">
    <img id='avatar' src={avatarlink} alt="meow" />
</div>
<div id="miniheader">
    <h3 class="cutetext">{name}</h3>
    <p class="cutetext smaller">username: {username}</p>
    <p class="cutetext smaller">id: {id}</p>
    <p class="cutetext smaller">(проверь эти данные!)</p>
    {#if name !== "Никто не выбран" && name !== "loading"}
        <textarea id="inputstyle" placeholder="Текст валентинки" name="message" bind:value={text}/>
        <Radio {options} legend='Выбери тип валентинки' bind:userSelected={radioValue}/>
    {/if}
</div>
<div id="glupi">
    <button onclick="location.href='/my_valentines'">
        Мои Валентинки
    </button>
    <Modal>
        <Content func={ping}/>
    </Modal>
</div>




<style>
    @import "../styles.css";
</style>