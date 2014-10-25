Template.demo.rendered = function(){
    

    // initialize the head tracker
    var videoInput = $('#inputVideo')[0];
    var Inputcanvas = $('#inputCanvas')[0];
    var canvas = $('#caney_canvas')[0];

    var htracker = new headtrackr.Tracker({calcAngles:true,ui_target:$('#legend')});
    htracker.init(videoInput, Inputcanvas);
    var loaded = htracker.start();

    if(!loaded){
       $('#legend').html('You must use either GoogleChrome or Firefox to try this.');
    
    }

    var gui,options,ctx,canvasWidth,canvasHeight;
    var img_u8;

    var demo_opt = function(){
        this.blur_radius = 4;
        this.low_threshold = 10;
        this.high_threshold = 10;
    }


    function demo_app() {
        //canvasWidth  = canvas.width();
        //canvasHeight = canvas.height();
        ctx = canvas.getContext('2d');

        ctx.fillStyle = "rgb(0,255,0)";
        ctx.strokeStyle = "rgb(0,255,0)";

        img_u8 = new jsfeat.matrix_t(640, 480, jsfeat.U8C1_t);

        options = new demo_opt();
       
    }

    demo_app();

    $(document).on('headtrackingEvent', 
    function(e){

            //console.log(e.originalEvent);
            var nwidth = parseInt(e.originalEvent.more.h*640/320);
            var newx = parseInt(e.originalEvent.more.x*640/320 - nwidth/2);
            var newy = parseInt(e.originalEvent.more.y*480/240 - nwidth/2);
            // Get the amount the head moved left/right and up/down relative to the camera
           

            //console.log(e.originalEvent.more.a);
            //console.log(e.originalEvent.more.d);
            // Calculate a new heading and pitch
            console.log(e.originalEvent.more);
            var new_angle = (e.originalEvent.more.a-1.57)*(180/Math.PI)*2;
            //console.log(new_angle);
            


            $('#face_marker').stop();
            $('#face_marker').transition({x:newx, y:newy, width: nwidth, height: nwidth},5);
            $('#degrees').html(parseInt(new_angle));
            $('#orientation').transition({
                perspective: '300px',
                //rotateY: (new_heading)+'deg',
                rotateY: (-new_angle)+'deg',
                //x: head_x*2,
              },5);

            function tick() {
                
                    ctx.drawImage(Inputcanvas, 0, 0, 640, 480);
                    var imageData = ctx.getImageData(0, 0, 640, 480);

                    
                    jsfeat.imgproc.grayscale(imageData.data, img_u8.data);
                    
                    

                    var r = options.blur_radius|0;
                    var kernel_size = (r+1) << 1;

                    
                    jsfeat.imgproc.gaussian_blur(img_u8, img_u8, kernel_size, 0);
                    
                    jsfeat.imgproc.canny(img_u8, img_u8, options.low_threshold|0, options.high_threshold|0);
                    

                    // render result back to canvas
                    var data_u32 = new Uint32Array(imageData.data.buffer);
                    var alpha = 0x0;//(0x0a << 24); // black;
                    var i = img_u8.cols*img_u8.rows, pix = 0;
                    while(--i >= 0) {
                        pix = img_u8.data[i] << 4;
                        pix = pix ^ 0xb0afff;
                        data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;

                        // red
                        //  data_u32[i] = 255 - data_u32[i];
                          // green
                        //  data_u32[i + 1] = 255 - data_u32[i + 1];
                          // blue
                        //  data_u32[i + 2] = 255 - data_u32[i + 2];
                    }
                    
                    

                    ctx.putImageData(imageData, 0, 0);

                    //$('#log').html(stat.log());
                
            }

            tick();
    });

    /*
    
    var video = document.getElementById('webcam');
    var canvas = document.getElementById('canvas');
    

    var gui,options,ctx,canvasWidth,canvasHeight;
    var img_u8;

    var demo_opt = function(){
        this.blur_radius = 2;
        this.low_threshold = 20;
        this.high_threshold = 50;
    }

    function demo_app() {
        canvasWidth  = canvas.width;
        canvasHeight = canvas.height;
        ctx = canvas.getContext('2d');

        ctx.fillStyle = "rgb(0,255,0)";
        ctx.strokeStyle = "rgb(0,255,0)";

        img_u8 = new jsfeat.matrix_t(640, 480, jsfeat.U8C1_t);

        options = new demo_opt();
        gui = new dat.GUI();

        gui.add(options, 'blur_radius', 0, 4).step(1);
        gui.add(options, 'low_threshold', 1, 127).step(1);
        gui.add(options, 'high_threshold', 1, 127).step(1);

        stat.add("grayscale");
        stat.add("gauss blur");
        stat.add("canny edge");
    }

    function tick() {
        compatibility.requestAnimationFrame(tick);
        stat.new_frame();
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            ctx.drawImage(video, 0, 0, 640, 480);
            var imageData = ctx.getImageData(0, 0, 640, 480);

            stat.start("grayscale");
            jsfeat.imgproc.grayscale(imageData.data, img_u8.data);
            stat.stop("grayscale");

            var r = options.blur_radius|0;
            var kernel_size = (r+1) << 1;

            stat.start("gauss blur");
            jsfeat.imgproc.gaussian_blur(img_u8, img_u8, kernel_size, 0);
            stat.stop("gauss blur");

            stat.start("canny edge");
            jsfeat.imgproc.canny(img_u8, img_u8, options.low_threshold|0, options.high_threshold|0);
            stat.stop("canny edge");

            // render result back to canvas
            var data_u32 = new Uint32Array(imageData.data.buffer);
            var alpha = (0xff << 24);
            var i = img_u8.cols*img_u8.rows, pix = 0;
            while(--i >= 0) {
                pix = img_u8.data[i];
                data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;
            }
            
            ctx.putImageData(imageData, 0, 0);

            $('#log').html(stat.log());
        }
    }
    */
   

}