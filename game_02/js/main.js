var canvas;
var context;
var gameInf={STATE:"ready",gameCanvasRext:{X:0,Y:0,W:400,H:300}};
var gameUpdateTimer;
var gameDrawUpdate;
var rect_01;
var rect_02;
var i=10;
var height, width, imageData;

var circles = [];

function Rect(x,y,w,h){
  this.X=x;
  this.Y=y;
  this.W=w;
  this.H=h;
}
$(document).ready(function(){

	 canvas=$("#gameCanvas");
   context=canvas.get(0).getContext("2d");
    width = 500;
    height = 500;

   context.clearRect(0, 0, width, height); 
   var data = context.getImageData(0, 0,width, height);
    imageData = data.data;
     gameInit();

 });
function gameInit(){
   var x,y,vx,vy,r;
    for(var i = 0; i<100; i++) {
      x = parseInt(Math.random() * 500);
      y = parseInt(Math.random() * 500);
      vx = parseInt(Math.random() * 10 - 5);
      vy = parseInt(Math.random() * 10 - 5);
      r = 20;
      circles.push({x: x, y:y, vx:vx, vy: vy, radius: r});
    }

   gameUpdateTimer=setInterval(gameUpdate,1);
   gameDrawUpdate=setInterval(drawUpdate,100);
  
}
function gameUpdate(){
   drawCircle(canvas, circles);
}
function drawUpdate(){
   
}

// 中点画圆法
  function drawC(x, y, r, color) {
    var tx = 0, ty = r, d = 1 - r;

    while(tx <= ty){
      // 利用圆的八分对称性画点
      putpixel(x + tx, y + ty, color);
      putpixel(x + tx, y - ty, color);
      putpixel(x - tx, y + ty, color);
      putpixel(x - tx, y - ty, color);
      putpixel(x + ty, y + tx, color);
      putpixel(x + ty, y - tx, color);
      putpixel(x - ty, y + tx, color);
      putpixel(x - ty, y - tx, color);

      if(d < 0){
        d += 2 * tx + 3;
      }else{
        d += 2 * (tx - ty) + 5;
        ty--;
      }
      
      tx++;
    }
  }
function drawCircle(canvas,circles) {
    
    context.clearRect(0, 0, width, height);
    var data = context.getImageData(0, 0,width, height);
    imageData = data.data;
    for(var i =0, len = circles.length; i<len; i++) {
      var circle = circles[i];
     var  color =parseInt(Math.random() * 255);
      drawC(circle.x, circle.y, circle.radius, color);     
      circle.x += circle.vx;
      circle.y += circle.vy;
      if(circle.x < 5){
        circle.x = 5;
        circle.vx *= -1;
      }else if(circle.x > 495){
        circle.x = 495;
        circle.vx *= -1;
      }
      if(circle.y < 5){
        circle.y = 5;
        circle.vy *= -1;
      }else if(circle.y > 495){
        circle.y = 495;
        circle.vy *= -1;
      }
    }
    context.putImageData(data, 0, 0);
  }

function putpixel(x, y, color){
    var index = getStartIndex(x, y);
    for(var i = 0; i< 4; i++) {
        if(i == 3) {
            imageData[index + i] = 255;
        }
        else{
             //var co = parseInt(Math.random() * 255)
            imageData[index + i] = (color+50*i)%255;
        }
    }
}
function getStartIndex(x, y) {
    return y * width * 4 + x * 4;
}