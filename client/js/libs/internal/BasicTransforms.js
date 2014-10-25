


window.VideoBasicTransforms = function(video_object, options){

	
  	
	var obj = this;

	options = options || {};

	


	var init = function()
	{
		

  		// initialize video canvas on memory
		obj.memory_canvas 	= new MemoryCanvas( video_object.video, options.frequency||20 ); 


		// initialize variables
		obj.width  = options.width||obj.memory_canvas.canvas.width;
		obj.height = options.height||obj.memory_canvas.canvas.height;

		obj.canvas_copy	= new BasicCanvasTEMP({width:obj.width,height:obj.height});
		//obj.canvas_copy.copy_from_canvas(obj.memory_canvas.canvas,0,0,obj.width,obj.height);


		// this is called when a transform is performed?
		obj.on_transforms = function(){};

		
		obj.memory_canvas.updated = obj.on_canvas_update;

		
	}

	

	

	// this is called everytime the video is updated into the virtual canvas
	obj.on_canvas_update = function()
	{
		
		// this may not be supported by other browsers (check that)
		if (video_object.video.readyState !== video_object.video.HAVE_ENOUGH_DATA) return;
		//console.log(obj.memory_canvas);
		var updated_image_data = obj.memory_canvas.context.getImageData
			(
				0, 
				0, 
				obj.width, 
				obj.height
			);

		//obj.canvas_copy	= new BasicCanvasTEMP({width:obj.width,height:obj.height});
		obj.canvas_copy.copy_from_canvas(obj.memory_canvas.canvas,0,0,obj.width,obj.height);


        obj.on_transforms(updated_image_data.data);
		
	}

	

	
	obj.get_img8_into_canvas = function(image, canvas){

		
		var i = image.cols*image.rows, pix = 0;
        //console.log(i);
        while(--i >= 0) {
            //pix = obj[name].data[i] << 4;
            var pix = image.data[i];
            canvas.data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;

        }

        canvas.tmp_context.putImageData(canvas.tmp_image_data, 0, 0);
        //console.log(obj.tmp_canvases[name]);
        return canvas.tmp_canvas;
                    

	}	

	obj.get_img8_into_array = function(image){

		
		var i = image.cols*image.rows, pix = 0;
		var ret  = [];
        //console.log(i);
        while(--i >= 0) {
            //pix = obj[name].data[i] << 4;
            var pix = image.data[i];

            if(pix > 20){
            	ret.push(i);
            }
            
        }

        return ret;
         

	}

	obj.get_img8_subsection = function(image, x, y, width, height){

		var i = image.cols*image.rows, pix = 0;
        //console.log(i);

        var n_img = new jsfeat.matrix_t(width, height, jsfeat.U8_t | jsfeat.C1_t);

        while(--i >= 0) {

        	var curr_y = parseInt(i/image.cols);
        	var curr_x = i -  curr_y * image.cols;

        	//if(i  )


        }

	}


	

	

	

	
    var alpha = (0xff << 24);



	init();

	return obj;
	
}