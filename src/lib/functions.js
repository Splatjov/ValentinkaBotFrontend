let backendUrl = "https://valentinka.splatjov.space"


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

export function isFirst(index) {
    return index === 0;
}

// Function to check if the current item is the last element
export function isLast(index, valentines) {
    return index === valentines.length - 1;
}

export function generateStyle(index, valentines)
{
    let listStyle = "";
    if (isFirst(index))
    {
        listStyle+= 'border-top-left-radius: 12px; border-top-right-radius: 12px;';
    }
    if (isLast(index,valentines))
    {
        listStyle+='border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;';
    }
    return listStyle;
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