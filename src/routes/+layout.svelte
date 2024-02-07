<svelte:head>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
</svelte:head>


<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

<script>
    import "../app.pcss";
    import {browser} from "$app/environment";
    if (browser) {
        let backendUrl = "https://b9af-37-47-129-91.ngrok-free.app"
        window.Telegram.WebApp.expand();
        fetch(backendUrl+"/check", {
            method: "get",
            headers: new Headers({
                "X-Tg-Token": window.Telegram.WebApp.initData,
                "ngrok-skip-browser-warning": "69420",
            }),
            Origin: window.location.origin,
        })
    }
</script>
<div id="header">
    <h1><a href="./">Валентинка Ботик</a></h1>
</div>
<slot></slot>