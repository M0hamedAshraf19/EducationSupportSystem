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
console.log(fileNames)

if (getCookie('questions') === null || getCookie('correct') === null) {
    deleteCookies()
    setCookie('questions', '0')
    setCookie('correct', '0')
} else if (getCookie('answer') !== null) {
    if (JSON.parse(getCookie('answer')).length === 1) {
        let answer = JSON.parse(getCookie('answer'))[0]
        let name = getCookie('question')
        if (!((name[0] === 'M' && answer === 'مذكر') || (name[0] === 'F' && answer === 'مونث'))) {
            if (answer == 'مذكر') {
                alert(`غلط!
الاجابة هى: مونث`)
            } else {
                alert(`غلط!
الاجابة هى: مذكر`)
            }
            setCookie('questions', parseInt(getCookie('questions')) + 1)
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
        } else {
            if (answer == 'هذا') {
                alert(`غلط!
الاجابة هى: هذه`)
            } else {
                alert(`غلط!
الاجابة هى: هذا`)
            }
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
    console.log(names)
    if (Math.floor(Math.random() * 2) === 0) {
        el.innerHTML = `
        <form method='post'>
            <input type='submit' disabled value='مذكر'/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input type='submit' disabled value='مونث'/><br>
        </form><br>
        <img src='../Images/${name}' style='width: 50%; max-height: 450px; object-fit: contain;'>
        `
    } else {
        el.innerHTML = `
        <form method='post'>
            <input type='submit' disabled value='مونث'/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input type='submit' disabled value='مذكر'/><br>
        </form><br>
        <img src='../Images/${name}' style='width: 50%; max-height: 450px; object-fit: contain;'>
        `
    }
    el.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault()
        let answer = el.querySelector("input[type='submit']:focus").value
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
        <img src='../Images/${name}' style='width: 50%; max-height: 450px; object-fit: contain;'>
        `
    } else {
        el.innerHTML = `
        <form method='post'>
            <input type='submit' disabled value='هذه'/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input type='submit' disabled value='هذا'/><br>
        </form><br>
        <img src='../Images/${name}' style='width: 50%; max-height: 450px; object-fit: contain;'>
        `
    }
    el.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault()
        let answer = JSON.parse(getCookie('answer'))
        answer.push(el.querySelector("input[type='submit']:focus").value)
        setCookie('answer', JSON.stringify(answer))
        location.reload()
    })
}

document.querySelector('#score').style.display = 'block'
document.querySelector('#buttons').style.display = 'block'

window.addEventListener("load", function() {    
    document.querySelectorAll("input[type='submit']").forEach(function(button) {
        button.disabled = false
    })
})