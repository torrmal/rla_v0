

window.VideoInit = function(video_name, width, height, fail){
	var video_object = $(video_name);
	var video = video_object[0];
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;
		
	this.video = video;

	

	
	this.callback = function(){console.log('camera input has started');};
	this.fail = fail || function(){console.log('webrtc not enabled');};
	var init = function(){

		// check for camerasupport
		if (navigator.getUserMedia) {
			
			
			// chrome 19 shim
			var videoSelector = {video : true};
			if (window.navigator.appVersion.match(/Chrome\/(.*?) /)) {
				var chromeVersion = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
				if (chromeVersion < 20) {
					videoSelector = "video";
				}
			};
			
			// opera shim
			if (window.opera) {
				window.URL = window.URL || {};
				if (!window.URL.createObjectURL) window.URL.createObjectURL = function(obj) {return obj;};
			}
			
			// set up stream
			navigator.getUserMedia(videoSelector, function( stream ) {
				obj.callback();
				if (video.mozCaptureStream) {
				  video.mozSrcObject = stream;
				} else {
				  video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
				}
				video.play();
				this.video = video;
			}, function() {
				
				
			});
		} 
		else{
			obj.fail();
		}
		
		this.video = video;

		this.video.height = (height == undefined) ? video_object.height() : height;
		
		this.video.width = (width == undefined) ? video_object.width() : width;

		//this.video.height = (height == undefined) ? $(video_name).height() : height;
		
		//this.video.width = (width == undefined) ? $(video_name).width() : width;;

		
	}

	var obj = this;

	init();

	return obj;

}