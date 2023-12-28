requestAnimationFrame(mainLoop);  
const keys = {
    KeyP : false,
    Enter : false,
    listener(e){
       if(keys[e.code] !== undefined){
           keys[e.code] = e.type === "keydown";
           e.preventDefault();
        }
    }
}
addEventListener("keydown",keys.listener);
addEventListener("keyup",keys.listener);

var currentState = startGame;

function startGame (){

   if(keys.Enter){
      keys.Enter = false;
      currentState = game;  
   }
}
function pause(){

    if(keys.KeyP){
       keys.KeyP = false; 
       currentState = game;  
    }

}
function game(){

    if(keys.KeyP){
       keys.KeyP = false; 
       currentState = pause;  
    }
}
function mainLoop(time){
    currentState(); 
    requestAnimationFrame(mainLoop);
}
