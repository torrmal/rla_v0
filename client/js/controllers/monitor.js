Template.monitor_devices.devices = function(){
	return Stats.find().fetch();
}


var a = 2;

Template.monitor_devices.events(
	{
		'change #select_device': function(item){
			console.log($(item.target).val());
			//Template.monitor_screen.current_viewers = 3
			a = 4;
		}
	}
);

img_data_into_canvas = function(image_src, canvas){

		
		var image = $('#cosa')[0];
		image.src =  image_src;
		$('#cosa').width('300');
		$('#cosa').height('300');
		//console.log(image_src)
		
		//image.onload = function() {
        //	canvas.tmp_context.putImageData(image, 0, 0);
    	//}
        //console.log(obj.tmp_canvases[name]);
        return canvas.tmp_canvas;
                    

}	

get_device_name = function(){
			var val = $('#select_device option:selected').val();
			return val;
}	

Template.monitor_screen.rendered = function(){
	var caney_obj = new BasicCanvasTEMP({canvas:$('#caney_canvas')[0]});
	var toggled = false;

	try{
		video_stream.on('vid', function(message) {
		    //console.log('user: ');
		    img_data_into_canvas(message,caney_obj);
		});
	}
	catch(e){
		console.log(e);
	}
	

	var myVar=setInterval(function(){
		if(get_device_name()=='--Select a device--') return;
		if(!toggled){
			$('#stats_here').removeClass('device_hidden_object');
			$('#stats_here').show('slow');
			toggled = true;
		}
		var ret2 = Stats.find(get_device_name()).fetch()[0];
		var ret = false;

		try{
			$('#current_viewers').html(ret2.current_viewers);
			//img_data_into_canvas(ret2.current_view,caney_obj);
			$('#seconds_viewed').html(parseInt(ret2.seconds_viewed/1000) );
			var pctg = new Date().getTime() - ret2.time_started;
			pctg = parseInt(ret2.seconds_viewed/(pctg)*100)/10;
			//console.log(pctg);
			if(ret2.current_viewers<=0){

				$('#top_stats_number').html( '-'	 );
			}
			else{

				$('#top_stats_number').html( '<span id="seconds_viewed"><img src="/images/male.png" height="70px"> X1</span><span style="font-size:10px">Adult</span>' );
			}
			
			
		}
		catch(e){
			console.log(e);
		}
	},
	400);
}

