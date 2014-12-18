var Device_data =
	{
		_id: false,
		time_started: 0,
		seconds_viewed: 0,
		current_viewers: 0,
		current_view: []
	};


/**

if(Meteor.isClient) {
  stream.on('notifications', function(message) {
    $('#message-board').prepend('<li>' + message + '</li>');
  });
}

if(Meteor.isServer) {
  stream.permissions.write(function(eventName) {
    return false;
  });

  stream.permissions.read(function(eventName) {
    return true;
  });

  setInterval(function() {
    stream.emit('notifications', 'server generated event');
  }, 1000);
}

**/

function show_ad(){
	Device_data['_id'] = $.jStorage.get('device_name');
	Device_data['time_started'] = (new Date()).getTime();

	Stats.insert(Device_data);

	//$('#device_main_frame').addClass('device_hidden_object');
	//$('#device_advert').removeClass('device_hidden_object');
}

Template.device_middle_screen.events(
	{
	    'click #connect_to_server': function(){
	    	//alert($('#device_name').val());
	    	var device_name = $('#device_name').val();
	    	if(device_name){
	    		$.jStorage.set('device_name', device_name);
	    		show_ad();
	    	}

	    }
	}
);



Template.device_middle_screen.rendered = function(){


	if($.jStorage.get('device_name')){
		show_ad();
	}

	var VideoObject = new VideoInit('#device_video',640,480);

	var tr = new VideoBasicTransforms(VideoObject);
	var caney_obj = new BasicCanvasTEMP({canvas:$('#caney_canvas')[0]});
	var count = 0;
	var last_time  	= new Date().getTime();
	var last_time_faces = 0;

	var analyze_faces = function(faces){
		console.log(faces);
	}

	tr.on_transforms = function(raw_data)
  	{

  		//console.log(tr.get_frequencies());

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
  		var canney = wt.run_canny();
  		var n_canvas = caney_obj.paste_to_canvas(document.createElement("canvas"),0,0,640,480,40,30);
  		var img_array = n_canvas.toDataURL("image/png",0.5);
  		try{
  			//console.log(img_array.length);
  			//console.log(img_array);
  			video_stream.emit('vid', img_array);
  		}
  		catch(e){
  			console.log(e);
  		}

  		tr.get_img8_into_canvas(canney,caney_obj);

  		if(!$.jStorage.get('device_name') ){

  			//
  		}
  		else{


  			if(count >= 6){




				msg.method 		= 'run_bff_face_detect';
				var faces 		= wt.run_bff_face_detect();
				var delta 		= (new Date().getTime()) - last_time;
				count 			= 0;
				//console.log('getting it');
				//console.log(delta);
				for(var i= 0; i < faces.length; i++){
					console.log(faces[i].confidence);
					if(faces[i].confidence<-2){
						faces.splice(i, 1);
					}
				}
				var current_viewers = faces.length;
				console.log(current_viewers);
				Stats.update( { _id: $.jStorage.get('device_name') },
                    { $set: {
                            	//current_view: img_array,
								current_viewers: current_viewers,
                            },
                      $inc: { seconds_viewed: (delta*current_viewers) }
                    }
                  );
				last_time_faces = faces;
				last_time  		= new Date().getTime();
			}
		}

  		count ++;



  	}

}
