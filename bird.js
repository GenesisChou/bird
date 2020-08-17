class Game {
    constructor(option) {
        this.option = option;
        this.cvs = this.option.target;
        this.width = this.option.width || 800;
        this.height = this.option.height || 500;
        this.cvs.width = this.width;
        this.cvs.height = this.height;
        this.speed = this.option.speed || 10;
        this.ctx = this.cvs.getContext('2d');
        this.init();
    }
    init() {
        this.timer = null;
        this.bird = new Bird();
        this.pipes = [];
        this.score = 0;
        this.time = 0;
        this.state = 'ready';
    }
    start() {
        if(this.state==='stop'){
            this.init();
        }
        if (this.state === 'ready') {
            this.state = 'start';
            if (this.option.start) {
                this.option.start();
            }
            this.render();
        }
    }
    stop() {
        if (this.option.stop) {
            this.option.stop(this.score);
        }
        this.state='stop';
        clearInterval(this.timer);
    }
    forward() {
        this.pipes.forEach((pipe, $index) => {
            if (pipe.x + pipe.width <= 0) {
                this.destroyPipe($index);
            }
            pipe.x -= this.speed;
        })
    }
    createPipe() {
        if (this.time % 1500 == 0) {
            this.pipes.push(new Pipe({
                x: this.width,
                height: this.height,
            }));
        }
    }
    destroyPipe($index) {
        this.pipes.splice($index, 1);
    }
    render() {
        let interval = 20;
        this.timer = setInterval(() => {
            if (this.bird.touchGround(this.height)) {
                this.stop();
            }
            this.time += 20;
            this.clearScene();
            this.createPipe();
            this.forward();
            this.drawBird();
            this.drawPipes();
            this.bird.dropDown(interval);
        }, interval);
    }
    clearScene() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    drawBird() {
        this.ctx.fillStyle = this.bird.color;
        this.ctx.beginPath();
        this.ctx.arc(this.bird.x, this.bird.y, this.bird.width, 0, Math.PI * 2);
        this.ctx.fill();
    }
    drawPipes() {
        this.pipes.forEach(pipe => {
            this.ctx.fillStyle = pipe.color;
            if (!pipe.startY) {
                pipe.startY = Math.random() * (pipe.height - pipe.gap);
            }
            this.ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.startY);
            this.ctx.fillRect(pipe.x, pipe.startY + pipe.gap, pipe.width, pipe.height);
            if (this.bird.x - this.bird.width < pipe.x + pipe.width) {
                if (pipe.touchBird(this.bird)) {
                    pipe.touched = true;
                    this.stop();
                }
            } else {
                if (!pipe.passed && !pipe.touched) {
                    pipe.passed = true;
                    this.score++;
                    if (this.option.scoreChange) {
                        this.option.scoreChange(this.score);
                    }
                }
            }
        })
    }
}
class Bird {
    constructor(option = {}) {
        this.width = option.width || 20;
        this.x = 50;
        this.y = 0;
        this.speed = 0;
        this.addControler();
    }
    dropDown(interval) {
        let g = 400; //vertical acceleration
        interval /= 1000; //change ms to s
        this.speed = this.speed + g * interval;
        this.y = this.y + this.speed * interval;
    }
    fly() {
        this.speed = -300;
    }
    touchGround(height) {
        return this.y >= height;
    }
    addControler() {
        document.onkeydown = (event) => {
            let e = event || window.event || arguments.callee.caller.arguments[0],
                direction = '';
            if (e && e.keyCode == 32) {
                this.fly();
            }
        };
    }

}
class Pipe {
    constructor(option = {}) {
        this.width = option.width || 100;
        this.height = option.height;
        this.gap = option.gap || 200;
        this.color = option.color || '#000';
        this.x = option.x;
        this.y = 0;
        this.minY
        this.startY = 0;
        this.endY = 0;
        this.touched = false;
        this.passed = false;
    }
    touchBird(bird) {
        return ((bird.x + bird.width > this.x &&
                bird.x - bird.width < this.x + this.width) &&
            (bird.y - bird.width < this.startY ||
                bird.y + bird.width > this.startY + this.gap))


    }
}