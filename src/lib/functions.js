import {surpriseMessage} from "./stores.js";

let backendUrl = "https://8b7d-37-47-138-143.ngrok-free.app"


export function redirect()
{
    console.log(this);
    var currentPath = window.location.pathname;

    // Remove the last segment (one level higher)
    var newPath = currentPath.substring(0, currentPath.lastIndexOf('/')+1);
    console.log(currentPath);
    // Redirect to the new path
    window.location.href = newPath;
}

export async function ping() {
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