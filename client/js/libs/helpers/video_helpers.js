VideoHelpers = {
	load: function(id, width, height, callback, video_success, video_fail){
		video_success = video_success || function(){console.log('video started..');}
		video_fail = video_fail || function(){console.log('no video');}
		var VideoObject = new VideoInit(id, width, height, video_fail);
		VideoObject.callback = video_success;
		
		var tr = new VideoBasicTransforms(VideoObject);
	    
		

	    tr.on_transforms = callback;

	    return tr;
	}
}