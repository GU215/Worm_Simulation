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
worm_body.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw1AUhU9TpSIVBzuoOGSoThZERcRJq1CECqFWaNXB5KV/0KQhSXFxFFwLDv4sVh1cnHV1cBUEwR8QVxcnRRcp8b6k0CLGCw8+zrvnct95gFAvM83qGAM03TZTibiYya6KoVcEMIAgYpiRmWXMSVISvvV1T91UdzE+y7/vz+pRcxYDAiLxLDNMm3iDeGrTNjjvE0dYUVaJz4lHTVqQ+JHrisdvnAsuC3xmxEyn5okjxGKhjZU2ZkVTI54kjqqaTvOFjMcq5y3OWrnKmnvyF4Zz+soy1+kMIYFFLEGCCAVVlFCGTXmVoJNiIUX3cR//oOuXyKWQqwRGjgVUoEF2/eB/8DtbKz8x7k0Kx4HOF8f5GAZCu0Cj5jjfx47TOAGCz8CV3vJX6sD0J+m1lhY9Anq3gYvrlqbsAZc7QP+TIZuyKwXpCPk88H5G35QF+m6B7jUvt+Y9Th+ANGWVvAEODoGRAs1e93l3V3tu//Y08/sBuyxyxCHEr7EAAAAGYktHRABIAIoATAIIOxoAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQfnARkNEgipE9uNAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAN5JREFUOMvVUTsKg0AUnN2QYhfBautcwhNYCdoIAYvcI4fwHhaCYBMhVU6QS6TeShC3CGFTvWXdxJDWqfYz7828ecDmwdY+jreTNXoGAAgl0aUN+6tB3pb29Xhid9gv3ultqPpFDQ9V/btQEkJJ/OJwX5nOURJDKAmjZxg9QyiJKInxjcsBIKsLSwWkON1H52C6j84RcbK6sAsHXdowIlN4PoyeXVM/UA4A1/PlI8woid0Ivn0C1bBwbWSTLJN6OAK54L7FoepZmEM4P3EWoEDCdeVtafO2tOHq1mo2ije5OnxcMSa53gAAAABJRU5ErkJggg==";
const worm_head = new Image();
worm_head.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw1AUhU9TpSIVBzuoOGSoThZERcRJq1CECqFWaNXB5KV/0KQhSXFxFFwLDv4sVh1cnHV1cBUEwR8QVxcnRRcp8b6k0CLGCw8+zrvnct95gFAvM83qGAM03TZTibiYya6KoVcEMIAgYpiRmWXMSVISvvV1T91UdzE+y7/vz+pRcxYDAiLxLDNMm3iDeGrTNjjvE0dYUVaJz4lHTVqQ+JHrisdvnAsuC3xmxEyn5okjxGKhjZU2ZkVTI54kjqqaTvOFjMcq5y3OWrnKmnvyF4Zz+soy1+kMIYFFLEGCCAVVlFCGTXmVoJNiIUX3cR//oOuXyKWQqwRGjgVUoEF2/eB/8DtbKz8x7k0Kx4HOF8f5GAZCu0Cj5jjfx47TOAGCz8CV3vJX6sD0J+m1lhY9Anq3gYvrlqbsAZc7QP+TIZuyKwXpCPk88H5G35QF+m6B7jUvt+Y9Th+ANGWVvAEODoGRAs1e93l3V3tu//Y08/sBuyxyxCHEr7EAAAAGYktHRABIAIoATAIIOxoAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQfnARkNETXaVsRfAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAT9JREFUOMvVkT1rwlAUhp/YdkgodArp1iUR10JnQSchLgGhg7j0DxTsUH9CFQz4B1yKQ0To1I4OnR3dkkXaJWQSgg4SboeS9JpYcOnQd7nn4z3v+bjwFxgPe2I87Inf/KMEjokBnOZJdw9PCoDtOfsFn0UOQCmvaHuOmCZLAFRdQ9U1AKbJsiian+Dt+gOib9ut9rEMEwA/DLh/7v5wJJTkzqk96rhYhkm5VqFcq2AZJqOOyyFuCaAxaApV19hGG1RdyzrLsAwTmdMYNMXeBLP6RFF1jXixxg+DgoAfBsSLNaquMatPsiMqMqk1b4t4sebk6gy32qd8aSGEwA8Duu+PJKsd5zcXhwVa87ZIx5Pf9DfyuVQkW2EbbXi9fVHSom20IVntSFY75JjMyZAeJL+O7TnC9hzRmrcL+UM1/xRff+WfxWkaUUwAAAAASUVORK5CYII=";
const worm_tail = new Image();
worm_tail.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw1AUhU9TpSIVBzuoOGSoThZERcRJq1CECqFWaNXB5KV/0KQhSXFxFFwLDv4sVh1cnHV1cBUEwR8QVxcnRRcp8b6k0CLGCw8+zrvnct95gFAvM83qGAM03TZTibiYya6KoVcEMIAgYpiRmWXMSVISvvV1T91UdzE+y7/vz+pRcxYDAiLxLDNMm3iDeGrTNjjvE0dYUVaJz4lHTVqQ+JHrisdvnAsuC3xmxEyn5okjxGKhjZU2ZkVTI54kjqqaTvOFjMcq5y3OWrnKmnvyF4Zz+soy1+kMIYFFLEGCCAVVlFCGTXmVoJNiIUX3cR//oOuXyKWQqwRGjgVUoEF2/eB/8DtbKz8x7k0Kx4HOF8f5GAZCu0Cj5jjfx47TOAGCz8CV3vJX6sD0J+m1lhY9Anq3gYvrlqbsAZc7QP+TIZuyKwXpCPk88H5G35QF+m6B7jUvt+Y9Th+ANGWVvAEODoGRAs1e93l3V3tu//Y08/sBuyxyxCHEr7EAAAAGYktHRABIAIoATAIIOxoAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQfnARkNEy37DD6LAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAQFJREFUOMvVUTGOwjAQHDuXwlakVK7zibyACuloTkJKwT94BP+gOAkpDZGoeAGfoE6FhOwCoVCNtTZ33LVstV7P7szOAm8f6reP5XE1hdEDAIyz2M226l8DPr+/pvv5hqIpkzprQ9cnPTpnlW/jLIyzeIXRkpl51dYwziKMHmH0MM6iamv8hNUAMN8sJjaQ8Xq6RAXX0yUqIma+WUyJgt1sqwimeTLC6ONQaagGgMN6/2Rm1dZxBSmfwR6Vn40yKZns+QpUoaXEoetV7kO+PzFPJvK+bDbOomhKFE2Z1ABg6HqVmCg94HRpFHPJzJ6P3Jz7+YYAH3M5WL5fBuX9VQOAB/4NlZIKPzbsAAAAAElFTkSuQmCC";

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
