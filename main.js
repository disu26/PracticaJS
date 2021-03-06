/**
 * Función que se llama a sí misma y sirve para crear el tablero en el que 
 * se mostrará el ping pong.
 */
(function(){
    self.Board = function(width, height){
            this.width = width;
            this.height = height;
            this.playing = false;
            this.gameOver = false;
            this.bars = [];
            this.ball = null;
            this.playing = false;
        }
        
    self.Board.prototype = {
        get elements(){
            let elements = this.bars.map((bar) => bar);
            elements.push(this.ball);
            return elements;
        }
    }
})();

/**
 * Función que se llama a sí misma y sirve para crear la bola del ping pong.
 */
(function(){
    self.Ball = function(x, y, radius, board){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedY = 0;
        this.speedX = 3;
        this.board = board;
        this.direction = 1;
        this.bounceAngle = 0;
        this.maxBounceAngle = Math.PI /12;
        this.speed = 3;

        board.ball = this;
        this.kind = "circle"
    }

    self.Ball.prototype = {
        move : function(){
            this.x += (this.speedX * this.direction);
            this.y += (this.speedY);
        },
        get width(){
            return this.radius * 2;
        },
        get height(){
            return this.radius * 2;
        },
        collision : function(bar){
            let relativeIntersectY = (bar.y + (bar.height / 2)) - this.y;
            let normalizedIntersectY = relativeIntersectY / (bar.height / 2);
            this.bounceAngle = normalizedIntersectY * this.maxBounceAngle;
            this.speedY = this.speed * -Math.sin(this.bounceAngle);
            this.speedX = this.speed * Math.cos(this.bounceAngle);

            if(this.x > (this.board.width /2)){
                this.direction = -1;
            }else {
                this.direction = 1;
            }
        }
    }
})();

/**
 * Función que se llama a sí misma y sirve para crear las barras del ping pong.
 */
(function(){
    self.Bar = function(x, y, width, height, board){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed = 5;
    }

    self.Bar.prototype = {
        down : function(){
            this.y += this.speed;
        },
        up : function(){
            this.y -= this.speed;
        },
        toString : function(){
            return "x: " + this.x + " y: " + this.y;
        }
    }
})();

/**
 * Funcion que se llama a sí misma y sirve para visualizar el tablero.
 * el prototipo de esta función limpia la pantalla, dibuja los elementos y revisa las colisiones.
 */
(function(){
    self.BoardView = function(canvas, board){
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }

    self.BoardView.prototype = {
        clean: function(){
            this.ctx.clearRect(0, 0, this.board.width, this.board.height);
        },
        draw: function(){
            for (let i = this.board.elements.length - 1; i >= 0; i--) {
                let el = this.board.elements[i];

                draw(this.ctx,el);
            }
        },
        check_collisions: function(){
            for (let i = this.board.bars.length - 1; i >= 0; i--) {
                let bar = this.board.bars[i];

                if(hit(bar, this.board.ball)){
                    this.board.ball.collision(bar);
                }
            }
        },
        play: function(){
            if(board.playing){
                this.clean();
                this.draw();
                this.check_collisions();
                this.board.ball.move();
            }
        }
    }

    /**
     * Funcion que sirve para saber si la pelota a golpeado en una barra.
     * @param {*} a 
     * @param {*} b 
     * @returns boolean
     */
    function hit(a, b){
        let hit = false;
        //Colisiones horizontales
        if(b.x + b.width >= a.x && b.x < a.x + a.width){
            //Colisiones verticales
            if(b.y + b.height >= a.y && b.y < a.y + a.height){
                hit = true;
            }
        }
        //Colision de a con b
        if(b.x <= a.x && b.x + b.width >= a.x + a .width){
            if(b.y <= a.y && b.y + b.height  >= a.y + a.height){
                hit = true;
            }
        }
         //Colision de b con a
         if(a.x <= b.x && a.x + a.width >= b.x + b .width){
            if(a.y <= b.y && a.y + a.height  >= b.y + b.height){
                hit = true;
            }
        }

        return hit;
    }

    /**
     * Función que sirve para dibujar los elementos, un rectangulo o un circulo.
     * @param {*} ctx 
     * @param {*} element 
     */
    function draw(ctx, element){
        switch(element.kind){
            case "rectangle":
                ctx.fillRect(element.x, element.y, element.width, element.height);
                break;
            case "circle":
                ctx.beginPath();
                ctx.arc(element.x, element.y, element.radius, 0, 7);
                ctx.fill();
                ctx.closePath();
                break;
        }
        
    }
})();

/**
 * Variables globales
 */
let board = new Board(800, 400);
let bar = new Bar(20, 100, 40, 100, board);
let bar2 = new Bar(735, 100, 40, 100, board);
let canvas = document.getElementById('canvas');
let boardView = new BoardView(canvas, board);
let ball = new Ball(350, 100, 10, board);

/**
 * Movimiento de las barras laterales, con las flechas o w,s.
 */
document.addEventListener("keydown",(ev) => {
    if(ev.key === "ArrowUp"){
        ev.preventDefault();
        bar2.up();
    }else if(ev.key === "ArrowDown"){
        ev.preventDefault();
        bar2.down();
    }else if(ev.key === "w"){
        ev.preventDefault();
        bar.up();
    }else if(ev.key === "s"){
        ev.preventDefault();
        bar.down();
    }else if(ev.key === " "){
        ev.preventDefault();
        board.playing = !board.playing;
    }
})

boardView.draw();

window.requestAnimationFrame(controller);

function controller(){
    boardView.play();
    window.requestAnimationFrame(controller);
}