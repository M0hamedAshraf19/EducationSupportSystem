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
} else if (getCookie('answer') !== null) {
    if (JSON.parse(getCookie('answer')).length === 1) {
        let answer = JSON.parse(getCookie('answer'))[0]
        let name = getCookie('question')
        if (!((name[0] === 'M' && answer === 'مذكر') || (name[0] === 'F' && answer === 'مونث'))) {
            setCookie('questions', parseInt(getCookie('questions'))+1)
            setCookie('question', '', new Date(0))
            setCookie('answer', '', new Date(0))
        }
    } else {
        let answer = JSON.parse(getCookie('answer'))[1]
        let name = getCookie('question')
        setCookie('questions', parseInt(getCookie('questions'))+1)
        setCookie('question', '', new Date(0))
        setCookie('answer', '', new Date(0))
        if ((name[0] === 'M' && answer === 'هذا') || (name[0] === 'F' && answer === 'هذه')) {
            setCookie('correct', parseInt(getCookie('correct'))+1)
        }
    }
}

if (getCookie('usedNames') === null) {
    setCookie('usedNames', JSON.stringify([]))
} else {
    if (JSON.parse(getCookie('usedNames')).length === fileNames.length) {
        setCookie('lastUsedName', JSON.parse(getCookie('usedNames'))[fileNames.length-1])
        setCookie('usedNames', JSON.stringify([]))
    }
}

document.querySelector('#score').innerHTML = `
    Questions: ${getCookie('questions')}<br>Correct: ${getCookie('correct')}
`
document.querySelector('#score').style.display = 'block'

let el = ''

if (getCookie('answer') === null) {
    el = document.querySelector("#questionForm")
    el.style.display = 'block'
    let name = ''
    if (getCookie('question') === null) {
        name = fileNames[Math.floor(Math.random() * fileNames.length)]
        let usedNames = JSON.parse(getCookie('usedNames'))
        if (getCookie('lastUsedName') === null){
            while (usedNames.includes(name)) {
                name = fileNames[Math.floor(Math.random() * fileNames.length)]
            }
        } else {
            while (getCookie('lastUsedName') === name) {
                name = fileNames[Math.floor(Math.random() * fileNames.length)]
            }
            setCookie('lastUsedNmae', '', new Date(0))
        }
        setCookie('question', `${name}`)
        usedNames.push(name)
        setCookie('usedNames', JSON.stringify(usedNames))
    }
    else {
        name = getCookie('question')
    }
    if (Math.floor(Math.random() * 2) === 0) {
        el.innerHTML = `
        <form method='post'>
            <input type='submit' disabled value='مذكر'/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input type='submit' disabled value='مونث'/><br>
        </form><br>
        <img src='../images/${name}' style='width: 50%; height: 50%;'>
        `
    } else {
        el.innerHTML = `
        <form method='post'>
            <input type='submit' disabled value='مونث'/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input type='submit' disabled value='مذكر'/><br>
        </form><br>
        <img src='../images/${name}' style='width: 50%; height: 50%;'>
        `
    }
    el.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault()
        let answer = document.querySelector("input[type='submit']:focus").value
        setCookie('answer', JSON.stringify([answer]))
        location.reload()
    })
} else {
    el = document.querySelector("#questionForm")
    el.style.display = 'block'
    let name =  getCookie('question')
    if (Math.floor(Math.random() * 2) === 0) {
        el.innerHTML = `
        <form method='post'>
            <input type='submit' disabled value='هذا'/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input type='submit' disabled value='هذه'/><br>
        </form><br>
        <img src='../images/${name}' style='width: 50%; height: 50%;'>
        `
    } else {
        el.innerHTML = `
        <form method='post'>
            <input type='submit' disabled value='هذه'/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input type='submit' disabled value='هذا'/><br>
        </form><br>
        <img src='../images/${name}' style='width: 50%; height: 50%;'>
        `
    }
    el.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault()
        let answer = JSON.parse(getCookie('answer'))
        answer.push(document.querySelector("input[type='submit']:focus").value)
        setCookie('answer', JSON.stringify(answer))
        location.reload()
    })
}

document.querySelectorAll("input[type='submit']").forEach(function(button) {
    button.disabled = false
})