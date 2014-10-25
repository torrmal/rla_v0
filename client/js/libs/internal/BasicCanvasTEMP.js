window.BasicCanvasTEMP = function(options){
	var obj = this;



	obj.tmp_canvas = options.canvas || document.createElement("canvas");

	if(options['canvas'] == undefined){
		obj.tmp_canvas.width = options.width;
		obj.tmp_canvas.height =  options.height;
	}
	else
	{
		obj.tmp_canvas.width = options['canvas'].width;
		obj.tmp_canvas.height =  options['canvas'].height;
	}

	
	obj.copy_from_canvas = function(canvas,x,y,width,height){
		var tmp_data = canvas.getContext("2d").getImageData(
				x||0,
				y||0,
				width||canvas.width,
				height||canvas.height
		); 
		obj.tmp_context.putImageData(tmp_data,0,0);
	}
	
	obj.paste_to_canvas = function(canvas,x,y,width,height,n_width,n_height){

		

		var tmp_data = obj.tmp_context.getImageData(
				x||0,
				y||0,
				width||obj.tmp_canvas.width,
				height||obj.tmp_canvas.height
		); 

		

		if((n_width || false) && (n_height || false)){

			var tmp_canvas = new BasicCanvasTEMP(
				{
					width:width,
					height:height,
				}
			);
			canvas.height = n_width;
			canvas.width= n_height;
			tmp_canvas.tmp_context.putImageData(tmp_data,0,0);

			canvas.getContext("2d").drawImage(tmp_canvas.tmp_canvas,0,0,n_width,n_height);
		}
		else
		{
			canvas.getContext("2d").putImageData(tmp_data,0,0);
		}

		return canvas;
		
	};



	obj.ccv_grayscale = function () {
	  /* detect_objects requires gray-scale image */
	  //var ctx = canvas.getContext("2d");
	  var imageData = obj.getImageData();
	  var data = imageData.data;
	  var pix1, pix2, pix = obj.tmp_canvas.width * obj.tmp_canvas.height * 4;
	  while (pix > 0)
	    data[pix -= 4] = data[pix1 = pix + 1] = data[pix2 = pix + 2] = (data[pix] * 0.3 + data[pix1] * 0.59 + data[pix2] * 0.11);
	  obj.tmp_context.putImageData(imageData, 0, 0);
	  return obj.tmp_canvas;
	};

	obj.ccv_face_detect = function(canvas)
	{
		

		var comp = headtrackr.ccv.detect_objects(
	        obj.ccv_grayscale(), headtrackr.cascade, 5, 1
	    );
        //console.log(pyr);

        
		return comp;
	}

	obj.tmp_context = obj.tmp_canvas.getContext("2d");

	obj.getImageData = function(){
		return obj.tmp_context.getImageData
		(
			0, 
			0, 
			obj.tmp_canvas.width, 
			obj.tmp_canvas.height
		);
	}

	obj.tmp_image_data = obj.getImageData();

	obj.data_u32 = new Uint32Array(obj.tmp_image_data.data.buffer);
	return obj;

}