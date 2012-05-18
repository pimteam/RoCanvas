/* some JS code inspired/used from http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/ */

var roCanvas={};
var clickX = new Array();
var clickY = new Array();
roCanvas['startX'] = 0;
roCanvas['startY'] = 0;
roCanvas['clearRect']=[0,0,0,0]; 	
var clickDrag = new Array();
var paint;
var defaultColor="#000";
roCanvas['color']=defaultColor;
var defaultShape="round";
var defaultWidth=5;
var drawTool="path";

var canvas = document.getElementById('RoCanvas');
// Check the element is in the DOM and the browser supports canvas

if(canvas.getContext) 
{
    // Initaliase a 2-dimensional drawing context
    var context = canvas.getContext('2d');
    
    context.strokeStyle = defaultColor;
    context.lineJoin = defaultShape;
    context.lineWidth = defaultWidth;
}

$('#RoCanvas').mousedown(function(e){
  var mouseX = e.pageX - this.offsetLeft;
  roCanvas['startX']=mouseX;
  var mouseY = e.pageY - this.offsetTop;
  roCanvas['startY']=mouseY;
		
  paint = true;	
  if(drawTool=='path')
  {
	addClick(mouseX, mouseY);
	redraw();
  }
});

$('#RoCanvas').mousemove(function(e){
    if(paint){
	// clear any rectangles that should be cleared
    context.clearRect(roCanvas['clearRect'][0],roCanvas['clearRect'][1],
		roCanvas['clearRect'][2],roCanvas['clearRect'][3]);
    
    // clear any circles that have to be cleared
    // set color to white but remember old color
    context.strokeStyle=context.fillStyle='#ffffff';
    console.log(roCanvas['color']);
    context.beginPath();
    context.arc(roCanvas['clearCircle'][0],roCanvas['clearCircle'][1],roCanvas['clearCircle'][2],0,Math.PI*2);
    context.closePath();
    context.stroke();
    context.fill();   
    setColor(roCanvas['color']);
		
	// draw different shapes
	switch(drawTool)
	{
		case 'rectangle':		
		case 'filledrectangle':		
			w = e.pageX - this.offsetLeft - roCanvas['startX'];
			h = e.pageY - this.offsetTop - roCanvas['startY'];			
			roCanvas['clearRect']=[roCanvas['startX'], roCanvas['startY'], w, h];
			
			if(drawTool=='rectangle')
			{
				context.strokeRect(roCanvas['startX'], roCanvas['startY'], w, h);			
			}
			else
			{				
				context.fillRect(roCanvas['startX'], roCanvas['startY'], w, h);			
			}
		break;
        case 'circle':
        case 'filledcircle':
            w = Math.abs(e.pageX - this.offsetLeft - roCanvas['startX']);
            h = Math.abs(e.pageY - this.offsetTop - roCanvas['startY']);   
            // r is the bigger of h and w
            r = h>w?h:w;
            
            roCanvas['clearCircle']=[roCanvas['startX'], roCanvas['startY'], r];
            
            context.beginPath();
            context.arc(roCanvas['startX'],roCanvas['startY'],r,0,Math.PI*2);
            context.closePath();
            
            if(drawTool=='circle') context.stroke();            
            else context.fill();
        break;
		default:
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
		break;
	}
    
    redraw();
  }
});

$('#RoCanvas').mouseup(function(e){
  paint = false;
  
  clickX = new Array();
  clickY = new Array();
  clickDrag = new Array();
  roCanvas['clearRect']=[0,0,0,0];
  roCanvas['clearCircle']=[0,0,0]; 	 	
});

$('#RoCanvas').mouseleave(function(e){
  paint = false;
});

function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

function redraw(){
 // canvas.width = canvas.width; // Clears the canvas  
  			
  for(var i=0; i < clickX.length; i++)
  {		
    context.beginPath();
    if(clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
     }else{
       context.moveTo(clickX[i]-1, clickY[i]);
     }
     context.lineTo(clickX[i], clickY[i]);
     context.closePath();
     context.stroke();
  }
}

function clearCanvas()
{
	oldLineWidth=context.lineWidth;	
	context.clearRect(0,0,canvas.width,canvas.height);
   canvas.width = canvas.width;
    
   clickX = new Array();
   clickY = new Array();
   clickDrag = new Array();
   setSize(oldLineWidth);
   context.lineJoin = defaultShape;
   setColor(roCanvas['color']);
}

function setColor(col)
{
    context.strokeStyle = col;
	context.fillStyle = col;
	roCanvas['color']=col;
}

function setSize(px)
{
    context.lineWidth=px;
}

// sets the tool to draw
function setTool(tool)
{
	drawTool=tool;	
}

function RoSave(frm)
{    
    var strImageData = canvas.toDataURL();  
        
    $.ajax({
        url: "#", // place your Ajax URL here
        type: "post",
        data: "image_data="+encodeURIComponent(strImageData)+"&title="+frm.title.value
            +"&author="+frm.author.value,
        success: function(msg)
        {
           // on success output some message or redirect etc
        }
    });
}

function centerElt(eid,w,h)
{
    elt=document.getElementById(eid);
    var centerY= Math.floor(Math.round($(window).height()/2));
    var centerX= Math.floor(Math.round($(window).width()/2));

    elt.style.top=(centerY-Math.floor(Math.round(h/2))-50)+$(window).scrollTop() + "px";
    elt.style.left=(centerX-Math.floor(Math.round(w/2)))+"px";

    // elt.style.display='block';
	$("#"+eid).show('slow');
}