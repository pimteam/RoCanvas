/* some JS code inspired/used from http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/ */

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;
var defaultColor="#000";
var defaultShape="round";
var defaultWidth=5;

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
  var mouseY = e.pageY - this.offsetTop;
		
  paint = true;
  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
  redraw();
});

$('#RoCanvas').mousemove(function(e){
  if(paint){
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
    redraw();
  }
});

$('#RoCanvas').mouseup(function(e){
  paint = false;
  
  clickX = new Array();
  clickY = new Array();
  clickDrag = new Array();
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
	context.clearRect(0,0,canvas.width,canvas.height);
    canvas.width = canvas.width;
    
    clickX = new Array();
    clickY = new Array();
    clickDrag = new Array();
}

function setColor(col)
{
    context.strokeStyle = col;
}

function setSize(px)
{
    context.lineWidth=px;
}

function RoSave(frm)
{    
    var strImageData = canvas.toDataURL();  
        
    $.ajax({
        url: "#", // TBD
        type: "post",
        data: "image_data="+encodeURIComponent(strImageData)+"&title="+frm.title.value
            +"&author="+frm.author.value,
        success: function(msg)
        {
           // TBD
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