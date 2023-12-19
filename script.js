"use strict";

class Simon {
    constructor(colors,simonContainerElem,startButton,roundsTextElem){
        this.colors = colors;
        this.simonContainer = simonContainerElem;
        this.roundsTextElem = roundsTextElem;
        this.startButton = startButton;
        this.compSequence = [];
        this.userSequence = [];
        this.isGameStarted = false;
        this.isUserTurn = false;
        this.roundNumb = 1;
    }

    startGame(){
       this.hideElements();
       this.playComputerSequence();
    }

    hideElements(){
       let dots = [];
       let timer = setInterval(()=>{
            dots.push(".");
            document.querySelector("header").querySelector("p").innerHTML = "Wait for the computer" + dots.join("");
            if ( dots.length === 3) clearInterval(timer); 
        },400);
        
        this.startButton.style.display = "none";
    }

    initComputerSequence(){
        this.compSequence.push(this.colors[Math.floor(Math.random() * this.colors.length)]);
    }

    playComputerSequence(){
        this.isUserTurn = false;
        this.initComputerSequence();
        this.displayTiles(this.compSequence); 
    }
    
    displayTiles(colorArray){
      
        let i = 0;
        let timer = setInterval(() => {
            if (i === colorArray.length){ 
                this.isUserTurn = true ;
                clearInterval(timer);
                return;
            }
            let colorBlock = document.querySelector(`[data-color = "${colorArray[i]}"]`);
            setTimeout(() =>{
                colorBlock.classList.toggle("pressed");
                colorBlock.focus();
                setTimeout(() =>{
                    colorBlock.classList.remove("pressed")
                    colorBlock.blur();
                },400)
            },400)
            i++;
        },1000)

        this.userSequence.length = 0;
    }

    compSeq(iterator){
        if ( this.userSequence[iterator] === this.compSequence[iterator]){
            return true ;
        }
    }

    updateRound(){
        let span = this.roundsTextElem.querySelector("span");
        span.textContent = this.roundNumb + 1;
        this.roundNumb++;
        
        return this.roundNumb;
    }

    gameWon(){
        this.isUserTurn = false;
        document.querySelector("header").querySelector("p").innerHTML = "Well done! You're the champion!";
        this.simonContainer.style.pointerEvents = "none";
    }

    gameOver(){
        let header =  document.querySelector("header").querySelector("p");
        header.innerHTML = "Game over! Thanks for playing";
        let i = 5 ;
        setInterval(() => {
            header.innerHTML = `Game will reset in ${i}s`;
            if ( i <= 0 ){
                location.reload();
            }
            i--;
        },1000);   
    }
}

const simonContainerElem = document.querySelector("[data-simon]");
const startButton = document.querySelector("[data-start]");
const roundsTextElem = document.querySelector("[data-round]");
const colors = ["red","blue","yellow","green"];


let simon = new Simon(colors,simonContainerElem,startButton,roundsTextElem);

simon.simonContainer.addEventListener("click" ,function(e){
    if (simon.isUserTurn){
        let colorBlock = e.target;
        if ( colorBlock.tagName === "DIV"){;
            colorBlock.classList.toggle("pressed");
            setTimeout(() => {
                colorBlock.classList.remove("pressed");
                simon.userSequence.push(colorBlock.getAttribute("data-color"));
                
                if ( simon.compSequence.length === simon.userSequence.length){
                    for (let i = 0 ; i <= simon.userSequence.length - 1 ; i++){
                        if (simon.compSeq(i)){
                            continue;
                        }
                        else{
                            try{
                                simon.gameOver();
                                simon = null;
                            } catch(err){
                                console.log("Error : " + err);
                            }
                        }
                    }                    
                    if (simon.updateRound() === 11) {
                        simon.roundsTextElem.querySelector("span").innerHTML = simon.roundNumb - 1 ;
                        simon.gameWon();
                        return;
                    };
                    simon.playComputerSequence(); 
                }
            },300);
            
        }
    }
    return;
})

simon.startButton.addEventListener("click",function(){
    simon.startGame();
})