var canvas;
var context;
var gameInf={STATE:"ready",gameCanvasRext:{X:0,Y:0,W:400,H:300}};
var gameUpdateTimer;
var gameDrawUpdate;
var rect_01;
var rect_02;
var i=10;
function Rect(x,y,w,h){
  this.X=x;
  this.Y=y;
  this.W=w;
  this.H=h;
}
$(document).ready(function(){

	 canvas=$("#gameCanvas");
   context=canvas.get(0).getContext("2d");
   contex2=canvas.get(0).getContext("2d");
   gameInit();   
   //context.fillRect(40,40,100,100);

 });
function gameInit(){
   rect_01=new Rect(-110,-50,100,100);
   rect_02=new Rect(10,-50,100,100);
   gameUpdateTimer=setInterval(gameUpdate,100);
   gameDrawUpdate=setInterval(drawUpdate,100);
   context.translate(200,150);
 context.scale(1,0.3);
 context.fillStyle = 'blue';
}
function gameUpdate(){
    //rect_01.X++;
    i+=1;
    if(i>999)i=0;
    context.rotate(Math.PI/100);
    context.fillStyle = '#'+i;
    //$("#gameCanvas").css("background-color","#"+i);
}
function drawUpdate(){
    context.clearRect(-400,-400,800,800);
    
    drawRect(context,rect_01);
    drawRect(context,rect_02);
}
function drawRect(context,rect){
  context.fillRect(rect.X,rect.Y,rect.W,rect.H);
}