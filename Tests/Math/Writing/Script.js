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

    "100": "مئة",
    "200": "مئتان",
    "300": "ثلاثمئة",
    "400": "أربعمئة",
    "500": "خمسمئة",
    "600": "ستمئة",
    "700": "سبعمئة",
    "800": "ثمانمئة",
    "900": "تسعمئة"
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

document.querySelector('#reset').addEventListener('click', function() {
    deleteCookies()
    document.querySelectorAll('form').forEach(function(form) {
        form.reset()
    })
    location.href='../index.html'
})

if (getCookie('questions') === null || getCookie('correct') === null) {
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

document.querySelector('#score').innerHTML=`
    Questions: ${getCookie('questions')}<br>Correct: ${getCookie('correct')}
`

let nums = Object.keys(d);
console.log(nums);
let el=''
el=document.querySelector('#questionForm')
el.style.display='block'

if (getCookie('question') === null) {
    setCookie('question', `${nums[Math.floor(Math.random()*nums.length)]}`)
    console.log(getCookie('question'))
    console.log(nums[Math.floor(Math.random()*nums.length)])
}
el.querySelector('#question').textContent=`${getCookie('question')}`
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

document.querySelector('#score').style.display='block'
document.querySelector('#buttons').style.display='block'

window.addEventListener('load', function() {
    document.querySelectorAll("input[type='submit']").forEach(function(button) {
        button.disabled=false;
    });
});