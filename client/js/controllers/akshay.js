Template.akshay.rendered = function(){

  var canvas = document.getElementById('canvasID'),
      ctx = canvas.getContext('2d'),
      rect = {},
      drag = false;

  var background = new Image();

  metaDataImage = new Meteor.Collection("Image_Meta_Data");

  console.log( metaDataImage.find().count() );

  Template.fileupload.Image_Meta_Data = function () {
      return metaDataImage.find();
  };

  Meteor.subscribe("untagged");

  function init(filename) {
    
    /*var imageLog = metaDataImage.findOne({
        tagged : false
    });
    console.log( 'imageLog - ' + imageLog );*/

    //background.src = "http://www.fmwconcepts.com/misc_tests/spraypaint/lena.jpg";
    //background.src = "http://upload.wikimedia.org/wikipedia/en/2/24/Lenna.png";
    //background.src = "/images/widthlong.jpg";
    //background.src = "/images/heightlong.jpg";
    background.src = "/images/doubleWH.jpg";

    scale = 1;
    displayWidth = 0;
    displayHeight = 0;

    background.onload = function(){

        if( background.width > background.height )
        {
          if( background.width > 640 )
            scale = 640 / background.width;
        }
        else
        {
          if( background.height > 480 )
            scale = 480 / background.height;
        }

        displayWidth  = background.width  * scale;
        displayHeight = background.height * scale;

        ctx.drawImage(background,0,0,displayWidth,displayHeight);
                      //canvas.width / 2 - background.width / 2,
                      //canvas.height / 2 - background.height / 2);   
    }
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
    ctx.drawImage(background,0,0,displayWidth,displayHeight);
                  //canvas.width / 2 - background.width / 2,
                  //canvas.height / 2 - background.height / 2);
    ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);

    rectDisplay = "";
    if (rect.w < 0)
      rectDisplay += Math.round((rect.startX + rect.w)/scale).toString() + " , ";
    else
      rectDisplay += Math.round(rect.startX/scale).toString() + " , ";

    if (rect.h < 0)
      rectDisplay += Math.round((rect.startY + rect.h)/scale).toString() + " , ";
    else 
      rectDisplay += Math.round(rect.startY/scale).toString() + " , ";

    rectDisplay += Math.round(Math.abs(rect.w/scale)).toString() + " , ";
    rectDisplay += Math.round(Math.abs(rect.h/scale)).toString();

    document.getElementById("rectco").innerHTML = rectDisplay;
  }

  $('#tagID').click( function(e){

    rectDisplay += " " +
    $('input[name=sex]:checked', '#tagOut').val()       + " " +  
    $('input[name=facehair]:checked', '#tagOut').val()  + " " + 
    $('input[name=glasses]:checked', '#tagOut').val()   + " " + 
    $('input[name=hairtype]:checked', '#tagOut').val()  + " " + 
    $('input[name=hairstyle]:checked', '#tagOut').val() + " " + 
    $('input[name=makeup]:checked', '#tagOut').val()    + " " + 
    $('input[name=skincolor]:checked', '#tagOut').val() + " " + 
    $('input[name=hat]:checked', '#tagOut').val()       + " " ;

    var fs = Npm.require('fs');
    encoding = encoding || 'binary';
    fs.writeFileSync('/training_images~/message.txt', rectDisplay, encoding);

    console.log( rectDisplay );

  });

  init();
}

if(Meteor.isClient) {
/*
  metaDataImage = new Meteor.Collection("Image_Meta_Data");

  // Bind moviesTemplate to Movies collection
  Template.akshay.Image_Meta_Data = function () {
      return metaDataImage.find();
  };

  Meteor.subscribe("untagged");

  /*  
    Meteor.startup(function () {
        fs = Npm.require('fs');
    });
  */
}

Akshay = {
/*
    init: function(filepath) {
      
        var canvas = document.getElementById('canvasID'),
      ctx = canvas.getContext('2d'),
      rect = {},
      drag = false,
      rectDisplay = "";
        
    //canvas.width = 640;
    //canvas.height = 480;

    var background = new Image();

      //background.src = "http://www.fmwconcepts.com/misc_tests/spraypaint/lena.jpg";
      //background.src = "http://upload.wikimedia.org/wikipedia/en/2/24/Lenna.png";
      //background.src = "./home/rla/RLA/rla_v0/public/images/lena.jpg";
      background.src = filepath;
      //background.src.substring(1,15);
      console.log('backgrud - ' + background.src);
      background.onload = function(){
          ctx.drawImage(background,0,0);
                        //canvas.width / 2 - background.width / 2,
                        //canvas.height / 2 - background.height / 2);   
      }
      //canvas.addEventListener('mousedown', mouseDown, false);
      //canvas.addEventListener('mouseup', mouseUp, false);
      //canvas.addEventListener('mousemove', mouseMove, false);
    }

  logClicked: function(what) {
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