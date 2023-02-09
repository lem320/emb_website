
document.querySelector("#loginBut").addEventListener("click", (e) => {
    fetch('/login',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({token: getCookie("token")})
    })
    .then((res) => {
        return res.json()
    })
    .then((json) => {
        console.log(json)
        if (json.message == "Authorized") {
            window.location.href = "/dashboard"
        } else {
            document.querySelector("#login").style.display = "grid"
            document.querySelector("#home").style.display = "none"
            document.querySelector("#about").style.display = "none"
        }
    })
})


document.querySelector("#homeBut").addEventListener("click", (e) => {
    document.querySelector("#login").style.display = "none"
    document.querySelector("#home").style.display = "grid"
    document.querySelector("#about").style.display = "none"
})


document.querySelector("#aboutBut").addEventListener("click", (e) => {
    document.querySelector("#login").style.display = "none"
    document.querySelector("#home").style.display = "none"
    document.querySelector("#about").style.display = "grid"
})

document.querySelector("#loginForm").addEventListener("submit", (e) => {
    e.preventDefault()

    const details = {
        username: e.target[0].value,
        password: e.target[1].value
    }

    console.log(details)

    fetch('/login',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(details)
    })
    .then((res) => {
        return res.json()
    })
    .then((json) => {
        console.log(json)
        if (json.message == "Authorized") {
            document.querySelector("#lError").innerHTML = ""
            setCookie("token",json.token,1)
            setCookie("username",details.username,1)
            window.location.href = "/dashboard"
        } else {
            document.querySelector("#lError").innerHTML = json.message
        }
    })

})







function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}