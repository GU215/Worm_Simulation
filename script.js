const c = document.querySelector("canvas");
const ctx = c.getContext("2d");

let touch = 0;

let mPos = {
    x: 0,
    y: 0
};
let scale = 1;
if (innerWidth > innerHeight / 9 * 16) {
    c.height = innerHeight * scale;
    c.width = innerHeight * scale / 9 * 16;
} else {
    c.height = innerWidth * scale / 16 * 9;
    c.width = innerWidth * scale;
}
c.style.width = c.width / scale + "px";
c.style.height = c.height / scale + "px";
let mag = c.width / 800;
mPos.x = c.offsetLeft;
mPos.y = c.offsetTop;

window.addEventListener("resize", function (e) {
    scale = 1;
    if (innerWidth > innerHeight / 9 * 16) {
        c.height = innerHeight * scale;
        c.width = innerHeight * scale / 9 * 16;
    } else {
        c.height = innerWidth * scale / 16 * 9;
        c.width = innerWidth * scale;
    }
    c.style.width = c.width / scale + "px";
    c.style.height = c.height / scale + "px";
    mag = c.width / 800;
    mPos.x = c.offsetLeft;
    mPos.y = c.offsetTop;
});

const touchevent = window.ontouchstart;
const touchpoints = navigator.maxTouchPoints;


const p = document.querySelector("p");

const worm_body = new Image();
worm_body.src = "image/worm_body.png";
const worm_head = new Image();
worm_head.src = "image/worm_head.png";
const worm_tail = new Image();
worm_tail.src = "image/worm_tail.png";

let istouch = null;
let moving = null;

function Worm(x, y, r, mdist, n) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.mdist = mdist;
    this.n = n;
    this.Array = [];
}

Worm.prototype = {
    setUp: function () {
        this.Array = [];
        for (let i = 0; i < this.n; i++) {
            const parts = { x: this.x, y: this.y, n: i };
            this.Array.push(parts);
        }
    },
    draw: function () {
        for (let i = this.n - 1; i >= 0; i--) {

            if (i == 0) {
                var rad = Math.atan2(this.Array[1].y - this.Array[0].y, this.Array[1].x - this.Array[0].x);
            } else {
                var rad = Math.atan2(this.Array[i].y - this.Array[i - 1].y, this.Array[i].x - this.Array[i - 1].x)
            }

            // アンチエイリアシングを無効に
            ctx.imageSmoothingEnabled = false;

            ctx.save();
            ctx.translate(this.Array[i].x, this.Array[i].y);
            ctx.scale(this.r / 5, this.r / 5)
            ctx.rotate(rad - Math.PI / 2);
            if (i == 0) {
                var worm_image = worm_head;
            } else if (i == this.n - 1) {
                var worm_image = worm_tail;
            } else {
                var worm_image = worm_body;
            }
            ctx.drawImage(worm_image, -(worm_image.width / 2), -(worm_image.height / 2))
            ctx.restore();

            // ctx.beginPath();
            // ctx.lineWidth = "2"
            // ctx.strokeStyle = "rgb(" + i * 256 / this.n + ", 128,128)";
            // ctx.arc(this.Array[i].x, this.Array[i].y, this.r, 0, Math.PI * 2);
            // ctx.lineTo(this.Array[i].x, this.Array[i].y)
            // ctx.stroke();
            // ctx.closePath();
        }
    },
    calculation: function () {
        for (let i = 1; i < this.n; i++) {
            const Prev = this.Array[i - 1];
            const Now = this.Array[i];
            const Dist = Math.sqrt((Now.x - Prev.x) * (Now.x - Prev.x) + (Now.y - Prev.y) * (Now.y - Prev.y));
            if (this.mdist < Dist) {
                const rad = Math.atan2(Now.y - Prev.y, Now.x - Prev.x)
                Now.x = Prev.x + Math.cos(rad) * this.mdist;
                Now.y = Prev.y + Math.sin(rad) * this.mdist;
            }
        }
    }
}

const wa = new Worm(100, 200, 20, 30, 15);
wa.setUp();

c.addEventListener("mousemove", function (e) {
    e.preventDefault();
    istouch = false;
    moving = e;
})
c.addEventListener("touchmove", function (e) {
    e.preventDefault();
    istouch = true;
    moving = e;
})

function display() {
    ctx.clearRect(0, 0, c.width, c.height);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, c.width, c.height);
    if (moving !== null) {
        if (istouch == false) {

            wa.Array[0].x = moving.pageX - mPos.x;
            wa.Array[0].y = moving.pageY - mPos.y;
        } else {
            touch = moving.changedTouches;
            wa.Array[0].x = touch[0].pageX - mPos.x;
            wa.Array[0].y = touch[0].pageY - mPos.y;
        }
    }
    istouch = null;
    moving = null;

    wa.calculation();
    wa.draw();
}

(function loop() {
    display();
    window.requestAnimationFrame(loop);
})();

animation();

function animation() {
    let frameCount = 0;
    let startTime;
    let endTime;
    startTime = new Date().getTime();

    function animationLoop() {
        frameCount++;
        endTime = new Date().getTime();
        if (endTime - startTime >= 1000) {
            fps = frameCount;
            frameCount = 0;
            startTime = new Date().getTime();
        }
        requestAnimationFrame(animationLoop);
    }
    animationLoop();
}