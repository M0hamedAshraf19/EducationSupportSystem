function getCookie(name) {
    const cookie = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return cookie ? cookie[2] : null;
}

function setCookie(name, value, expires = null) {
    if (expires) {
        document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=${window.location.pathname}`
    } else {
        document.cookie = `${name}=${value}; path=${window.location.pathname}`
    }
}

function browseCookies() {
    document.cookie.split('; ').forEach(function(cookie) {
        console.log(cookie)
    });
}

function deleteCookies() {
    if (!document.cookie) return
    document.cookie.split('; ').forEach(function(cookie) {
        setCookie(cookie.split('=')[0], '', new Date(0))
    });
}

document.querySelector('#reset').addEventListener('click', function() {
    deleteCookies()
    document.querySelectorAll("form").forEach(function(form) {
        form.reset()
    })
    location.href = '..\\index.html'
})

const request = new XMLHttpRequest();
request.open('GET', '../../images.json', false);
request.send(null);

fileNames = [];
if (request.status === 200) {
    fileNames = JSON.parse(request.responseText).heShe;
} else {
    console.error('Error loading JSON:', request.status);
}

if (getCookie('questions') === null || getCookie('correct') === null) {
    deleteCookies()
    setCookie('questions', '0')
    setCookie('correct', '0')
} else {}



document.querySelectorAll("input[type='submit']").forEach(function(button) {
    button.disabled = false
})