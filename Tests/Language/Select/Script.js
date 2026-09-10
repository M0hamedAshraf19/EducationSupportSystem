function getCookie(name) {
    const cookie=document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return cookie ? cookie[2] : null;
}

function setCookie(name, value='', expires=new Date(Date.now() + 365*24*60*60*1000)) {
    document.cookie=`${name}=${value}; expires=${expires.toUTCString()}; path=${window.location.pathname}`
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

document.getElementById('pasteLog').addEventListener('click', async function() {
    let text = 'Date: '+ new Date(Date.now()).toLocaleString() +'\n\n'
    const logs = JSON.parse(getCookie('log'))
    if (logs.length != 0) {
        logs.forEach(log => { text += log+'\n\n'});
        await navigator.clipboard.writeText(text);
        alert("The Logs Have Been Successfully Copied");
    } else { alert("You Havn't Answered Any Questions Yet") }
})

document.getElementById('reset').addEventListener('click', function() {
    deleteCookies()
    document.querySelectorAll('form').forEach(function(form) {
        form.reset()
    })
    document.cookie = `langMode=;expires=${new Date(0).toUTCString()};path=/EducationSupportSystem/Tests/Language/`
    location.href='../'
})


let m0 = null; let f0 = null; let m1 = null; let f1 = null; let imgDir = null
if (document.cookie.match(new RegExp('(^| )langMode=([^;]+)'))[2] == 'heShe') {
    m0 = 'مذكر'
    f0 = 'مونث'
    m1 = 'هذا'
    f1 = 'هذه'
    imgDir = 'HeShe'
} else {
    m0 = 'مثنى مذكر'
    f0 = 'مثنى مونث'
    m1 = 'هذان'
    f1 = 'هاتان'
    imgDir = 'Double'
}
if (getCookie('questions') === null) {
    deleteCookies()
    setCookie('questions', '0')
    setCookie('correct', '0')
    setCookie('usedNames', JSON.stringify([]))
    setCookie('log', '[]')
} else if (getCookie('answer') !== null) {
    const q = getCookie('question')
    const a = JSON.parse(getCookie('answer'))
    const l = JSON.parse(getCookie('log'))
    if (JSON.parse(getCookie('answer')).length === 1) {
        if ((q[0] === 'M' && a[0] === f0) || (q[0] === 'F' && a[0] === m0)) {
            l.push(q.slice(2, q.indexOf('.')) + ': ' + a[0] + ' 🔴')
            setCookie('log', JSON.stringify(l))
            setCookie('questions', parseInt(getCookie('questions')) + 1)
            setCookie('question', '', new Date(0))
            setCookie('answer', '', new Date(0))
            if (q[0] === 'M') {
                alert(`غلط!
الاجابة هى: ${m0}`)
            } else {
                alert(`غلط!
الاجابة هى: ${f0}`)
            }
        }
    } else {
        setCookie('questions', parseInt(getCookie('questions'))+1)
        if ((q[0] === 'M' && a[1] === m1) || (q[0] === 'F' && a[1] === f1)) {
            l.push(q.slice(2, q.indexOf('.')) + ': \u2067' + a[0] + '\u2069, \u2067' + a[1] + '\u2069 🟢')
            setCookie('correct', parseInt(getCookie('correct'))+1)
        } else {
            l.push(q.slice(2, q.indexOf('.')) + ': \u2067' + a[0] + '\u2069, \u2067' + a[1] + '\u2069 🔴')
            if (q[0] === 'M') {
                alert(`غلط!
الاجابة هى: ${m1}`)
            } else {
                alert(`غلط!
الاجابة هى: ${f1}`)
            }
        }
        setCookie('log', JSON.stringify(l))
        setCookie('question', '', new Date(0))
        setCookie('answer', '', new Date(0))
    }
}

let fileNames = []
async function loadFileNames() {
    const response = await fetch('../Images.json');
    const data = await response.json();
    if (m0 == 'مذكر') {
        fileNames=data.heShe
    } else {
        fileNames=data.double
    }
}

const scoreEl = document.getElementById('score')
scoreEl.innerHTML=`Questions: ${getCookie('questions')}<br>Correct: ${getCookie('correct')}`

let el = document.getElementById('questionForm')
let name=''

loadFileNames().then(() => {
    if (JSON.parse(getCookie('usedNames')).length === fileNames.length) {
        setCookie('lastUsedName', JSON.parse(getCookie('usedNames'))[fileNames.length-1])
        setCookie('usedNames', JSON.stringify([]))
    }

    if (getCookie('answer') === null) {
        if (getCookie('question') === null) {
            name = fileNames[Math.floor(Math.random() * fileNames.length)]
            const usedNames=JSON.parse(getCookie('usedNames'))
            const lastUsedName = getCookie('lastUsedName')
            if (lastUsedName === null){
                while (usedNames.includes(name)) {
                    name = fileNames[Math.floor(Math.random() * fileNames.length)]
                }
            } else { 
                while (lastUsedName === name) {
                    name = fileNames[Math.floor(Math.random() * fileNames.length)]
                }
                setCookie('lastUsedNmae', '', new Date(0))
            }
            setCookie('question', `${name}`)
            usedNames.push(name)
            setCookie('usedNames', JSON.stringify(usedNames))
        }
        else { name = getCookie('question') }
        if (Math.floor(Math.random() * 2) === 0) {
            el.innerHTML=`
            <form>
                <input type='submit' disabled value='${m0}'/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input type='submit' disabled value='${f0}'/><br>
            </form><br>
            <img src='../Images/${imgDir}/${name}' style='width: 50%; max-height: 450px; object-fit: contain;'>
            `
        } else {
            el.innerHTML=`
            <form>
                <input type='submit' disabled value='${f0}'/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input type='submit' disabled value='${m0}'/><br>
            </form><br>
            <img src='../Images/${imgDir}/${name}' style='width: 50%; max-height: 450px; object-fit: contain;'>
            `
        }
        el.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault()
            let answer=el.querySelector('input[type=submit]:focus').value
            setCookie('answer', JSON.stringify([answer]))
            location.reload()
        })
    } else {
        name= getCookie('question')
        if (Math.floor(Math.random() * 2) === 0) {
            el.innerHTML=`
            <form>
                <input type='submit' disabled value='${m1}'/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input type='submit' disabled value='${f1}'/><br>
            </form><br>
            <img src='../Images/${imgDir}/${name}' style='width: 50%; max-height: 450px; object-fit: contain;'>
            `
        } else {
            el.innerHTML=`
            <form>
                <input type='submit' disabled value='${f1}'/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input type='submit' disabled value='${m1}'/><br>
            </form><br>
            <img src='../Images/${imgDir}/${name}' style='width: 50%; max-height: 450px; object-fit: contain;'>
            `
        }
        el.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault()
            let answer=JSON.parse(getCookie('answer'))
            answer.push(el.querySelector('input[type=submit]:focus').value)
            setCookie('answer', JSON.stringify(answer))
            location.reload()
        })
    }

    el.style.display='block'
    scoreEl.style.display='block'
    document.getElementById('buttons').style.display='block'

    const img = el.querySelector('img')
    if (img.complete) {
        document.querySelectorAll('input[type=submit]').forEach(function(button) { button.disabled = false })
    } else {
        img.addEventListener('load', function() {
            document.querySelectorAll('input[type=submit]').forEach(function(button) { button.disabled = false })
        })
    }
})