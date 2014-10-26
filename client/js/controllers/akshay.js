Template.akshay.rendered = function(){
	$('#button').click(Akshay.edgeDetectHorizontal);
}

Akshay = {
  logClicked: function(what) {
  	console.log('clicked: ');
  	console.log(what);
  },
  edgeDetectHorizontal: function(){
  	var image = $('#akshay');

  	var canvas = document.getElementById("out"); // get the element
	var canvasWidth    = image.width();
	var canvasHeight   = image.height();

	var canvasContext  = canvas.getContext("2d");
	var imageData      = canvasContext.getImageData(0, 0, canvasWidth, canvasHeight);
	canvasContext.drawImage(image[0], 0, 0);
	
	var WL = canvasWidth*4;
		var WL2 = canvasWidth*4-8;
		var HL = canvasHeight*4-1; 
	
	
	var pix1, pix2, pix = canvasWidth * canvasHeight * 4;
	
	
  	while (pix > 0)
    {
        //var apix = imageData.data[pix];
       
        pix -= 4;
        imageData.data[pix] = 0;//(imageData.data[pix] - imageData.data[pix-WL2]);// << 1;
        imageData.data[pix2] = 0;//(imageData.data[pix2] - imageData.data[pix2-WL2]);// <<1 ;
        imageData.data[pix1] = 0;//(imageData.data[pix1] - imageData.data[pix1-WL2]);//  << 1;

      
    }
    canvasContext.putImageData(imageData, 0, 0);

  }
};