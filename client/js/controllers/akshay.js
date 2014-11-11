Template.akshay.rendered = function() {

    var canvas = document.getElementById('canvasID'),
        ctx = canvas.getContext('2d'),
        rect = {},
        drag = false;

    taggedFace = {};
    taggedFaces = [];

    var background = new Image();

    function init(imgname) {

        background.src = "/training_images~/untagged/" + imgname.toString();
        //console.log(background.src);

        scale = 1;
        displayWidth = 0;
        displayHeight = 0;

        background.onload = function() {

            if (background.width > background.height) {
                if (background.width > 640)
                    scale = 640 / background.width;
            } else {
                if (background.height > 480)
                    scale = 480 / background.height;
            }

            displayWidth = background.width * scale;
            displayHeight = background.height * scale;

            ctx.drawImage(background, 0, 0, displayWidth, displayHeight);

        }

        canvas.addEventListener('mousedown', mouseDown, false);
        canvas.addEventListener('mouseup', mouseUp, false);
        canvas.addEventListener('mousemove', mouseMove, false);
    }

    function mouseDown(e) {
        rect.startX = e.pageX - this.offsetLeft;
        rect.startY = e.pageY - this.offsetTop;
        drag = true;
    }

    function mouseUp() {
        drag = false;
    }

    function mouseMove(e) {
        if (drag) {
            rect.w = (e.pageX - this.offsetLeft) - rect.startX;
            rect.h = (e.pageY - this.offsetTop) - rect.startY;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            draw();
        }
    }

    function draw() {
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.drawImage(background, 0, 0, displayWidth, displayHeight);

        ctx.strokeStyle = "#FF0000";
        console.log( taggedFaces.length );
        for (f = 0; f < taggedFaces.length; f++) {
            ctx.strokeRect( Math.round( taggedFaces[f].X * scale) ,
                            Math.round( taggedFaces[f].Y * scale) ,
                            Math.round( taggedFaces[f].W * scale) ,
                            Math.round( taggedFaces[f].H * scale) );
        }

        if (rect.w != 0 && rect.h != 0) {
            ctx.strokeStyle = "#00FF00";
            ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
        }

        rectDisplay = "";
        if (rect.w < 0)
            taggedFace.X = Math.round((rect.startX + rect.w) / scale);
        else
            taggedFace.X = Math.round(rect.startX / scale);

        if (rect.h < 0)
            taggedFace.Y = Math.round((rect.startY + rect.h) / scale);
        else
            taggedFace.Y = Math.round(rect.startY / scale);

        taggedFace.W = Math.round(Math.abs(rect.w / scale));
        taggedFace.H = Math.round(Math.abs(rect.h / scale));

        document.getElementById("rectco").innerHTML = rectDisplay;
    }

    function resetTags() {
      // Clear rect
      rect.startX = 0;
      rect.startY = 0;
      rect.w = 0;
      rect.h = 0;

      // Clear the form
      document.getElementById("tagOut").reset();
      document.getElementById("range").innerHTML=0;
    }

    $('#loadID').click(function(e) {

      console.log('Loading Image ...');
      console.log('Load Button : ' + metaDataImage.find().count() );
      imgDoc = metaDataImage.findOne({tagged:false});
      init(imgDoc.name);
      resetTags();

    });

    $('#tagID').click(function(e) {

        rectDisplay =
            taggedFace.X.toString() + " " +
            taggedFace.Y.toString() + " " +
            taggedFace.W.toString() + " " +
            taggedFace.H.toString();

        taggedFaces.push({
            X: taggedFace.X,
            Y: taggedFace.Y,
            W: taggedFace.W,
            H: taggedFace.H,
            sex: $('input[name=sex]:checked', '#tagOut').val(),
            age: $('input[name=age]').val(),
            facehair: $('input[name=facehair]:checked', '#tagOut').val(),
            glasses: $('input[name=glasses]:checked', '#tagOut').val(),
            hairtype: $('input[name=hairtype]:checked', '#tagOut').val(),
            hairstyle: $('input[name=hairstyle]:checked', '#tagOut').val(),
            makeup: $('input[name=makeup]:checked', '#tagOut').val(),
            skincolor: $('input[name=skincolor]:checked', '#tagOut').val(),
            hat: $('input[name=hat]:checked', '#tagOut').val()
        });

        console.log( taggedFaces );

        resetTags();

        draw();

    });


    $('#doneID').click(function(e) {

        if(  confirm('Are you done tagging the image?') )
        {
          console.log('tagged');

          metaDataImage.update({
            _id: imgDoc._id
          }, {
            $set: {
              tagged: true,
              tags: taggedFaces
            }
          });

          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // Clear tagged faces
          taggedFaces = [];
        }
    });

    //init();
}



Akshay = {

};
