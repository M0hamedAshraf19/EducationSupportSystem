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
    if (getCookie('answer') == eval(getCookie('question').replace('×', '*')))
    {
        setCookie('correct', parseInt(getCookie('correct'))+1)
    }
    else {
        alert(`غلط!
الاجابة هى: \u202A${getCookie('question')} = ${eval(getCookie('question').replace('×', '*'))}\u202C`)
    }
    if (getCookie('question').indexOf('×') >= 0) {
        let multiplyNum0=parseInt(getCookie('multiplyNum0'))
        let multiplyNum1=parseInt(getCookie('multiplyNum1'))
        if (multiplyNum1 < 9) {
            multiplyNum1+=1
        } else {
            multiplyNum1=0
            if (multiplyNum0 < parseInt(getCookie('multiplyEnd'))) {
                multiplyNum0 += 1
            } else {
                multiplyNum0=parseInt(getCookie('multiplyBegin'))
            }
        }
        setCookie('multiplyNum0', multiplyNum0)
        setCookie('multiplyNum1', multiplyNum1)
    }
    setCookie('question', '', new Date(0))
    setCookie('answer', '', new Date(0))
}

document.querySelector('#score').innerHTML=`
    Questions: ${getCookie('questions')}<br>Correct: ${getCookie('correct')}
`
let el=''

if (getCookie('OPs') === null) {
    el=document.querySelector('#chooseOP')
    el.style.display='block'
    el.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault()
        let checked=el.querySelectorAll("input[type='checkbox']:checked")
        let selectedOPs=[]
        checked.forEach(function(checkbox) {
            selectedOPs.push(checkbox.value)
        })
        if (selectedOPs.length === 0) {
            alert('عليك أن تختار')
            return
        }
        setCookie('OPs', JSON.stringify(selectedOPs))
        location.reload()
    })
} else {
    if (JSON.parse(getCookie('OPs')).includes('×') && (getCookie('multiplyBegin') === null || getCookie('multiplyEnd') === null)) {
        el=document.querySelector('#setMultiplication')
        el.style.display='block'
        el.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault()
            let multiplyBegin=el.querySelector("select[name='multiplyBegin']").value
            let multiplyEnd=el.querySelector("select[name='multiplyEnd']").value
            setCookie('multiplyBegin', multiplyBegin)
            setCookie('multiplyEnd', multiplyEnd)
            setCookie('multiplyNum0', multiplyBegin)
            setCookie('multiplyNum1', 0)
            location.reload()
        })
    } else {
        el=document.querySelector('#questionForm')
        el.style.display='block'
        let OP=''
        let num0=0
        let num1=[]
        if (getCookie('question') === null) {
            OP=JSON.parse(getCookie('OPs'))[Math.floor(Math.random() * JSON.parse(getCookie('OPs')).length)]
            if (OP === '+') {
                let l = Math.floor(Math.random() * 3) + 1
                num0 = Array.from({ length: l }, (_, i) => l > 1 && i === 0 ? Math.floor(Math.random()*8)+1 : Math.floor(Math.random()*10));
                num0.forEach((n, i) => l > 1 && i === 0 ? num1.push(Math.floor(Math.random()*(9-n))+1) : num1.push(Math.floor(Math.random()*(10-n))));
                num0 = parseInt(num0.join(""), 10);
                num1 = parseInt(num1.join(""), 10)
            } else if (OP === '-') {
                let l = Math.floor(Math.random() * 3) + 1
                num0 = Array.from({ length: l }, (_, i) => l > 1 && i === 0 ? Math.floor(Math.random()*9)+1 : Math.floor(Math.random()*10));
                num0.forEach((n, i) => l > 1 && i === 0 ? num1.push(Math.floor(Math.random()*n)+1) : num1.push(Math.floor(Math.random()*(n+1))));
                num0 = parseInt(num0.join(""), 10);
                num1 = parseInt(num1.join(""), 10)
            } else {
                num0=parseInt(getCookie('multiplyNum0'))
                num1=parseInt(getCookie('multiplyNum1'))
            }
            setCookie('question', `${num0}${OP}${num1}`)
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
    }
}

document.querySelector('#score').style.display='block'
document.querySelector('#buttons').style.display='block'

window.addEventListener('load', function() {
    document.querySelectorAll("input[type='submit']").forEach(function(button) {
        button.disabled=false;
    });
});