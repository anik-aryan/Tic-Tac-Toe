let b1, b2, b3, b4, b5, b6, b7, b8, b9;
        let bcross1, bcross2, bcross3, bcross4, bcross5, bcross6, bcross7, bcross8, bcross9;
        let bcircle1, bcircle2, bcircle3, bcircle4, bcircle5, bcircle6, bcircle7, bcircle8, bcircle9;
        let message, startagain;
        let turn = 1;
        let b11, b12, b13, b14, b15, b16, b17, b18, b19;
        let gameover = false;
        let X = 0;
        let O = 0;
        const Xscore = document.querySelector("#Xscore")
        const Oscore = document.querySelector("#Oscore")
        
        initGame();
        start();
    
        function initGame() {
            
            b1 = document.querySelector("#box1");
            b2 = document.querySelector("#box2");
            b3 = document.querySelector("#box3");
            b4 = document.querySelector("#box4");
            b5 = document.querySelector("#box5");
            b6 = document.querySelector("#box6");
            b7 = document.querySelector("#box7");
            b8 = document.querySelector("#box8");
            b9 = document.querySelector("#box9");
            bcross1 = document.querySelector("#crossbox1"); 
            bcross2 = document.querySelector("#crossbox2"); 
            bcross3 = document.querySelector("#crossbox3"); 
            bcross4 = document.querySelector("#crossbox4"); 
            bcross5 = document.querySelector("#crossbox5"); 
            bcross6 = document.querySelector("#crossbox6"); 
            bcross7 = document.querySelector("#crossbox7"); 
            bcross8 = document.querySelector("#crossbox8"); 
            bcross9 = document.querySelector("#crossbox9"); 
            bcircle1 = document.querySelector("#circlebox1");
            bcircle2 = document.querySelector("#circlebox2");
            bcircle3 = document.querySelector("#circlebox3");
            bcircle4 = document.querySelector("#circlebox4");
            bcircle5 = document.querySelector("#circlebox5");
            bcircle6 = document.querySelector("#circlebox6");
            bcircle7 = document.querySelector("#circlebox7");
            bcircle8 = document.querySelector("#circlebox8");
            bcircle9 = document.querySelector("#circlebox9");
            message = document.querySelector("#message");
            startagain = document.querySelector("#startagain");
        }
    
        function resetBoard() {
           
            turn = 1;
            b11 = b12 = b13 = b14 = b15 = b16 = b17 = b18 = b19 = undefined;
            gameover = false;
            
            
            bcross1.style.visibility = "hidden";
            bcross2.style.visibility = "hidden";
            bcross3.style.visibility = "hidden";
            bcross4.style.visibility = "hidden";
            bcross5.style.visibility = "hidden";
            bcross6.style.visibility = "hidden";
            bcross7.style.visibility = "hidden";
            bcross8.style.visibility = "hidden";
            bcross9.style.visibility = "hidden";
            bcircle1.style.visibility = "hidden";
            bcircle2.style.visibility = "hidden";
            bcircle3.style.visibility = "hidden";
            bcircle4.style.visibility = "hidden";
            bcircle5.style.visibility = "hidden";
            bcircle6.style.visibility = "hidden";
            bcircle7.style.visibility = "hidden";
            bcircle8.style.visibility = "hidden";
            bcircle9.style.visibility = "hidden";
            
            message.innerHTML = "<h1>Player X turn</h1>";
            startagain.style.display = "none";
        }
    
        function whose_turn() {
            if ((turn % 2 !== 0) && turn < 9 && (!gameover)) {
                message.innerHTML = "<h1> Player X Turn</h1>";
            } 
            if ((turn % 2 === 0) && turn < 9 && (!gameover)) {
                message.innerHTML = "<h1> Player O Turn</h1>";
            }
        }
        
        function start() {
            
            const parent = document.getElementById('tic-tac-toe');
            const clone = parent.cloneNode(true);
            parent.parentNode.replaceChild(clone, parent);
            
            
            initGame();
            resetBoard();
            
            
            b1.addEventListener("click", boxClickHandler(1));
            b2.addEventListener("click", boxClickHandler(2));
            b3.addEventListener("click", boxClickHandler(3));
            b4.addEventListener("click", boxClickHandler(4));
            b5.addEventListener("click", boxClickHandler(5));
            b6.addEventListener("click", boxClickHandler(6));
            b7.addEventListener("click", boxClickHandler(7));
            b8.addEventListener("click", boxClickHandler(8));
            b9.addEventListener("click", boxClickHandler(9));
        }
    
        function boxClickHandler(boxNumber) {
            return function handleClick(e) {
                if (gameover) return;
                
                const box = eval('b' + boxNumber);
                const cross = eval('bcross' + boxNumber);
                const circle = eval('bcircle' + boxNumber);
                
                if (cross.style.visibility === "visible" || circle.style.visibility === "visible") {
                    return; 
                }
                
                if (turn % 2 !== 0) {
                    cross.style.visibility = "visible";
                    eval('b1' + boxNumber + ' = 1');
                } else {
                    circle.style.visibility = "visible";
                    eval('b1' + boxNumber + ' = 0');
                }
                
                check();
                turn++;
                whose_turn();
            };
        }
        
        function check() {
            let winnerFound = false;

            if (b11 !== undefined && b11 === b12 && b12 === b13) winnerFound = true;
            if (b14 !== undefined && b14 === b15 && b15 === b16) winnerFound = true;
            if (b17 !== undefined && b17 === b18 && b18 === b19) winnerFound = true;
            if (b11 !== undefined && b11 === b14 && b14 === b17) winnerFound = true;
            if (b12 !== undefined && b12 === b15 && b15 === b18) winnerFound = true;
            if (b13 !== undefined && b13 === b16 && b16 === b19) winnerFound = true;
            if (b11 !== undefined && b11 === b15 && b15 === b19) winnerFound = true;
            if (b13 !== undefined && b13 === b15 && b15 === b17) winnerFound = true;

            if (winnerFound) {
                stop("win");
            } else if (turn === 9) {
                stop("draw");
            }
        }

    
        function stop(result) {
            gameover = true;
            if (result === "win") {
            if (turn % 2 === 0) {
                message.innerHTML = "<h1> Player O Won</h1>";
                O++;
            } else {
                message.innerHTML = "<h1> Player X Won</h1>";
                X++;
            }
            } else {
                message.innerHTML = "<h1> It's a Draw!</h1>";
            }
            Xscore.innerHTML = `X score : ${X}`
            Oscore.innerHTML = `O score : ${O}`
            start_Again();
        }

    
        function start_Again() {
            
            startagain.replaceWith(startagain.cloneNode(true));
            initGame(); 
            
            startagain.style.display = "inline-block";
            startagain.addEventListener("click", function() {
                start();
            }, {once: true}); 
        }