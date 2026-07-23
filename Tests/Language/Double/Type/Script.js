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
request.open('GET', '../../Images.json', false);
request.send(null);

fileNames = [];
if (request.status === 200) {
    fileNames = JSON.parse(request.responseText).double;
} else {
    console.error('Error loading JSON:', request.status);
}

if (getCookie('questions') === null || getCookie('correct') === null) {
    deleteCookies()
    setCookie('questions', '0')
    setCookie('correct', '0')
} else if (getCookie('answer') !== null) {
    if (JSON.parse(getCookie('answer')).length === 1) {
        let answer = JSON.parse(getCookie('answer'))[0]
        let name = getCookie('question')
        if (!((name[0] === 'M' && answer === 'مثنى مذكر') || (name[0] === 'F' && answer === 'مثنى مونث'))) {
            if (answer == 'مثنى مذكر') {
                alert(`غلط!
الاجابة هى: مثنى مونث`)
            } else {
                alert(`غلط!
الاجابة هى: مثنى مذكر`)
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
        if ((name[0] === 'M' && answer === 'هذان') || (name[0] === 'F' && answer === 'هاتان')) {
            setCookie('correct', parseInt(getCookie('correct'))+1)
        } else {
            if (answer == 'هذان') {
                alert(`غلط!
الاجابة هى: هاتان`)
            } else {
                alert(`غلط!
الاجابة هى: هذان`)
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
    if (Math.floor(Math.random() * 2) === 0) {
        el.querySelector('#typeOptions').innerHTML = `
        <button>مثنى مذكر</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;او&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button>مثنى مونث</button><br><br>
        <img src='../Images/${name}' style='width: 50%; max-height: 450px; object-fit: contain;'>
        `
    } else {
        el.querySelector('#typeOptions').innerHTML = `
        <button>مثنى مونث</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;او&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button>مثنى مذكر</button><br><br>
        <img src='../Images/${name}' style='width: 50%; max-height: 450px; object-fit: contain;'>
        `
    }
    el.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault()
        let answer = (el.querySelector("input[type='text']").value).trim()
        if (answer) {
            setCookie('answer', JSON.stringify([answer]))
            location.reload()
        } else {
            alert('عليك أن تكتب')
        }
    })
} else {
    el = document.querySelector("#questionForm")
    el.style.display = 'block'
    let name =  getCookie('question')
    if (Math.floor(Math.random() * 2) === 0) {
        el.querySelector('#typeOptions').innerHTML = `
        <button>هذان</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;او&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button>هاتان</button><br><br>
        <img src='../Images/${name}' style='width: 50%; max-height: 450px; object-fit: contain;'>
        `
    } else {
        el.querySelector('#typeOptions').innerHTML = `
        <button>هاتان</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;او&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button>هذان</button><br><br>
        <img src='../Images/${name}' style='width: 50%; max-height: 450px; object-fit: contain;'>
        `
    }
    el.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault()
        let newAnswer = (el.querySelector("input[type='text']").value).trim()
        if (newAnswer) {
            let answer = JSON.parse(getCookie('answer'))
            answer.push(newAnswer)
            setCookie('answer', JSON.stringify(answer))
            location.reload()
        } else {
            alert('عليك أن تكتب')
        }
    })
}

document.querySelector('#score').style.display = 'block'
document.querySelector('#buttons').style.display = 'block'

window.addEventListener("load", function() {    
    document.querySelectorAll("input[type='submit']").forEach(function(button) {
        button.disabled = false
    })
})