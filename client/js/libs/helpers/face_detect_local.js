window.Street_Facing_View = function( el ) {

        var count = 0;
        var last_count = 0;
        var count2 = 2;
        var counter =  false;
        this.handleHeadMovement = function(currentPov, e){

            // Get the amount the head moved left/right and up/down relative to the camera
            var head_x = e.originalEvent.x;
            var head_y = e.originalEvent.y / 2;

            //console.log(e.originalEvent.more.a);
            //console.log(e.originalEvent.more.d);
            // Calculate a new heading and pitch
            var new_heading = Math.max(-20, Math.min(currentPov/*.heading*/ - head_x, 20));
            var new_angle = (e.originalEvent.more.a*(180/Math.PI)-90);
            console.log(new_angle);
            var new_pitch = 0;//currentPov/*.pitch*/ - head_y;

            /**
            var newPov = {
                heading: new_heading,
                pitch: new_pitch,
                zoom: 1
            };
            console.log(new_heading);**/
            if( current_ad == '0'){


              var canvas = document.getElementById('faceCanvas');
              var context = canvas.getContext('2d');
              var imageObj = document.getElementById('inputCanvas');



              context.drawImage(imageObj,  e.originalEvent.more.x-(e.originalEvent.more.w/2), e.originalEvent.more.y-(e.originalEvent.more.h/2), e.originalEvent.more.w,e.originalEvent.more.h, 0, 0, 122, 137); 
              
             
              /**
              $("#faceCanvas").transition({
                perspective: '300px',
                rotateY: (new_angle)+'deg',
                
                
              },20);**/
              // translate context to center of canvas
            
            }
            else{
              $("#nemo_video").transition({
                perspective: '300px',
                rotateY: (new_heading)+'deg',
                rotateX: (-new_pitch)+'deg',
                x: head_x*2,
              },20);
            }
            //inputCanvas
            //$("#nemo_video").stop();
            

            

            //alert(new_pitch);
   

            //this.panorama.setPov(newPov);



        }



        //alert(el);
        /**var starting_loc = new google.maps.LatLng(40.7574, -73.9857); // Set a default - On Park Ave in NYC
        

        var panoramaOptions = {
            position: starting_loc,
            pov: { heading: 180, pitch: 0, zoom: 1 },
            scrollwheel: false, zoomControl: false, panControl: false, linksControl: false, addressControl: false
        };**/

            
                
          
        //this.panorama = new google.maps.StreetViewPanorama($(el)[0], panoramaOptions);
        //this.panorama.setVisible(true);

        // Throttle the calling of the handler for head movement events to once every 20ms
        var throttled_update = _.throttle(this.handleHeadMovement, 20);
        var pov = 0;//this.panorama.pov;

        var angle = 0;
        var angle_delta = 0;
        var current_ad = 1;
        
        var prev_state = 'on_view';

        $(document).on('headtrackingEvent', 
          function(e){
            
         
            //console.log(count);
            angle_delta = Math.abs(angle - e.originalEvent.more.a);
            angle = e.originalEvent.more.a;
            this.callit = function(){

                    var curr_state;
                    //console.log(angle_delta);
                    if( angle_delta >1){
                      $('#keep_calm').show();
                      
                      curr_state = 'no_view';
                      
                    }
                    else{
                      
                      curr_state = 'on_view';
                      count2++;
                      $('#legend').html('Seconds engaged: '+count2+'s<br>Ammount billed: $'+(Math.round(count2*0.004*1000)/1000));
                      $('#keep_calm').hide();
                    }
                    
                    
                    if(curr_state!=prev_state && curr_state =='on_view'){
                      
                      $('#add_'+current_ad).hide();
                      if(current_ad == 0){
                        current_ad =1;
                      }
                      else{
                        current_ad =0;
                      }
                      $('#add_'+current_ad).show();
                      
                    }
                    prev_state = curr_state;

                  };
            if(!counter){
                  counter = true;
                  setInterval(this.callit,1000);
              
            }
            

            
            
            throttled_update(pov, e);
        }
      );

                
            

        

      
}