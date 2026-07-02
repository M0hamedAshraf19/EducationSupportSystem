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
    location.reload()
})

const fileNames = ["F-Airplane.jpeg", "F-Ball.png", "F-Butterfly.jpg", "F-Car.png", "F-Cat.jpg", "F-Clock.jpeg", "F-Duck.jpg", "F-Eagles.png", "F-Eyes.jpg", "F-Flower.jpg", "F-Giraffe.jpg", "F-Girl.png", "F-Keys.jpg", "F-Onion.jpg", "F-Parrots.jpg", "F-Pencils.jpg", "F-Sun.jpg", "F-Teeth.png", "F-Tree.jpg", "M-Alarm Clock.jpg", "M-Bird.jpg", "M-Book.jpg", "M-Box.jpg", "M-Boy.png", "M-Computer.jpg", "M-Desk.jpg", "M-Dog.jpg", "M-Eagle.png", "M-Elephant.jpg", "M-Horse.jpg", "M-Key.jpg", "M-Lion.jpg", "M-Monkey.jpg", "M-Moon.jpg", "M-Pencil.jpg", "M-Sheep.jpg", "M-Whale.jpg"]

if (getCookie('questions') === null || getCookie('correct') === null) {
    deleteCookies()
    setCookie('questions', '0')
    setCookie('correct', '0')
} else {}



document.querySelectorAll("input[type='submit']").forEach(function(button) {
    button.disabled = false
})