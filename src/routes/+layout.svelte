<svelte:head>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
</svelte:head>

<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

<script>
    import {browser} from "$app/environment";
    let b = "";
    if (browser) {
        window.Telegram.WebApp.expand();
        b = window.Telegram.WebApp.initData;
        console.log(window.Telegram.WebApp.initData);
    }

</script>
<h1>{b}</h1>
<div id="header">
    <h1><a href="./">Валентинка Ботик</a></h1>
</div>
<slot />