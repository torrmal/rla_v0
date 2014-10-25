Template.dashboard.rendered = function(){

	var win = $( window );


	var tr = false;//new VideoBasicTransforms(VideoObject);

	window.net = false;
	window.age_net = false;
	window.face_net = false;

	var number_of_iterations = 3;

	var classes_txt = [
		'Male',
		'Female'
	];

	var age_classes_txt = [
		  'kid',
		  'young',
		  'adult',
		  'older-adult',
	];

	var hide_ini = function(){
		$('#dashboard_side_metrics').hide();
		$('#dashboard_engagement').hide();
		$('#dashboard_gender').hide();
		$('#dashboard_age').hide();
		$('#dashboard_gender_markers').hide();
		$('#dashboard_numbers_box').hide();
		$('#faces').hide();
	}

	var show_dashboard_pannels = function(){
		$('#dashboard_main_circle').animate({width: '280px', height: '280px'},200);
		$('#dashboard_side_metrics').show(2000);
		

		$('#faces').show(200);
		//$('.dashboard_faces').transition({ x: '0px', y: '280px' });

		//show_more_stats();

	}
	var more_shown = false;
	var show_more_stats = function(){
		if(more_shown ) return;
		more_shown = true;
		$('#dashboard_engagement').show(200);
		$('#dashboard_engagement').transition({ x: '-400px', y: '150px' });
		
		$('#dashboard_age').show(200);
		$('#dashboard_age').transition({ x: '-400px', y: '-150px' });
		
		$('#dashboard_gender').show(200);

		$('#dashboard_gender_markers').show();
		$('#dashboard_gender_markers').transition({ x: '180px', y: '-180px' });

		$('#dashboard_numbers_box').show();
		$('#dashboard_numbers_box').transition({ x: '400px', y: '0px' });
		show_charts();
	}

	window['FemaleEngagement'] = [];
	window['MaleEngagement'] = [];

	window['FemaleAges'] = [90,100,100,100,90];
	window['MaleAges'] = [90,100,100,100,90];
	window['FemaleCount'] = 0;
	window['MaleCount'] = 0;

	var show_charts = function(){

		var eng_labels = [];

		for( var i in FemaleEngagement ){
			eng_labels.push("");
		}
		
		var data = {
			labels : eng_labels,
			datasets : [
				{
					fillColor : "rgba(247,70,74,0.5)",
					strokeColor : "rgba(220,220,220,1)",
					pointColor : "rgba(220,220,220,1)",
					pointStrokeColor : "#fff",
					data : FemaleEngagement
				},
				{
					fillColor : "rgba(151,187,205,0.5)",
					strokeColor : "rgba(151,187,205,1)",
					pointColor : "rgba(151,187,205,1)",
					pointStrokeColor : "#fff",
					data : MaleEngagement
				}
			]
		};
		var ctx = document.getElementById("myChart").getContext("2d");
		var myNewChart = new Chart(ctx).Line(data,{animation:false, pointDot : false,scaleShowLabels : true,});

		var data = {
			labels : ["kid","young","adult","older-adult",'senior'],
			datasets : [
				{
					fillColor : "rgba(247,70,74,0.5)",
					strokeColor : "rgba(220,220,220,1)",
					pointColor : "rgba(220,220,220,1)",
					pointStrokeColor : "#fff",
					data : FemaleAges
				},
				{
					fillColor : "rgba(151,187,205,0.5)",
					strokeColor : "rgba(151,187,205,1)",
					pointColor : "rgba(151,187,205,1)",
					pointStrokeColor : "#fff",
					data : MaleAges
				}
			]
		}
		var ctx = document.getElementById("ageChart").getContext("2d");
		var myNewChart = new Chart(ctx).Radar(data,{animation:false,scaleBackdropColor : "rgba(255,255,255,0.75)",pointLabelFontColor : "rgba(255,255,255,0.75)",});

		var data = [
			{
				value: FemaleCount,
				color:"#F7464A"
			},
			{
				value : MaleCount,
				color : "rgba(151,187,205,0.8)"
			},
			

		]

		var ctx = document.getElementById("genderChart").getContext("2d");
		var myNewChart = new Chart(ctx).Doughnut(data,{animation:false,percentageInnerCutout : 90});

		$('#Male_exposure').html(' - '+parseInt((MaleCount/(MaleCount+FemaleCount))*100)+'%');
		$('#Female_exposure').html(' - '+parseInt((FemaleCount/(MaleCount+FemaleCount))*100)+'%');
	}

	var load_from_json = function() {
		//console.log(json);
		net = new convnetjs.Net();
		face_net = new convnetjs.Net();
		age_net = new convnetjs.Net();
		net.fromJSON(trained_gender_l);
		face_net.fromJSON(trained_face_l);
		age_net.fromJSON(trained_age);
		trained_gender_l = false;
		trained_face_l = false;
		trained_age = false;
		

	}

	var ini_bg_canvas = function(){
		var w = win.width()*1.3;
		var h = w * 480/640;

		var new_cv = new BasicCanvasTEMP({
			width:w,
			height:h,
		});

		var div = $("#dashboard_bg");
		div.html(' ');
		new_cv.tmp_canvas.setAttribute("id", "bg_canvas");
		div[0].appendChild(new_cv.tmp_canvas);

	}

	
	
	var update_bg = function(){
		var w = $( window ).width()*1.3;
		var h = w * 480/640;

		var new_cv = document.getElementById('bg_canvas');

		tr.canvas_copy.paste_to_canvas(
			new_cv,
			0,
			0,
			640,
			480,
			w,h
		); 
		
	}

	var determine_features = function(sample,net_name){
	    var net = window[net_name];
	    var num_classes = net.layers[net.layers.length-1].out_depth;

	    // forward prop it through the network
	    var aavg = new convnetjs.Vol(1,1,num_classes,0.0);
	    // ensures we always have a list, regardless if above returns single item or list
	    var xs = [].concat(sample);
	    var n = xs.length;

	    for(var i=0;i<n;i++) {
	      var a = net.forward(xs[i]);
	      aavg.addFrom(a);
	    }
	    var preds = [];
	    for(var k=0;k<aavg.w.length;k++) { preds.push({k:k,p:aavg.w[k]}); }
	    preds.sort(function(a,b){return a.p<b.p ? 1:-1;});

	    preds[0].k;

	    return preds;    
	}

	var sample_test_instance = function(data_canvas) {

	    var limg_data = false;
	    var data_ctx  = data_canvas.getContext("2d");
	      
	      limg_data = data_ctx.getImageData(0, 0, 32, 32);

	      var p = limg_data.data;
	      var x = new convnetjs.Vol(32,32,3,0.0);
	      var W = 32*32;
	      var j=0;

	      for(var dc=0;dc<3;dc++) {
	        var i=0;
	        for(var xc=0;xc<32;xc++) {
	          for(var yc=0;yc<32;yc++) {
	            var ix = ( i) * 4 + dc;
	            x.set(yc,xc,dc,p[ix]/255.0-0.5);
	            i++;
	          }
	        }
	      }
	     
	      
	      var xs = [];
	      //xs.push(x, 32, 0, 0, false); // push an un-augmented copy
	      for(var k=0;k<number_of_iterations;k++)
	      {
	        var dx = Math.floor(Math.random()*5-2);
	        var dy = Math.floor(Math.random()*5-2);
	        xs.push(convnetjs.augment(x, 32, dx, dy, k>2));
	      }
	    
	     
	      return xs;
	     // x = convnetjs.augment(x, 32, dx, dy, Math.random()<0.5);
	      //var isval = use_validation_data && n%10===0 ? true : false;
	      //callback({x:x, label:training_data[bi]['gender'], isval:false});
	    
	    

	    
	}

	var video_loaded = false;
	var on_video_loaded = function(){
		
		video_loaded = true;
		load_from_json();
		show_dashboard_pannels();
		$('#loading_message_in_circle').html('');
	}

	var video_failed = false;
	var on_video_fail = function(){
		video_failed = true;
	}
	var total_seconds_viewed = 0;
	var times_none_count = 0;

	var latest_second = parseInt((new Date().getTime())/1000);

	var update_charts = function(gender, age){
		var current_second = parseInt((new Date().getTime())/1000);
		console.log(current_second);

		if(current_second == latest_second){
			var index = FemaleEngagement.length-1;
		}
		else{
			var index = FemaleEngagement.length;
		}
		latest_second = current_second;

		FemaleEngagement[index] = (FemaleEngagement[index] != undefined) ? 
									FemaleEngagement[index] :  
								  	(index == 0)? 
								  		0:
								  		parseFloat(parseFloat(FemaleEngagement[index-1]/2).toFixed(2));

		//FemaleEngagement[index] = parseFloat(FemaleEngagement[index]).toFixed(2);
		MaleEngagement[index] = (MaleEngagement[index] != undefined) ? 
									MaleEngagement[index] :  
								  	(index == 0)? 
								  		0:
								  		parseFloat(parseFloat(MaleEngagement[index-1]/2).toFixed(2));
		//MaleEngagement[index] = parseFloat(MaleEngagement[index]).toFixed(2);

		if(gender>=0){ 
			window[classes_txt[gender]+'Engagement'][index] = window[classes_txt[gender]+'Engagement'][index] + 0.1;
			window[classes_txt[gender]+'Count'] =  window[classes_txt[gender]+'Count'] + 1;
			window[classes_txt[gender]+'Ages'][age] =  window[classes_txt[gender]+'Ages'][age] + 1;

		}

		if(MaleEngagement.length > 20){
			MaleEngagement.splice(0,1);
			FemaleEngagement.splice(0,1);
		}

		//else{var incr = 0;}
		//console.log(window[classes_txt[gender]+'Engagement']);
		show_charts();
	}

	var update_right_pannel = function(number_of_viewers){
		if(number_of_viewers == 0){
			update_charts(-1,-1);	
		}
		if(number_of_viewers == 0 && times_none_count <7){
			times_none_count ++;
			return;
		}
		if(number_of_viewers == 0){
			total_seconds_viewed = 0;
			window['FemaleCount'] = 0.0001;
			window['MaleCount'] = 0.0001;
			$('#dashboard_gender_markers').hide('slow');
			$('#dashboard_gender').hide();
			$("#faces").html('Scanning for faces ...');

		}
		else{
			$('#dashboard_gender_markers').show('slow');
			$('#dashboard_gender').show();
		}
		times_none_count = 0;
		total_seconds_viewed = total_seconds_viewed + number_of_viewers*0.1;
		$('#current_viewers').html(number_of_viewers);
		$('#seconds_engaged').html(total_seconds_viewed.toFixed(total_seconds_viewed>0?1:0));

		

	};

	
	
	var f_listener = function(fdata, tr, tmp_canvas){

		
		if(!fdata.data[0] || fdata.data.length<=0){
			update_right_pannel(0);
		  return;
		}

		var cleared = false;
		var number_of_viewers = 0;

		for(var i=0; i<fdata.data.length; i++){

			if(fdata.data[i].confidence<-6) continue;
			//console.log(i+1);


			var new_cv = new BasicCanvasTEMP({
				width:fdata.data[i].width,
				height:fdata.data[i].height,
			});

			var new_cv2 = new BasicCanvasTEMP({
				width:96,
				height:96,
			});

			tmp_canvas.paste_to_canvas(
				new_cv.tmp_canvas,
				fdata.data[i].x-fdata.data[i].width*0.30,
				fdata.data[i].y-fdata.data[i].width*0.30,
				fdata.data[i].width+fdata.data[i].width*0.60,
				fdata.data[i].height+fdata.data[i].width*0.60,
				32,
				32
			); 



			tmp_canvas.paste_to_canvas(
				new_cv2.tmp_canvas,
				fdata.data[i].x-fdata.data[i].width*0.30,
				fdata.data[i].y-fdata.data[i].width*0.30,
				fdata.data[i].width+fdata.data[i].width*0.60,
				fdata.data[i].height+fdata.data[i].width*0.60,
				96,
				96
			); 

			var sample = sample_test_instance(new_cv.tmp_canvas);
			var fpreds = determine_features(sample,'face_net'); 
			var preds  = determine_features(sample,'net'); 
			var apreds = determine_features(sample,'age_net'); 
			//console.log(preds);
			if(fpreds[0].k == 1 || (fpreds[1].k == 1 &&  fpreds[1].p > .3) ){continue};
			number_of_viewers ++;
			show_more_stats();
			if(!cleared ) $("#faces").html(' ');
			cleared = true;
			/**
		<div class="dashboard_faces" >
			<div class="dashboard_face_image_frame">
				<div class="dashboard_face_image">

				</div>
			</div>
			<div class="dashboard_face_data ">
				Sex: Male<br/>
				Age: Adult
			</div>	
		</div>*/
			var div = document.createElement('div');
			div.className = 'dashboard_faces';

			var img_frame = document.createElement('div');
			img_frame.className = 'dashboard_face_image_frame';

			var img_div = document.createElement('div');
			img_div.className = 'dashboard_face_image';
			img_div.appendChild(new_cv2.tmp_canvas);
			img_frame.appendChild(img_div);

			div.appendChild(img_frame);

			var div2 = document.createElement('div');
			div2.className = 'dashboard_face_data';
			update_charts(preds[0].k,apreds[0].k);
			var s1 = classes_txt[preds[0].k];
			var s2 = age_classes_txt[apreds[0].k];
			t = '<div >Sex: '+s1+' </br>';
			t = t+'Age: '+s2+' </div> ';
			div2.innerHTML = t;

			div.appendChild(div2);
			
			
			

			$("#faces").append(div);

		 

		}

		

		update_right_pannel(number_of_viewers);


    
	}
	var get_faces = function(raw_data){
		var new_cv = new BasicCanvasTEMP({
			width:tr.width,
			height:tr.height,
		});

		tr.canvas_copy.paste_to_canvas(new_cv.tmp_canvas); 

		//tr.canvas_copy.copy_from_canvas(obj.memory_canvas.canvas,0,0,obj.width,obj.height);

		var msg = {
		  width:tr.width,
		  height:tr.height,
		  raw_data: raw_data,
		  //img_u8_greyscale: tr.img_u8_greyscale,
		  gaussian_bluring: true,
		  method: 'run_bff_face_detect',
		  //log_time: true

		};

	    var wt = new WorkerBasicTransforms(msg);
	    f_listener({data:wt.run_bff_face_detect()},tr, new_cv);
	}
    
	var on_transforms = function(raw_data)
    {	

    	throttled_bg();
    	throttled_face(raw_data);

    };

    hide_ini();
    ini_bg_canvas();
    var throttled_bg = _.throttle(update_bg, 100);
    var throttled_face = _.throttle(get_faces, 100);
    var tr = false;//VideoHelpers.load('#video_camera',640,480, on_transforms, on_video_loaded, on_video_fail);

    
    
    var load_interval = setInterval(
      function(){
        try{

        	if(
        		( !trained_face_l || trained_face_l == undefined) || 
        		( !trained_age  || trained_face_l == undefined) ||
        		( !trained_gender_l || trained_face_l == undefined) 
        	)
        	{
        		new UserException("InvalidMonthNo");
        		return;
        	}
          
          	if(!video_loaded){
          		tr = VideoHelpers.load('#video_camera',640,480, on_transforms, on_video_loaded, on_video_fail);
          		$('#loading_message_in_circle').html('(Please allow your webcam.)');
          	
          	}

          	if(video_failed){
          		$('#loading_message_in_circle').html('Sorry! You must use Google-Chrome');
          	}

          	window.clearInterval(load_interval);
          
        }
        catch(e){
          console.log(e);
          $('#neurons_ids').html(Math.floor(Math.random()*899+101));
        }
        
      },
      0
    );

	

}