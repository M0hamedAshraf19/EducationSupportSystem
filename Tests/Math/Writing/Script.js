const d = {
    "0": "صفر",
    "1": "واحد",
    "2": "اثنان",
    "3": "ثلاثة",
    "4": "أربعة",
    "5": "خمسة",
    "6": "ستة",
    "7": "سبعة",
    "8": "ثمانية",
    "9": "تسعة",

    "10": "عشرة",
    "20": "عشرون",
    "30": "ثلاثون",
    "40": "أربعون",
    "50": "خمسون",
    "60": "ستون",
    "70": "سبعون",
    "80": "ثمانون",
    "90": "تسعون",

    "100": "مائة",
    "200": "مائتان",
    "300": "ثلاثمائة",
    "400": "أربعمائة",
    "500": "خمسمائة",
    "600": "ستمائة",
    "700": "سبعمائة",
    "800": "ثمانمائة",
    "900": "تسعمائة"
}

function getCookie(name) {
    const cookie=document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return cookie ? cookie[2]: null;
}

function setCookie(name, value, expires=null) {
    if (expires) {
        document.cookie=`${name}=${value}; expires=${expires.toUTCString()}; path=${window.location.pathname}`
    } else {
        document.cookie=`${name}=${value}; path=${window.location.pathname}`
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

document.getElementById('reset').addEventListener('click', function() {
    deleteCookies()
    document.querySelectorAll('form').forEach(function(form) {
        form.reset()
    })
    location.href='../index.html'
})

if (getCookie('questions') === null) {
    deleteCookies()
    setCookie('questions', 0)
    setCookie('correct', 0)
} else if (getCookie('answer') !== null) {
    setCookie('questions', parseInt(getCookie('questions'))+1)
    if (getCookie('answer') == d[getCookie('question')])
    {
        setCookie('correct', parseInt(getCookie('correct'))+1)
    }
    else {
        alert(`غلط!
الاجابة هى: ${d[getCookie('question')]}`)
    }
    setCookie('question', '', new Date(0))
    setCookie('answer', '', new Date(0))
}

const scoreEl = document.getElementById('score')
scoreEl.innerHTML=`Questions: ${getCookie('questions')}<br>Correct: ${getCookie('correct')}`
scoreEl.style.display='block'
document.getElementById('buttons').style.display='block'

let nums = Object.keys(d);
let el=document.getElementById('questionForm')
el.style.display='block'

if (getCookie('question') === null) {
    setCookie('question', `${nums[Math.floor(Math.random()*nums.length)]}`)
}
document.getElementById('question').textContent=`${getCookie('question')}`
el.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault()
    let answer=(el.querySelector("input[type='text']").value).trim()
    if (answer) {
        setCookie('answer', answer)
        location.reload()
    } else {
        alert('عليك أن تكتب')
    }
})
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault()
        let answer=(el.querySelector("input[type='text']").value).trim()
        if (answer) {
            setCookie('answer', answer)
            location.reload()
        } else {
            alert('عليك أن تكتب')
        }
    }
})

document.getElementById('answer').focus();

window.addEventListener('load', function() {
    document.querySelectorAll("input[type='submit']").forEach(function(button) {
        button.disabled=false;
    });
});