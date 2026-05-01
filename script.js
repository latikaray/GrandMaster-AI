const game = new Chess();
let selected = null;

const pieceImages = {
'wP':'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',
'wR':'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
'wN':'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
'wB':'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
'wQ':'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
'wK':'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
'bP':'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg',
'bR':'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
'bN':'https://upload.wikimedia.org/wikipedia/commons/e/ea/Chess_ndt45.svg',
'bB':'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg',
'bQ':'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg',
'bK':'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg'
};

function renderBoard(){
const board = document.getElementById("board");
board.innerHTML = "";
const data = game.board();

for(let r=0;r<8;r++){
for(let c=0;c<8;c++){
const sq = document.createElement("div");
sq.className = "board-square " + ((r+c)%2==0 ? "square-light":"square-dark");

const file = String.fromCharCode(97+c);
const rank = 8-r;
const pos = file+rank;

sq.onclick = ()=>handleClick(pos);

const piece = data[r][c];
if(piece){
const p = document.createElement("div");
p.className = "piece";
p.style.backgroundImage = `url(${pieceImages[piece.color+piece.type.toUpperCase()]})`;
sq.appendChild(p);
}

if(selected===pos){
sq.classList.add("selected");
}

board.appendChild(sq);
}
}
}

function handleClick(square){
if(game.game_over()) return;

if(!selected){
const piece = game.get(square);
if(piece && piece.color==="w"){
selected = square;
renderBoard();
}
}else{
const move = game.move({from:selected,to:square,promotion:'q'});
selected=null;

if(move){
renderBoard();
setTimeout(aiMove,200);
}else{
renderBoard();
}
}
}

const values = {p:10,n:30,b:30,r:50,q:90,k:900};

function evaluate(){
let score=0;
game.board().forEach(row=>{
row.forEach(p=>{
if(p){
score += (p.color==='w'?1:-1)*values[p.type];
}
});
});
return score;
}

function minimax(depth,alpha,beta,isMax){
if(depth===0 || game.game_over()) return evaluate();

const moves = game.moves();

if(isMax){
let max=-Infinity;
for(let m of moves){
game.move(m);
max=Math.max(max,minimax(depth-1,alpha,beta,false));
game.undo();
alpha=Math.max(alpha,max);
if(beta<=alpha) break;
}
return max;
}else{
let min=Infinity;
for(let m of moves){
game.move(m);
min=Math.min(min,minimax(depth-1,alpha,beta,true));
game.undo();
beta=Math.min(beta,min);
if(beta<=alpha) break;
}
return min;
}
}

function aiMove(){
if(game.game_over()) return;

let bestMove=null;
let bestVal=Infinity;

const moves=game.moves();

for(let m of moves){
game.move(m);
let val=minimax(2,-Infinity,Infinity,true);
game.undo();

if(val<bestVal){
bestVal=val;
bestMove=m;
}
}

game.move(bestMove);
renderBoard();
}

function resetGame(){
game.reset();
selected=null;
renderBoard();
}

renderBoard();
