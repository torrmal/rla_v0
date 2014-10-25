Template.demo3.rendered = function(){

	var VideoObject = new VideoInit('#video_test',640,480);

  	//640w/480h
  	
  	var tr = false;//new VideoBasicTransforms(VideoObject);
  	window.net = false;
  	window.face_net = false;
  	var number_of_iterations = 3;
  	var classes_txt = [
		  'kid',
		  'young',
		  'adult',
		  'older-adult'
	];

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
	var load_from_json = function() {
	  
	  var json = trained_age;
	  //console.log(json);
	  net = new convnetjs.Net();
	  face_net = new convnetjs.Net();
	  net.fromJSON(json);
	  face_net.fromJSON(trained_face_l);

	}

  	var sample_test_instance = function(data_canvas) {

		var limg_data	= false;
		var data_ctx	= data_canvas.getContext("2d");
	    
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
	    
	    //return [x];
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

  	var f_listener = function(fdata, tr, tmp_canvas){

		//console.log(fdata);
		//console.log(fdata.data);
		if(!fdata.data[0] || fdata.data.length<=0){
			return;
		}
		
		var cleared = false;
		
		
		

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
				32); 

			

			tmp_canvas.paste_to_canvas(
				new_cv2.tmp_canvas,
				fdata.data[i].x-fdata.data[i].width*0.30,
				fdata.data[i].y-fdata.data[i].width*0.30,
				fdata.data[i].width+fdata.data[i].width*0.60,
				fdata.data[i].height+fdata.data[i].width*0.60,
				96,
				96); 
			
			var sample = sample_test_instance(new_cv.tmp_canvas);
			var fpreds = determine_features(sample,'face_net'); 
			var preds = determine_features(sample,'net'); 

			console.log(preds);
			if(fpreds[0].k == 1 || (fpreds[1].k == 1 &&  fpreds[1].p > .3) ){continue};
			if(!cleared ) $("#faces").html(' ');
			cleared = true;
			var div = document.createElement('div');
			var t_element = document.createElement('div');
			div.className = 'probsdiv';;
	 
			var img_div = document.createElement('div');

			img_div.className = 'demo2imgdiv';
			var s1 = classes_txt[preds[0].k];
			t = '<div> Age group: '+s1+' </div>';
			div.innerHTML = t;
			
			img_div.appendChild(new_cv2.tmp_canvas);

			$(t_element).append(div);
			$(t_element).prepend(img_div);
			
			$("#faces").append(t_element);

			/**
			new_cv2.tmp_canvas.toBlob(
		        function (blob) {
		            // Do something with the blob object,
		            // e.g. creating a multipart form for file uploads:
		            //var formData = new FormData();
		            //formData.append('file', blob, fileName);
		            console.log('ok...');
		            var d = new Date();
					var n = d.getTime();
		            Meteor.saveFile(blob, n+'.png');
		            
		        },
		        'image/png'
		    );**/

			/**
			if(fpreds[0].k == 0 ){continue};

			if(!cleared ) $("#faces").html(' ');
			cleared = true;
			
			new_cv2.tmp_canvas.toBlob(
		        function (blob) {
		            // Do something with the blob object,
		            // e.g. creating a multipart form for file uploads:
		            //var formData = new FormData();
		            //formData.append('file', blob, fileName);
		            console.log('ok...');
		            var d = new Date();
					var n = d.getTime();
		            Meteor.saveFile(blob, n+'.png');
		            
		        },
		        'image/png'
		    );
			
			tmp_canvas = false;
			var t_element = document.createElement('div');

			var n = number_of_iterations;
			var div = document.createElement('div');
			div.className = 'testdiv';
	 
	 		//TODO: Check this part out
			// draw the image into a canvas
			//draw_activations_COLOR(div, xs[0], 2); // draw Vol into canv

			// add predictions
			var probsdiv = document.createElement('div');
			div.className = 'probsdiv';
			var t = '';
			var nlimit = 1;//classes_txt.length > 3 ? 3: classes_txt.length;
			var s = {'Male':0,'Female':0,'none':0};
			var agd = {};
			var ag_1 = false;
			var s_1 = false;

			var sp = classes_txt[preds[k].k];
			/**
			for(var k=0;k<classes_txt.length;k++) {
				var sp = classes_txt[preds[k].k];
		
				if(k == 0){
					ag_1 = sp[1];
					s1 = sp[0];
				}
				s[sp[0]] =  s[sp[0]] + (preds[k].p/n*100);
				agd[sp[1]] = (agd[sp[1]]||0) + (preds[k].p/n*100);
				//a[sp[0]] = s[sp[0]] ? preds[k].p/n*100 : s[sp[0]] + preds[k].p/n*100;
				//preds[k].k
				//preds[k].p
			}
			console.log(s);
			**/
			/**
			for(var k=0;k<nlimit;k++) {
				//console.log(k);
				//console.log(preds);
				var col = k<3 ? 'rgb(85,187,85)' : 'rgb(187,85,85)';

				//t += '<div class=\"pp\" style=\"width:' + Math.floor(preds[k].p/n*100) + 'px; margin-left: 70px; background-color:' + col + ';\">' + classes_txt[preds[k].k] + '</div>'
			}
			var gender = s['Male'] > s['Female'] ? 'Male' : 'Female';
			t += '<div> Gender: '+s1+' </div>';
			t += '<table>';
			for(var j in agd) { 
				t += '<tr><td> '+j+' </td><td width="100px;"> <div style="display:block;left:0px;width:'+parseInt(agd[j])+'px;background-color:green"> . </div> </td></tr>';
			}
			t += '<table>';
			probsdiv.innerHTML = t;
			div.appendChild(probsdiv);

			var img_div = document.createElement('div');
			img_div.className = 'demo2imgdiv';
		
			img_div.appendChild(new_cv2.tmp_canvas);

			$(t_element).append(div);
			$(t_element).prepend(img_div);
			
			$("#faces").append(t_element);

			**/

		}
		//$('#face_marker').transition({x:fdata.data[0].x, y:fdata.data[0].y, width:fdata.data[0].width, height: fdata.data[0].width},20);
		//block_box
	}

  	var on_transforms = function(raw_data)
  	{

  		var new_cv = new BasicCanvasTEMP({
				width:tr.width,
				height:tr.height,
			});

  		tr.canvas_copy.paste_to_canvas(
				new_cv.tmp_canvas); 

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

  	var load_video = function(){
  		var youtubeId = "0pT5MZCe8AY";
		YoutubeVideo(youtubeId, function(video){
		  console.log(video.title);
		  var webm = video.getSource("video/webm", "medium");
		  console.log("WebM: " + webm.url);
		  var mp4 = video.getSource("video/mp4", "medium");
		  console.log("MP4: " + mp4.url);

		  $("#webm_video").attr("src", webm.url);
		});
  	}

  	var train_interval = setInterval(
  		function(){
  			try{
  				if(trained_face_l == true) true;
  				load_video();
  				$('#faces').html('<h1>Done! ...</h1> (Dont forget to enable your webcam.)');
  				load_from_json();
  				trained_l = false;
  				window.clearInterval(train_interval);
  				tr = new VideoBasicTransforms(VideoObject);
  				tr.on_transforms = on_transforms;
  			}
  			catch(e){
  				console.log(e);
  				$('#faces').html('<h1>Loading Neurons ...'+Math.floor(Math.random()*899+101)+'</h1> (This may take a while)');
  			}
  			
  		},
  		0
  	);
  	
}