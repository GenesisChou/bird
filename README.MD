a h5 canvas flappyBird game demo

[demo](https://genesischou.github.io/bird/.)

*tutorial*
```javascript
var game = new Game({
    //canvas element
    target: document.getElementById('container'),
    //scene width
    width: 800,
    //scene height
    height: 500,
    //game spedd
    speed: 6,
    //callback when game start
    start(){
        console.log('start');
    },
    //callback when game stop
    stop(score){
        console.log('game over your score is:' + score);
    },
    //callback when game's scoe change
    scoreChange(score){
        //balabalabala
    }
})
game.start();
```
