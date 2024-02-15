var Magnifier = function(){
  // members
  
  // private
  var ctx = canvas.getContext("2d");
  var rad = 50;
  var zoom = 2;
  var origImgBuffer = null; 
  var magImgBuffer = null;
  
  //methods
  
  //privileged access
  
  // update the buffers
  this.update = function(flushContent){
    if(flushContent){flush();}
    updateOrigImgBuffer();
    updateMagImgBuffer();
  }
  
  // draw the magnifier centered at coordinates x and y onto the canvas' content
  this.draw = function(x, y){
    console.log("The function has been entered")
    // Use buffers for drawing. Be aware that the shortcut of using int32 usually 
    // would be sensitive to endianness but as we just copy stuff, everything is fine
    
    // Get views on the buffers holding the original and the magnified image.
    // Then, get a mask to determine where to draw from which image.
    var imgDataBuffer = new ArrayBuffer(canvas.width*canvas.height*4);
    var imgBuf8 = new Uint8ClampedArray(imgDataBuffer);
    var imgView = new Uint32Array(imgDataBuffer);
    // get the view on the original image buffer
    var origView = new Uint32Array(origImgBuffer);
    // get the views on the magnification buffer
    var magView = new Uint32Array(magImgBuffer);
    // mask. Be aware that it only has one byte per position (unlike the image arrays!)
    var mask = getMask(x, y);
    // store the original data in the new view
    imgView.set(origView);
    // overwrite the affected fields. Not that due to using the uint32-view, 
    // every entry of mask corresponds exactly to an entry in the view
    // The zoom area is determined by the radius.
    // proper offsetting: find the center pixel (x, y) in the magnified view and get the upper left corner of the drawing area 
    // in the normal scale to draw the magnified view.
    // note that while the columns are noe counted per normal-size pixel, the rows still have to be multiplied with the zoom factor
    var offset = (y * canvas.width * zoom + x) * zoom - (y * canvas.width * zoom + x);
    for(var i = Math.max(0, y - rad); i < Math.min(canvas.width, y + rad); i++){
      for(var j = Math.max(0, x - rad); j < Math.min(canvas.height, x + rad); j++){
        if(mask[i * canvas.width + j] == 1){imgView[i * canvas.width + j] = magView[offset + (i * canvas.width * zoom + j)];} // j withou zoom but rows need full width
        // no else case as imgView is already set to the original image        
      }
    }
    // assign the result to anew imageDataobject and draw it onto the canvas
    var imgData = ctx.createImageData(canvas.width, canvas.height);
    imgData.data.set(imgBuf8);
    ctx.putImageData(imgData, 0, 0);
  
    // circle
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.arc(x, y, rad, 0, 2*Math.PI);
    ctx.stroke();
  }
  
  // setter for the zoom factor
  this.updateZoom = function(z){
    zoom = Math.max(1, z);
    this.update(true);
  }
  
  // setter for the magnifier's radius
  this.updateRad = function(r){
    rad = Math.max(0, r);
    this.update(true);
  }
  
  // private
  
  // flush the scene and reset to the original image
  function flush(){
    if(origImgBuffer == null){return;}
    // get a new image data object
    var d = ctx.createImageData(canvas.width, canvas.height);
    // copy the original image into the object
    var origBuf8 = new Uint8ClampedArray(origImgBuffer);
    d.data.set(origBuf8);
    // draw
    ctx.putImageData(d, 0, 0);
  }
  
  // update the buffer containing the underlying original image
  function updateOrigImgBuffer(){
    // Get the original image data and copy it into a newly created buffer
    // Both have the same format, so no conversion is needed
    d = ctx.getImageData(0, 0, canvas.width, canvas.height);
    origImgBuffer = new ArrayBuffer(d.data.length);
    var v = new Uint8ClampedArray(origImgBuffer);
    v.set(d.data);
  }
  
  // update the buffer containing the magnified image
  function updateMagImgBuffer(){
    // Get a view on the original image data to be magnified
    var origData = new Uint32Array(origImgBuffer);
    // Generate an image buffer to hold the magnified image's data
    // The 32bit view allows to write data without accounting for single 
    // pixels. Normally, this would be sensitive to the endian but here, 
    // we just copy values
    magImgBuffer = new ArrayBuffer(origData.length*4 * zoom * zoom); // *4 due to 4 entries per color. Poiters only reference 174 of the entries
    var magImgData = new Uint32Array(magImgBuffer);
    // fill the buffer. Magnification is achieved by repeating the value along the columns for consecutive rows
    var row = new Uint32Array(canvas.width * zoom);
    for(var i = 0; i < canvas.height; i++){
      for(var j = 0; j < canvas.width; j++){
        var elem = origData[i * canvas.width + j];
        for(var kj = 0; kj < zoom; kj++){
          row[j*zoom + kj] = elem;
        }
      }
      for(var ki = 0; ki < zoom; ki++){
        magImgData.set(row, (i * zoom + ki) * canvas.width * zoom);
      }
    }
  }
  
  // Get a mask depending on the magnifier's size
  // to determine where to draw from which buffer
  function getMask(x, y){  
    // Get a new array the same size of the original array
    // entries in the magnified image buffer are accessed by multiplying
    // indices with zoomfactor^2
    var mask = new Uint8Array(canvas.width * canvas.height);
    // The zoom area is determined by the radius.
    // Get the mask by extracting a circle of proper radius around x and y
    var bRad = rad;
    for(var i = Math.max(0, y - rad); i < Math.min(canvas.width, y + rad); i++){
      for(var j = Math.max(0, x - rad); j < Math.min(canvas.height, x + rad); j++){
        var a = i - y;
        var b = j - x;
        if(a*a + b*b < rad*rad){
          mask[i * canvas.width + j] = 1;
        } // no else. Array is initialized with zeros
      }
    }
    return mask;
  }
  
  // run initialization
  this.update(true);
}

// public access functions. Primarily event handlers

// switch beteen magnification and other interaction
// does not block the other interaction by default!
var magnifierMode = false;
function switchMagnifier(){
  if(magnifierMode == true){
    Mag.update(true);
    magnifierMode = false;
    document.getElementById('onoff').style.color = "darkred";
    document.getElementById('onoff').style.backgroundColor = "gray";
    document.getElementById('onoff').value = "Off";
  } else {
    Mag.update(false);
    magnifierMode = true;
    document.getElementById('onoff').style.color = "darkgreen";
    document.getElementById('onoff').style.backgroundColor = "lightskyblue";
    document.getElementById('onoff').value = "On";
  }
}

var magActive = false;
// invoke magnifier
function magnifyHere(event){
  if(magActive && magnifierMode){
    var borderLeftWidth = parseInt(window.getComputedStyle(canvas, null).getPropertyValue('border-left-width').replace(/(px)/igm, ''));
    var borderTopWidth = parseInt(window.getComputedStyle(canvas, null).getPropertyValue('border-top-width').replace(/(px)/igm, ''));
    var posX = event.pageX - canvas.offsetLeft - borderLeftWidth;
    var posY = event.pageY - canvas.offsetTop - borderTopWidth;
    Mag.draw(posX, posY);
  }
} 

// change the magnifier's diagemer
function updateMagnifierDiameter(){
  var v = document.getElementById('size').value;
  if(v > 200){
    v = 200;
    document.getElementById('size').value = 200;
  } else if(v < 30){
    v = 30;
    document.getElementById('size').value = 30;
  }
  Mag.updateRad(Math.max(30, v/2 + (0.5 * (v%2))));
}

// change the magnifier's zoom factor
function updateMagnifierZoomFactor(){
  var v = document.getElementById('zoom').value;
  if(v > 10){
    v = 10;
    document.getElementById('zoom').value = 10;
  } else if(v < 1){
    v = 1;
    document.getElementById('zoom').value = 1;
  }
  Mag.updateZoom(Math.max(1, v));
}

var ptMode = null;
// switch between many mode andsingl mode for the triangles
function setMode(newmode){
  ptMode = newmode;
  if(newmode === 'single'){
    document.getElementById('single').style.color = "darkgreen";
    document.getElementById('single').style.backgroundColor = "lightskyblue";
    document.getElementById('many').style.color = "darkred";
    document.getElementById('many').style.backgroundColor = "gray";
  } else {
    document.getElementById('many').style.color = "darkgreen";
    document.getElementById('many').style.backgroundColor = "lightskyblue";
    document.getElementById('single').style.color = "darkred";
    document.getElementById('single').style.backgroundColor = "gray";
  }
}

// add event listeners for mode switch menu
function __initModes__(){
  ptMode = 'single';
  document.getElementById('single').addEventListener("click", function(){setMode('single')});
  document.getElementById('many').addEventListener("click", function(){setMode('many')});
  document.getElementById('triggerMany').addEventListener("click", function(){setMode('triggerMany'); addPoint();});
}

// clear the canvas
function clearCanvas(){
  var c = document.getElementById('drawingCanvas');
  var ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);
}

var ptBuf = Array(0);
// add point to buffer. Trigger appropriate function when buffer is full
function addPoint(event){
  if(!magnifierMode){
    if(ptMode !== 'triggerMany'){
      var canvas = document.getElementById('drawingCanvas');
      var borderLeftWidth = parseInt(window.getComputedStyle(canvas, null).getPropertyValue('border-left-width').replace(/(px)/igm, ''));
      var borderTopWidth = parseInt(window.getComputedStyle(canvas, null).getPropertyValue('border-top-width').replace(/(px)/igm, ''));
      var posX = event.pageX - canvas.offsetLeft - borderLeftWidth;
      var posY = event.pageY - canvas.offsetTop - borderTopWidth;
    }
    switch(ptMode){
      case null:
        ptBuf.push(posX);
        ptBuf.push(posY);
        if(ptBuf.length >= 4){
          var ctx =  document.getElementById('drawingCanvas').getContext("2d");
          drawLine(ptBuf, ctx);
          ptBuf = new Array(0);
          console.log("The function has been entered")
        }
        break;
      case 'single':
        clearCanvas(); // deliberately no break here
        ptBuf.push(posX);
        ptBuf.push(posY);
        if(ptBuf.length >= 6){
          var ctx =  document.getElementById('drawingCanvas').getContext("2d");
          draw(ptBuf, ctx);
          ptBuf = new Array(0);
        }
        break;
      case 'many':
        ptBuf.push(posX);
        ptBuf.push(posY);
        break;
      case 'triggerMany':
        if(ptBuf.length >= 6){
          var ctx =  document.getElementById('drawingCanvas').getContext("2d");
          for(var i = 0; (i+5) < ptBuf.length; i+=2){
            draw(ptBuf.slice(i, i+6), ctx);
          }
          ptBuf = new Array(0);
          setMode('many');
        }
        break;
      default:
        throw RangeError("Illegal value for point selection mode. Only allows 'single', 'many', 'triggerMany', and null.");
        break;
    }
  }
}

var canvas = null;
var CanvasRenderingContext2D = null;
var Mag = null;

// initialize the environment for the magnifier and the event listeners
function __initUtils__(){
  // get the canvas and the rendering context
  // grab the context by full name just in case someone tried this reading the exercise sheet...
  canvas = document.getElementById("drawingCanvas");
  CanvasRenderingContext2D = canvas.getContext("2d");

  // add the event listeners to their elements
  document.getElementById('drawingCanvas').addEventListener("mousemove", magnifyHere);
  document.getElementById('drawingCanvas').addEventListener("mousedown", function(event){magActive = true; addPoint(event);});
  document.getElementById('drawingCanvas').addEventListener("mouseup", function(){magActive = false;});
  document.getElementById('onoff').addEventListener("click", switchMagnifier);
  document.getElementById('size').addEventListener("change", updateMagnifierDiameter);
  document.getElementById('zoom').addEventListener("change", updateMagnifierZoomFactor);
  document.getElementById('clear').addEventListener("click", function(){clearCanvas(); Mag.update(false)});

  // generate the actual magnifier
  Mag = new Magnifier();
  Mag.update(true);
}

__initUtils__();