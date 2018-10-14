var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')
var lineWidth = 5

//窗口改变时，自动改变canvas大小
autoSetCanvasSize(canvas)
//设置canvas背景颜色
setCanvasBackground('white')
//监听鼠标事件
listenToUser(canvas)

//切换画笔和橡皮擦
var eraserEnabled = false
var actions = document.getElementById('actions')
var eraser = document.getElementById('eraser')
var pen = document.getElementById('pen')
eraser.onclick = function () {
    eraserEnabled = true
    eraser.classList.add('active')
    pen.classList.remove('active')
}
pen.onclick = function () {
    eraserEnabled = false
    pen.classList.add('active')
    eraser.classList.remove('active')
}
clear.onclick = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
save.onclick = function () {
    // 安卓chrome可以，小米自带浏览器不行
    // var url = canvas.toDataURL("image/png")
    // var a = document.createElement('a')
    // a.href = url
    // a.download = '我的画图'
    // a.target = '_blank'
    // a.click()
    canvasToImage('canvas', {
        name: '我的画图',
        type: 'jpg',
        quality: 0.7
    })
}
black.onclick = function () {
    context.strokeStyle = 'black'
    black.classList.add('active')
    red.classList.remove('active')
    green.classList.remove('active')
    blue.classList.remove('active')
}
red.onclick = function () {
    context.strokeStyle = 'red'
    red.classList.add('active')
    black.classList.remove('active')
    green.classList.remove('active')
    blue.classList.remove('active')
}
green.onclick = function () {
    context.strokeStyle = 'green'
    green.classList.add('active')
    black.classList.remove('active')
    red.classList.remove('active')
    blue.classList.remove('active')
}
blue.onclick = function () {
    context.strokeStyle = 'blue'
    blue.classList.add('active')
    black.classList.remove('active')
    green.classList.remove('active')
    red.classList.remove('active')
}
thin.onclick = function () {
    lineWidth = 5
}
thick.onclick = function () {
    lineWidth = 10
}
//工具函数
function drawCircle(x, y, radius) {
    context.beginPath()
    context.arc(x, y, radius, 0, Math.PI * 2)
    context.fill()
}

function drawLine(x1, y1, x2, y2) {
    context.beginPath()
    context.moveTo(x1, y1)
    context.lineWidth = lineWidth
    context.lineTo(x2, y2)
    context.stroke()
    context.closePath()
}

function autoSetCanvasSize(canvas) {
    setCanvasSize()
    window.onresize = function () {
        setCanvasSize()
    }

    function setCanvasSize() {
        var pageWidth = document.documentElement.clientWidth
        var pageHeight = document.documentElement.clientHeight

        canvas.width = pageWidth
        canvas.height = pageHeight
    }
}

function listenToUser(canvas) {
    var using = false
    var lastPoint = {
        x: undefined,
        y: undefined
    }
    //特性检测
    if (document.body.ontouchstart !== undefined) {
        //触屏设备 
        canvas.ontouchstart = function (e) {
            var x = e.touches[0].clientX
            var y = e.touches[0].clientY
            using = true
            if (eraserEnabled) {
                context.clearRect(x - 5, y - 5, 10, 10)
            } else {
                lastPoint = {
                    x: x,
                    y: y
                }
            }
        }
        canvas.ontouchmove = function (e) {
            e.preventDefault()
            var x = e.touches[0].clientX
            var y = e.touches[0].clientY
            if (!using) {
                return
            }
            if (eraserEnabled) {
                context.clearRect(x - 5, y - 5, 10, 10)
            } else {
                var newPoint = {
                    x: x,
                    y: y
                }
                drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
                lastPoint = newPoint
            }
        }
        canvas.ontouchend = function () {
            using = false
        }
    } else {
        //非触屏设备
        canvas.onmousedown = function (e) {
            var x = e.clientX
            var y = e.clientY
            using = true
            if (eraserEnabled) {
                context.clearRect(x - 5, y - 5, 10, 10)
            } else {
                lastPoint = {
                    x: x,
                    y: y
                }
            }
        }
        canvas.onmousemove = function (e) {
            var x = e.clientX
            var y = e.clientY
            if (!using) {
                return
            }
            if (eraserEnabled) {
                context.clearRect(x - 5, y - 5, 10, 10)
            } else {
                var newPoint = {
                    x: x,
                    y: y
                }
                drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
                lastPoint = newPoint
            }
        }
        canvas.onmouseup = function () {
            using = false
        }
    }
    

}
function setCanvasBackground(color) {
    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.fillStyle = color;
    context.fill();
}