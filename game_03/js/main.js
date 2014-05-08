var circles = [];
    var height, width, imageData;
    var canvas, cxt, timerid, count = 10;
    var linePi;
    var fountainVy = -2;
    var inter = -1;
    var tick = 0;
    //动画参数。
    (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                       || window[vendors[x]+'CancelRequestAnimationFrame'];
        }
     
        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
                  timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
     
        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    }());
    
    $(document).ready(function(){

           init();

 });
    function init() {
        var div = document.getElementById("renderer");
        div.innerHTML = "";
        canvas = document.createElement("canvas");
        canvas.style.width = "500px"
        canvas.style.height = "500px"
        canvas.width = 500;
        canvas.height = 500;
        width = 500;
        height = 500;
        linePi = width * 4;
        div.appendChild(canvas);
        cxt= canvas.getContext("2d");
        cxt.clearRect(0, 0, width, height);
        var data = cxt.getImageData(0, 0,width, height);
        imageData = data.data;
        
        var x,y,vx,vy,r;
        var lines = [];
        var circles = [];
        animate();
        
        function animate () {
            tick ++;
            if(tick % 30 == 0) {
                fountainVy += inter * Math.random() * 3;
                if(fountainVy < -10) {
                    inter = 1;
                }
                if(fountainVy > -2) {
                    inter = -1;
                }
            } 
            timerid = requestAnimationFrame(animate);
            cxt.clearRect(0, 0, width, height);
            data = cxt.getImageData(0, 0,width, height);
            imageData = data.data;
            drawLines();
        }
        
        function drawLines(){
            //新的水柱
            for(var i =0 ; i<1; i++) {
                var x = Math.random() * 100 + 200;
                var y = 500;
                var vx = 0;
                var vy = -Math.random() * 2 + fountainVy;
                var life = Math.random() * 10 + 60;
                lines.push({x: x, y: y, vx: vx, vy: vy, life: life});
            }
            
            //水柱衰减产生水滴。
            for(var i =0 ; i<lines.length; i++) {
                var line = lines[i];
                line.vy += 0.16;
                line.y += line.vy;
                line.life --;
                if(line.life > 0 && line.vy < 0) {
                    Line_Bresenham(parseInt(line.x), parseInt(line.y), parseInt(line.x), parseInt(line.y)+10, 0);
                }else {
                    //删除水柱。
                    lines[i] = lines[lines.length - 1];
                    lines.pop();
                    //产生水滴粒子。
                    for(var j = 0; j < 5; j++) {
                        var x = line.x;
                        var y = line.y;
                        var vx = Math.random() * 6 - 3;
                        var vy = line.vy;
                        var life = Math.random() * 60;
                        circles.push({x: x, y: y, vx: vx, vy: vy, life: life});
                    }
                }
            }
            
            //粒子衰减
            for(var i =0 ; i<circles.length; i++) {
                var circle = circles[i];
                circle.vy += 0.16;
                circle.y += circle.vy;
                circle.x += circle.vx;
                circle.life --;
                if(circle.life > 0) {
                    drawC(parseInt(circle.x), parseInt(circle.y), 2, 0);
                }else {
                    //删除粒子。
                    circles[i] = circles[circles.length - 1];
                    circles.pop();
                }
            }
            
            cxt.putImageData(data, 0, 0);
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
        
        // 使用 Bresenham 算法画任意斜率的直线（包括起始点，不包括终止点）
        function Line_Bresenham(x1, y1, x2, y2, color)
        {
            var  x = x1;
            var y = y1;
            var dx = Math.abs(x2 - x1);
            var dy = Math.abs(y2 - y1);
            var s1 = x2 > x1 ? 1 : -1;
            var s2 = y2 > y1 ? 1 : -1;
            
            var interchange = false;    // 默认不互换 dx、dy
            if (dy > dx)                // 当斜率大于 1 时，dx、dy 互换
            {
                var temp = dx;
                dx = dy;
                dy = temp;
                interchange = true;
            }
            
            var p = 2 * dy - dx;
            for(var i = 0; i < dx; i++)
            {
                putpixel(x, y, color);
                if (p >= 0)
                {
                    if (!interchange)        // 当斜率 < 1 时，选取上下象素点
                        y += s2;
                    else                    // 当斜率 > 1 时，选取左右象素点
                        x += s1;
                    p = p + 2 * dy - 2 * dx;
                }
                if (!interchange)
                    x += s1;                // 当斜率 < 1 时，选取 x 为步长
                else
                    y += s2;                // 当斜率 > 1 时，选取 y 为步长
                p += 2 * dy;
            }
        }
        
        function putpixel(x, y, color){
            if(x < 0 || y < 0 || x >= width || y >=width) {
                return;
            }
            var index = getStartIndex(x, y);
            for(var i = 0; i< 4; i++) {
                if(i == 3) {
                    imageData[index + i] = 255;
                }
                else{
                    // var co = parseInt(Math.random() * 255)
                    imageData[index + i] = color;
                }
            }
        }
        
        function getStartIndex(x, y) {
            return y * width * 4 + x * 4;
        }
        
    }
  
  function stop() {
    cancelAnimationFrame(timerid);
  }
