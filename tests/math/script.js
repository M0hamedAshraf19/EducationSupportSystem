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
    if (getCookie('question').indexOf('×') >= 0) {
        let multiplyNum0 = parseInt(getCookie('multiplyNum0'))
        let multiplyNum1 = parseInt(getCookie('multiplyNum1'))
        if (multiplyNum1 < 9) {
            multiplyNum1 += 1
        } else {
            multiplyNum1 = 0
            if (multiplyNum0 < parseInt(getCookie('multiplyEnd'))) {
                multiplyNum0 += 1
            } else {
                multiplyNum0 = parseInt(getCookie('multiplyBegin'))
            }
        }
        setCookie('multiplyNum0', multiplyNum0)
        setCookie('multiplyNum1', multiplyNum1)
    }
    setCookie('question', '', new Date(0))
    setCookie('answer', '', new Date(0))
    setCookie('num0', '', new Date(0))
    setCookie('num1', '', new Date(0))
}

document.querySelector('#score').innerHTML = `
    Questions: ${getCookie('questions')}<br>Correct: ${getCookie('correct')}
`
document.querySelector('#score').style.display = 'block'

let el = ''

if (getCookie('OPs') === null) {
    el = document.querySelector('#chooseOP')
    el.style.display = 'block'
    el.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault()
        let checked = el.querySelectorAll("input[type='checkbox']:checked")
        let selectedOPs = []
        checked.forEach(function(checkbox) {
            selectedOPs.push(checkbox.value)
        })
        if (selectedOPs.length === 0) {
            alert('You have to choose')
            return
        }
        setCookie('OPs', JSON.stringify(selectedOPs))
        location.reload()
    })
} else {
    if (JSON.parse(getCookie('OPs')).includes('×') && (getCookie('multiplyBegin') === null || getCookie('multiplyEnd') === null)) {
        el = document.querySelector('#setMultiplication')
        el.style.display = 'block'
        el.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault()
            let multiplyBegin = el.querySelector("select[name='multiplyBegin']").value
            let multiplyEnd = el.querySelector("select[name='multiplyEnd']").value
            setCookie('multiplyBegin', multiplyBegin)
            setCookie('multiplyEnd', multiplyEnd)
            setCookie('multiplyNum0', multiplyBegin)
            setCookie('multiplyNum1', 0)
            location.reload()
        })
    } else {
        el = document.querySelector('#questionForm')
        el.style.display = 'block'
        let OP = ''
        let num0 = 0
        let num1 = 0
        if (getCookie('OP') === null || getCookie('num0') === null || getCookie('num1') === null) {
            OP = JSON.parse(getCookie('OPs'))[Math.floor(Math.random() * JSON.parse(getCookie('OPs')).length)]
            if (OP === '+') {
                num0 = Math.floor(Math.random() * 10)
                if (num0 === 0) {
                    num1 = Math.floor(Math.random() * 10)
                } else {
                    num1 = Math.floor(Math.random() * (11-num0))
                }
            } else if (OP === '-') {
                num0 = Math.floor(Math.random() * 10)
                num1 = Math.floor(Math.random() * (num0+1))
            } else {
                num0 = parseInt(getCookie('multiplyNum0'))
                num1 = parseInt(getCookie('multiplyNum1'))
            }
            setCookie('OP', OP)
            setCookie('num0', num0)
            setCookie('num1', num1)
        } else {
            OP = getCookie('OP')
            num0 = getCookie('num0')
            num1 = getCookie('num1')
        }
        el.querySelector('#question').textContent = `${num0} ${OP} ${num1}`
        el.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault()
            let answer = (el.querySelector("input[type='text']").value).trim()
            if (answer) {
                setCookie('question', `${num0}${OP}${num1}`)
                setCookie('answer', answer)
                location.reload()
            } else {
                alert('You have to write')
            }
        })
    }
}

document.querySelectorAll("input[type='submit']").forEach(function(button) {
    button.disabled = false
})