Template.akshay.rendered = function(){
    
    var canvas = document.getElementById('canvasID'),
        ctx = canvas.getContext('2d'),
        rect = {},
        drag = false,
        rectDisplay = "";
    
    function init() {
      canvas.addEventListener('mousedown', mouseDown, false);
      canvas.addEventListener('mouseup', mouseUp, false);
      canvas.addEventListener('mousemove', mouseMove, false);
    }

    function mouseDown(e) {
      rect.startX = e.pageX - this.offsetLeft;
      rect.startY = e.pageY - this.offsetTop;
      drag = true;
    }
        
    function mouseUp() {
      drag = false;
    }

    function mouseMove(e) {
      if (drag) {
        rect.w = (e.pageX - this.offsetLeft) - rect.startX;
        rect.h = (e.pageY - this.offsetTop) - rect.startY ;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        draw();
      }
    }

    function draw() {
      ctx.lineWidth   = 2;
        ctx.lineJoin    = 'round';
      ctx.strokeStyle = "#00FF00";
        ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);

        var rectDisplay = "Rect : ";
        if (rect.w < 0)
          rectDisplay += (rect.startX + rect.w).toString() + " , ";
        else
          rectDisplay += rect.startX.toString() + " , ";

        if (rect.h < 0)
          rectDisplay += (rect.startY + rect.h).toString() + " , ";
        else 
          rectDisplay += rect.startY.toString() + " , ";

        rectDisplay += Math.abs(rect.w).toString() + " , ";
        rectDisplay += Math.abs(rect.h).toString();

      document.getElementById("rectco").innerHTML = rectDisplay;
    }

    $('#tagID').click( function(){
      console.log(rectDisplay);
    });

    init();
}

Akshay = {

  /*logClicked: function(what) {
  	console.log('clicked: ');
  	console.log(what);
  },
  edgeDetectHorizontal: function(){
  	var image = $('#akshay');

  	var canvas = document.getElementById("out"); // get the element
	var canvasWidth    = image.width();
	var canvasHeight   = image.height();
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	canvasContext.drawImage(image[0], 0, 0);
	var canvasContext  = canvas.getContext("2d");
	var imageData      = canvasContext.getImageData(0, 0, canvasWidth, canvasHeight);
	
	return;
	var WL = canvasWidth*4;
		var WL2 = canvasWidth*4-8;
		var HL = canvasHeight*4-1; 
	
	
	var pix1, pix2, pix = canvasWidth * canvasHeight * 4;
	
	
  	while (pix > 0)
    {
        //var apix = imageData.data[pix];
       
        pix -= 4;
        pix2 = pix +1;
        pix1 = pix +2;
        imageData.data[pix] = (imageData.data[pix] - imageData.data[pix-WL2]);// << 1;
        imageData.data[pix2] = (imageData.data[pix2] - imageData.data[pix2-WL2]);// <<1 ;
        imageData.data[pix1] = (imageData.data[pix1] - imageData.data[pix1-WL2]);//  << 1;

      
    }
    canvasContext.putImageData(imageData, 0, 0);

  }*/
};