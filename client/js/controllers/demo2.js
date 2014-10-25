Template.demo2.rendered = function(){



  	var VideoObject = new VideoInit('#video_test',640,480);

  	//640w/480h
  	
  	var tr = new VideoBasicTransforms(VideoObject);

  	var caney_obj = new BasicCanvasTEMP({canvas:$('#caney_canvas')[0]});
  	
  	var c_listener =  function(can_data) 
  	{
  		//console.log(can_data);
	 	// Log the workers message.
		tr.get_img8_into_canvas(can_data.data,caney_obj);
	}

	var f_listener = function(fdata, tr){

		//console.log(fdata);
		//console.log(fdata.data);
		if(!fdata.data[0] || fdata.data.length<=0){
			return;
		}
		$("#faces").html(' ');
		
		
		

		for(var i=0; i<fdata.data.length; i++){

			if(fdata.data[i].confidence<-4) continue;
			//console.log(i+1);

			var new_cv = new BasicCanvasTEMP({
				width:fdata.data[i].width,
				height:fdata.data[i].height,
			});
			
			tr.canvas_copy.paste_to_canvas(
				new_cv.tmp_canvas,
				fdata.data[i].x,
				fdata.data[i].y,
				fdata.data[i].width,
				fdata.data[i].height,
				32,
				32); 
			

			var t_element = document.createElement('div');
			$(t_element).html('confidence:'+ fdata.data[i].confidence);
			$(t_element).prepend(new_cv.tmp_canvas);
			$("#faces").append(t_element);

		}
		//$('#face_marker').transition({x:fdata.data[0].x, y:fdata.data[0].y, width:fdata.data[0].width, height: fdata.data[0].width},20);
		//block_box
	}

	var c_workers = new ManyfoldWorker('basic_processing.js', 1, c_listener);
	var f_workers = new ManyfoldWorker('basic_processing.js', 2, f_listener);

	count = 0;
  	tr.on_transforms = function(raw_data)
  	{
  		//console.log(tr.get_frequencies());
  		var d1  	= new Date().getTime();
  		var msg = {
			width:tr.width,
			height:tr.height,
			raw_data: raw_data,
			//img_u8_greyscale: tr.img_u8_greyscale,
			gaussian_bluring: true,
			method: 'run_greyscale',
			//log_time: true

		};


  		var wt = new WorkerBasicTransforms(msg);
  		c_listener({data:wt.run_canny()});
  		if(count >= 2){
				var d1  	= new Date().getTime();
				msg.method = 'run_bff_face_detect';
				f_listener({data:wt.run_bff_face_detect()},tr);
				//f_workers.postMessage(msg);
		
				var delta 	= ( new Date().getTime() ) - d1;
				count = 0
		}
  		
  		count ++;

		//console.log(delta);

  		
  	}

  	

  	

};





