<svelte:head>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>

    <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
</svelte:head>


<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

<script>

    import "../app.pcss";
    import "../app.pcss";

    import {browser} from "$app/environment";
    import {redirect} from "../lib/functions.js";


    if (browser) {
        window.Telegram.WebApp.setBackgroundColor("#EFEEF4");
        window.Telegram.WebApp.setHeaderColor("#EFEEF4");
        if (window.location.pathname !== '/') {
            window.Telegram.WebApp.BackButton.isVisible = true;
            window.Telegram.WebApp.onEvent('backButtonClicked', redirect)
        } else {
            window.Telegram.WebApp.BackButton.isVisible = false;
        }
        let backendUrl = "https://api_valentinka.splatjov.space"
        window.Telegram.WebApp.expand();
        fetch(backendUrl + "/check", {
            method: "get",
            headers: new Headers({
                "X-Tg-Token": window.Telegram.WebApp.initData,
                "ngrok-skip-browser-warning": "69420",
            }),
            Origin: window.location.origin,
        })
    }
</script>

<html lang="ru">
<slot></slot>
</html>


<style>

    @import "styles.css";
</style>