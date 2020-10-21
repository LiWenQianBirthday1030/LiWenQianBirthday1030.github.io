var then,now,delta,interval1=40;
var width,height;
var myrequest=0;
var canvas,cxt,caG,cxtG,caPTr,cxtPTr,caATr,cxtATr,caVTr,cxtVTr;
var velX = new Array(4);
var velY = new Array(4);
var disp = new Array(301);
var accel01,accel12,accel23;
var leftOut,leftIn,topOut,topIn,canvasLeft,canvasTop;
var twoPi=2.0*Math.PI;
var oldMX,oldVX,oldMY,oldVY;
var changeVel = new Array(4);
var count=0;


window.onload = function(){
canvas = document.getElementById("kin");
	
if (canvas && canvas.getContext){

	cxt = canvas.getContext("2d");	
	width = canvas.width;
	height = canvas.height;

	leftOut = parseInt(canvas.style.left)+parseInt(canvas.style.marginLeft);
	leftIn = parseInt(canvas.style.borderLeftWidth)+parseInt(canvas.style.paddingLeft);
	topOut = parseInt(canvas.style.top)+parseInt(canvas.style.marginTop);
	topIn = parseInt(canvas.style.borderTopWidth)+parseInt(canvas.style.paddingLeft);
	canvasLeft = leftOut+leftIn;
	canvasTop = topOut+topIn;

	bStart.style.left = String(50+canvasLeft)+"px";
	bStart.style.top = String(height+canvasTop-30)+"px";
	
	bBack.style.left = String(300+canvasLeft)+"px";
	bBack.style.top = String(height+canvasTop-30)+"px";	
    
    preset.style.left = String(600+canvasLeft)+"px";
	preset.style.top = String(height+canvasTop-30)+"px";	
	
//------------------------	
	cxt.font = '14pt Arial,Helvetica,"Times New Roman","Noto Sans Condensed","DejaVu Sans Condensed",sans-serif';
    cxt.textAlign = "left";
    cxt.textBaseline = "middle";

	caG=document.createElement("canvas");
	caG.width=1200;
	caG.height=400;
	cxtG = caG.getContext("2d");
	cxtG.font = '12pt Arial,Helvetica,"Times New Roman","Noto Sans Condensed","DejaVu Sans Condensed",sans-serif';
	cxtG.textAlign = "left";
    cxtG.textBaseline = "middle";
	drawGrids();
	
	caVTr=document.createElement("canvas");
	caVTr.width=400;
	caVTr.height=400;
	cxtVTr = caVTr.getContext("2d");	
	cxtVTr.fillStyle ="rgba(0,0,255,0.5)";   
	
	caPTr=document.createElement("canvas");
	caPTr.width=400;
	caPTr.height=400;
	cxtPTr = caPTr.getContext("2d");	
	cxtPTr.strokeStyle ="#4C0B5F";
	cxtPTr.lineWidth=2;
	
    caATr=document.createElement("canvas");
	caATr.width=400;
	caATr.height=400;
	cxtATr = caATr.getContext("2d");		
	cxtATr.strokeStyle="#088A08";
	
	
	canvas.addEventListener('mousedown',mouseDown,false);
	canvas.addEventListener('mousemove',mouseMove,false);
	canvas.addEventListener('mouseup',mouseUp,false);
	canvas.addEventListener('mouseout',mouseUp,false);
	canvas.addEventListener('touchstart', touchDown, false);
	canvas.addEventListener('touchmove', touchMove, false); 
	canvas.addEventListener('touchend', touchUp, false);

	velX[0]=450;
	velY[0]=350;
	velX[1]=550;
	velY[1]=100;
	velX[2]=650;
	velY[2]=100;
	velX[3]=750;
	velY[3]=350;	
	
	
	for (var i = 0; i <4; i++){
        changeVel[i]=false;
    }
	trace();
	paint();
	bBack.disabled=true;
  }
}

function paint(){
cxt.fillStyle ="#F8E0E6";
cxt.fillRect(0,0,width,height);
cxt.fill();
cxt.drawImage(caG,0,0);

plotVel();

if (myrequest || count == 300){
    var ww = Math.min(50+count,350);
	   cxt.drawImage(caPTr,0,0,ww,400,0,0,ww,400);
	   cxt.drawImage(caATr,0,0,ww,400,800,0,ww,400);
	   cxt.drawImage(caVTr,0,0,ww,400,400,0,ww,400);
	
	cxt.fillStyle="#4C0B5F";
	cxt.fillText("Distance from starting point (area under v-t graph) = "+String(disp[count].toFixed(1)) + " m",20,410);   
  }
    drawCar();
}

window.onunload = function(){
  stop();
}


  function spc(){
    if (myrequest){ 
       stop();	
	   bStart.value="Cont.";	
	   }
	else{
	  start();
	  bStart.value="Pause";
      bBack.disabled=false;
      preset.disabled=true;	  
	}   
  }
  
   function back(){
     stop();
	 count=0;
	 bStart.value="Start";
	 paint();
	 bStart.disabled=false;
	 bBack.disabled=true;
	 preset.disabled=false;	 
   } 


function start(){
  if (!myrequest){
     then = Date.now();
     myrequest = window.requestAnimationFrame(animate); 
  }
}

function stop(){
  if (myrequest){
    window.cancelAnimationFrame(myrequest);
    myrequest = 0;
    }
}

function animate(time) { 

if (canvas && canvas.getContext){     
		  now =  Date.now();
		  myrequest = window.requestAnimationFrame(animate);    
		  delta = now - then;	    
		   	
		  if (delta > interval1){
		  
			 paint();			
			 count++; 
			if (count > 300){
			 count=300;
			 stop();
			 bStart.disabled=true;
			 }
		  }
              		  
		  then = now-(delta%interval1);	
		 
   }
}
  
   function sign(x) {
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}  
  
  function drawCar(){
    var carY = 475;
	var carX = 100;
	if (myrequest || count == 300){
	    carX =100 + 6.0*disp[count];
	}
	         
    cxt.fillStyle="#4B610B";
	cxt.beginPath();
    cxt.arc(carX+25,carY+45,15,0,twoPi);
	cxt.arc(carX+75,carY+45,15,0,twoPi);
	cxt.fill();
	cxt.fillStyle="#DF3A01";
	cxt.beginPath();
	cxt.fillRect(carX,carY,100,50);
	
	if (carX > 100){
		cxt.strokeStyle="#4C0B5F";
		cxt.fillStyle="#4C0B5F";	
		cxt.beginPath();
		cxt.moveTo(100,carY-30);
		cxt.lineTo(100,carY-10);
		cxt.stroke();
		arrow(cxt,carX,carY-20,100,4);
		var velocity=0.0;
		var acceleration;
		if (count <= velX[1]-velX[0]){
		   acceleration=accel01;
		   velocity = (350-velY[0])/25.0+accel01*count/25.0;
		}
		else if (count <= velX[2]-velX[0]){
		   acceleration=accel12; 
		   velocity = (350-velY[1])/25.0+accel12*(count-(velX[1]-velX[0]))/25.0;
		}
		else if (count <= velX[3]-velX[0]){
		   acceleration=accel23; 
		   velocity = (350-velY[2])/25.0+accel23*(count-(velX[2]-velX[0]))/25.0;
		}
		//-------------------
		cxt.fillStyle="blue";
		var vlength = velocity*13.0;
		if (velocity.toFixed(1)>0)
		   arrow(cxt,carX+110+vlength,carY+25,carX+110,2);
		
	    var value = "Velocity v = "+String(velocity.toFixed(1))+" m s\u207B\xB9";
        var inw = cxt.measureText(value).width;
		var xxx = Math.min(carX+110+vlength+20,width-inw-10);
		if (xxx == width-inw-10)
		   cxt.fillText(value,xxx,carY+100);		
		else
		   cxt.fillText(value,xxx,carY+25);
		//--------------------
		cxt.fillStyle="#088A08";
		var alength = Math.min(Math.abs(acceleration*80.0),80);
		arrow(cxt,carX+180+sign(acceleration)*alength,carY-10,carX+180,2);

	    value = "Acceleration (slope of v-t graph) a = "+String(acceleration.toFixed(1)) + " m s\u207B\xB2";
        inw = cxt.measureText(value).width;	    
		if (acceleration >= 0){
		   xxx = Math.min(carX+180+alength+20,width-inw-10);		
		}
		else{
		   xxx = Math.min(carX+180+20,width-inw-10);			
		   }
		
		if (xxx == width-inw-10)
		   cxt.fillText(value,xxx,410); 
		else
           cxt.fillText(value,xxx,460);  				
	}
  }
  
  function drawGrids(){
    cxtG.strokeStyle="#848484";
	cxtG.beginPath();
	
	for (var j = 0; j<3;j++){
	
		for (var i = 50; i <=350; i+=50){ //vertical lines
			cxtG.moveTo(400*j+i,50);
			cxtG.lineTo(400*j+i,350);			
			}
		
		for (var i = 50; i <=350;i+=50){  // horizontal lines
			cxtG.moveTo(400*j+50,i);
			cxtG.lineTo(400*j+350,i);			
			}
	}
		    cxtG.stroke();	
			
	cxtG.strokeStyle="black";
	cxtG.beginPath();		
	for (var j = 0; j<3;j++){
		cxtG.moveTo(400*j+50,25);	
		cxtG.lineTo(400*j+50,350);
		
		if (j !=2){
			cxtG.lineTo(400*j+375,350);
		    
			cxtG.moveTo(400*j+375-5,350-5);		
		    cxtG.lineTo(400*j+375,350);
		    cxtG.lineTo(400*j+375-5,350+5);
				
		}		
			cxtG.moveTo(400*j+50-5,25+5)
			cxtG.lineTo(400*j+50,25);				
			cxtG.lineTo(400*j+50+5,25+5);		
	}
	    
            cxtG.moveTo(850,200);
            cxtG.lineTo(1175,200);
            cxtG.moveTo(1175-5,200-5);			
            cxtG.lineTo(1175,200);
            cxtG.lineTo(1175-5,200+5);			
	
	    cxtG.stroke();
		
    var inw1 = cxtG.measureText("0").width;
    var inw2 = cxtG.measureText("10").width;
	var inw3 = cxtG.measureText("-2").width;
	
	cxtG.fillStyle = "black";
	for (var j=0;j<3;j++){
	  var yyy = 370;
	     if (j ==2){yyy=220;}
	 for (var i=0;i<5;i++){
       cxtG.fillText(String(i*2),400*j+50+50*i-inw1/2,yyy); 
	 }
	 for (var i=5;i<7;i++){
       cxtG.fillText(String(i*2),400*j+50+50*i-inw2/2,yyy); 
	 }	 
	}
	
	for (var j=0;j<3;j++){
	 for (var i=0;i<7;i++){
	   var yV;
	    if (j==0){yV=25*i;}
	    if (j==1){yV=2*i;}
		else if (j==2){yV=2*i-6;} 
		      if (yV >=0)
                 cxtG.fillText(String(yV),400*j+40-String(yV).length*inw1,350-i*50); 
			  else
                 cxtG.fillText(String(yV),400*j+40-inw3,350-i*50); 
                			  
	 }	    
	}
     inw1 = cxtG.measureText("t / s").width;
	 cxtG.fillText("t / s",400-5-inw1,335); 
     cxtG.fillText("t / s",800-5-inw1,335); 
     cxtG.fillText("t / s",1200-5-inw1,185); 
	 cxtG.fillText("Distance from starting point / m",60,25); 
	 cxtG.fillText("Velocity v / m s\u207B\xB9",460,25); 
	 cxtG.fillText("Acceleration a / m s\u207B\xB2",860,25); 	 	 
  } 
  
  function plotVel(){
	  cxt.strokeStyle = "#08088A";
	  cxt.lineWidth=3;
	  cxt.beginPath();
	  cxt.moveTo(velX[0],velY[0]);
	  cxt.lineTo(velX[1],velY[1]);
	  cxt.lineTo(velX[2],velY[2]);
	  cxt.lineTo(velX[3],velY[3]);
	  cxt.stroke();
	  cxt.lineWidth=1;
	  cxt.fillStyle = "red";
	  
	  for (var i = 0; i < 4; i++){
		cxt.beginPath();
		cxt.arc(velX[i],velY[i],8,0,twoPi);
		cxt.fill();
	  } 
  }
  
  function trace(){
	cxtATr.clearRect(0,0,400,400);
	cxtPTr.clearRect(0,0,400,400);
	cxtVTr.clearRect(0,0,400,400);
	
    accel01=(velY[0]-velY[1])/(velX[1]-velX[0]);
	accel12=(velY[1]-velY[2])/(velX[2]-velX[1]);
	accel23=(velY[2]-velY[3])/(velX[3]-velX[2]);
	
	cxtATr.setLineDash([]);
	cxtATr.lineWidth=3;
	cxtATr.beginPath();
    cxtATr.moveTo(velX[0]-400,200-accel01*25);	
    cxtATr.lineTo(velX[1]-400,200-accel01*25);	
    cxtATr.moveTo(velX[1]-400,200-accel12*25);	
    cxtATr.lineTo(velX[2]-400,200-accel12*25);	
    cxtATr.moveTo(velX[2]-400,200-accel23*25);	
    cxtATr.lineTo(velX[3]-400,200-accel23*25);	 
    cxtATr.stroke();
	
	cxtATr.setLineDash([5]);
	cxtATr.lineWidth=1;
    cxtATr.beginPath();
    cxtATr.moveTo(velX[1]-400,200-accel01*25);	
    cxtATr.lineTo(velX[1]-400,200-accel12*25);	
    cxtATr.moveTo(velX[2]-400,200-accel12*25);	
    cxtATr.lineTo(velX[2]-400,200-accel23*25);	
    cxtATr.stroke();
	
	cxtPTr.beginPath();
	cxtPTr.moveTo(50,350);
	var div01 = (velX[1]-velX[0]);
	var div12 = (velX[2]-velX[1]);
	var div23 = (velX[3]-velX[2]);
	var y0=0.0;
	var y1=0.0;
	
	for (var i = 0; i <= div01; i++){
	   var t = i/25.0;	   
	   var y = (350-velY[0])*t/25.0+0.5*accel01*t*t;
	   disp[i]=y;
	   y0=y;
	   cxtPTr.lineTo(50+i,350-2.0*y);
	   
	}
	for (var i = div01; i <= div01+div12; i++){
	   var t = (i-div01)/25.0;
	   var y = y0+(350-velY[1])*t/25.0+0.5*accel12*t*t;
	   disp[i]=y;
	   y1=y;
	   cxtPTr.lineTo(50+i,350-2.0*y);
	}	
	
	for (var i = div01+div12; i <= div01+div12+div23; i++){
	   var t = (i-div01-div12)/25.0;
	   var y = y1+(350-velY[2])*t/25.0+0.5*accel23*t*t;
	   disp[i]=y;	   
	   cxtPTr.lineTo(50+i,350-2.0*y);	   
	}
	   cxtPTr.stroke();
	   
	 cxtVTr.beginPath();  
	 cxtVTr.moveTo(velX[0]-400,velY[0]);
	 cxtVTr.lineTo(velX[1]-400,velY[1]);
	 cxtVTr.lineTo(velX[2]-400,velY[2]);
	 cxtVTr.lineTo(velX[3]-400,velY[3]);
	 cxtVTr.lineTo(velX[3]-400,350);
	 cxtVTr.lineTo(50,350);	 
     cxtVTr.closePath();
     cxtVTr.fill(); 
  }
   
  
  function arrow(g,headX,headY,tailX,width){  
        var tailY=headY;
        var d = Math.min(Math.abs(headX-tailX)/3.0,30.0);
        var wid = Math.min(width, Math.max(d*0.6-2,0)); 
		 
		 if (headX < tailX){
              d = -d;		
          }	
		  
		g.beginPath();
        g.moveTo(tailX,tailY-wid/2);
        g.lineTo(tailX,tailY+wid/2);
		g.lineTo(headX-d,tailY+wid/2);
		g.lineTo(headX-d,tailY-wid/2);		
		g.closePath();
		g.fill();
		
		g.beginPath();
        g.moveTo(headX,headY);
        g.lineTo(headX-d,headY-d*0.3);
        g.lineTo(headX-d,headY+d*0.3);
		g.closePath();
        g.fill();		
	
      }
 //---------------------------
//---------------------------- 
    function presetCases() {
		var sV = preset.selectedIndex;
		if (sV == 1){velX[0]=450;velY[0]=200;velX[1]=550;velY[1]=200;velX[2]=650;velY[2]=200;velX[3]=750;velY[3]=200;}
		else if (sV == 2){velX[0]=450;velY[0]=100;velX[1]=550;velY[1]=100;velX[2]=650;velY[2]=100;velX[3]=750;velY[3]=100;}
 		else if (sV == 3){velX[0]=450;velY[0]=350;velX[1]=550;velY[1]=300;velX[2]=650;velY[2]=250;velX[3]=750;velY[3]=200;}
		else if (sV == 4){velX[0]=450;velY[0]=350;velX[1]=550;velY[1]=250;velX[2]=650;velY[2]=150;velX[3]=750;velY[3]=50;}  
 		else if (sV == 5){velX[0]=450;velY[0]=200;velX[1]=550;velY[1]=250;velX[2]=650;velY[2]=300;velX[3]=750;velY[3]=350;}
		else if (sV == 6){velX[0]=450;velY[0]=50;velX[1]=550;velY[1]=150;velX[2]=650;velY[2]=250;velX[3]=750;velY[3]=350;} 		
		else if (sV == 7){velX[0]=450;velY[0]=350;velX[1]=550;velY[1]=100;velX[2]=650;velY[2]=100;velX[3]=750;velY[3]=350;} 		
		else if (sV == 8){velX[0]=450;velY[0]=350;velX[1]=600;velY[1]=150;velX[2]=700;velY[2]=150;velX[3]=750;velY[3]=350;} 		
		else if (sV == 9){velX[0]=450;velY[0]=350;velX[1]=500;velY[1]=350;velX[2]=650;velY[2]=100;velX[3]=750;velY[3]=100;} 		
		else if (sV == 10){velX[0]=450;velY[0]=50;velX[1]=550;velY[1]=50;velX[2]=650;velY[2]=300;velX[3]=750;velY[3]=300;} 		
		
		preset.selectedIndex = "0";
		trace();
		paint();
   }  
//---------------------------
//---------------------------

function mouseDown(evt){    
if (count==0){	
 var coord = getMousePointerCoord(evt);
 var mx = coord.x, my = coord.y;
  for (var i = 0; i < 4; i++){	
	if (mx > velX[i]-20 && mx < velX[i]+20 && my > velY[i]-20 && my < velY[i]+20){		  
		changeVel[0]=false;changeVel[1]=false;changeVel[2]=false;changeVel[3]=false;
		changeVel[i]=true;
		oldMX = mx;oldMY=my;		
		oldVX = velX[i]; oldVY = velY[i];	
        break;				
		}
	  }
	}
}

function mouseMove(evt){
	var coord = getMousePointerCoord(evt);
	var mx = coord.x, my = coord.y;
          
	if (changeVel[0]){
       var vy = (oldVY + my - oldMY);			
	   if (vy <= 370 && vy >=30){
	      velY[0]=vy;
		  }
	}	

	else if (changeVel[1]){
	   var vx = (oldVX + mx - oldMX);
       var vy = (oldVY + my - oldMY);
	   if ( vx <= velX[2]-30 && vx >=480 && vy <= 370 && vy >=30){
	       velX[1]=vx;
		   velY[1]=vy;
		  }		
	}
	
	else if (changeVel[2]){
	   var vx = (oldVX + mx - oldMX);
       var vy = (oldVY + my - oldMY);
	   if ( vx <= velX[3]-30 && vx >=velX[1]+30 && vy <= 370 && vy >=30){
	       velX[2]=vx;
		   velY[2]=vy;
		  }		
	}	

	else if (changeVel[3]){
       var vy = (oldVY + my - oldMY);			
	   if (vy <= 370 && vy >=30){
	      velY[3]=vy;
		  }
	}	
	
	else{
	   if (mx > velX[0]-20 && mx < velX[0]+20 && my > velY[0]-20 && my < velY[0]+20){		  
		   document.getElementById("myDIV").style.cursor = "ns-resize";
		  }
		  
	   else if (mx > velX[1]-20 && mx < velX[1]+20 && my > velY[1]-20 && my < velY[1]+20){		  
		   document.getElementById("myDIV").style.cursor = "crosshair";
		  }		  
	   else if (mx > velX[2]-20 && mx < velX[2]+20 && my > velY[2]-20 && my < velY[2]+20){		  
		   document.getElementById("myDIV").style.cursor = "crosshair";
		  }	  
	   else if (mx > velX[3]-20 && mx < velX[3]+20 && my > velY[3]-20 && my < velY[3]+20){		  
		   document.getElementById("myDIV").style.cursor = "ns-resize";
		  }		  		  
	   else{
		   document.getElementById("myDIV").style.cursor = "default";
		  }
       }
	   paint();
    }

function mouseUp(evt){
    if (changeVel[0]){
		velY[0]=Math.round(velY[0]/50.0)*50;
	}
    else if (changeVel[1]){
		velX[1]=Math.round(velX[1]/50.0)*50;
		velY[1]=Math.round(velY[1]/50.0)*50;
	}
    else if (changeVel[2]){
		velX[2]=Math.round(velX[2]/50.0)*50;
		velY[2]=Math.round(velY[2]/50.0)*50;
	}
    else if (changeVel[3]){
		velY[3]=Math.round(velY[3]/50.0)*50;
	}
   document.getElementById("myDIV").style.cursor = "default";
   changeVel[0]=false;changeVel[1]=false;changeVel[2]=false;changeVel[3]=false;
   
   if (count==0){
      trace();
      paint();
   }   
}

function getMousePointerCoord(evt){
   var rect = canvas.getBoundingClientRect();  
   var x =  evt.clientX-rect.left-parseInt(canvas.style.borderLeftWidth)-parseInt(canvas.style.paddingLeft);			 
   var y =  evt.clientY-rect.top-parseInt(canvas.style.borderTopWidth)-parseInt(canvas.style.paddingTop);			 
   return {x: x,y: y};
}

//----------------------------
//----------------------------
 
function touchDown(evt){    

if (count==0){	
 var coord = geTouchCoord(evt);
 var tx = coord.x, ty = coord.y;
  for (var i = 0; i < 4; i++){	
	if (tx > velX[i]-40 && tx < velX[i]+40 && ty > velY[i]-50 && ty < velY[i]+50){		  
	    changeVel[0]=false;changeVel[1]=false;changeVel[2]=false;changeVel[3]=false;
		changeVel[i]=true;
		oldMX = tx;oldMY=ty;		
		oldVX = velX[i]; oldVY = velY[i];	
        break;				
		}
	  }
	}
}

function touchMove(evt){
    var coord = geTouchCoord(evt);
 	var tx = coord.x, ty = coord.y;
	if (changeVel[0]){
 	   evt.preventDefault();
       var vy = (oldVY + ty - oldMY);			
	   if (vy <= 370 && vy >=30){
	      velY[0]=vy;
		  }
	}	

	else if (changeVel[1]){
 	   evt.preventDefault();
	   var vx = (oldVX + tx - oldMX);
       var vy = (oldVY + ty - oldMY);
	   if ( vx <= velX[2]-30 && vx >=480 && vy <= 370 && vy >=30){
	       velX[1]=vx;
		   velY[1]=vy;
		  }		
	}
	
	else if (changeVel[2]){
 	   evt.preventDefault();
	   var vx = (oldVX + tx - oldMX);
       var vy = (oldVY + ty - oldMY);
	   if ( vx <= velX[3]-30 && vx >=velX[1]+30 && vy <= 370 && vy >=30){
	       velX[2]=vx;
		   velY[2]=vy;
		  }		
	}	

	else if (changeVel[3]){
  	   evt.preventDefault();
	   var vy = (oldVY + ty - oldMY);			
	   if (vy <= 370 && vy >=30){
	      velY[3]=vy;
		  }
	}	
	paint();
 }

 
function touchUp(evt){
    if (changeVel[0]){
		velY[0]=Math.round(velY[0]/50.0)*50;
	}
    else if (changeVel[1]){
		velX[1]=Math.round(velX[1]/50.0)*50;
		velY[1]=Math.round(velY[1]/50.0)*50;
	}
    else if (changeVel[2]){
		velX[2]=Math.round(velX[2]/50.0)*50;
		velY[2]=Math.round(velY[2]/50.0)*50;
	}
    else if (changeVel[3]){
		velY[3]=Math.round(velY[3]/50.0)*50;
	}
    changeVel[0]=false;changeVel[1]=false;changeVel[2]=false;changeVel[3]=false;
   if (count==0){
      trace();
      paint();
   } 		    	
}

function geTouchCoord(evt){
   var rect = canvas.getBoundingClientRect();  
   var x =  evt.targetTouches[0].clientX-rect.left-parseInt(canvas.style.borderLeftWidth)-parseInt(canvas.style.paddingLeft);			 
   var y =  evt.targetTouches[0].clientY-rect.top-parseInt(canvas.style.borderTopWidth)-parseInt(canvas.style.paddingTop);			   
   return {x: x,y: y};
}
