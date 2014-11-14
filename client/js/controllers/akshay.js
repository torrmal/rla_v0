Template.akshay.rendered = function() {

    var canvas = document.getElementById('canvasID'),
        ctx = canvas.getContext('2d'),
        rect = {},
        drag = false;

    taggedFace = {};
    taggedFaces = [];

    selected = false;
    selectRect = {};

    canvasActive = false;

    var background = new Image();

    function init(imgname) {

        background.src = "/files/untagged/" + imgname.toString();
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
            canvasActive = true;
        }

        canvas.addEventListener('mousedown', mouseDown, false);
        canvas.addEventListener('mouseup', mouseUp, false);
        canvas.addEventListener('mousemove', mouseMove, false);
        canvas.addEventListener('dblclick', dblclick, false);
    }

    $( document ).keydown(function() {
      if( selected ) {

        for (f = 0; f < taggedFaces.length; f++) {
          if( selectRect.X == taggedFaces[f].X &&
              selectRect.Y == taggedFaces[f].Y &&
              selectRect.W == taggedFaces[f].W &&
              selectRect.H == taggedFaces[f].H )
          {
            taggedFaces.splice(f,1);
            resetSelect();
            break;
          }
        }

        draw();
      }
    });

    function resetSelect() {
        selected = false;
        selectRect.X = 0;
        selectRect.Y = 0;
        selectRect.W = 0;
        selectRect.H = 0;
    }

    function mouseDown(e) {
        resetSelect();
        rect.startX = e.pageX - this.offsetLeft;
        rect.startY = e.pageY - this.offsetTop;
        drag = true;
    }

    function mouseUp() {
        drag = false;
    }

    function mouseMove(e) {
        if (drag && canvasActive) {
            rect.w = (e.pageX - this.offsetLeft) - rect.startX;
            rect.h = (e.pageY - this.offsetTop) - rect.startY;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            draw();
        }
    }

    function dblclick(e) {
        ptX = e.pageX - this.offsetLeft;
        ptY = e.pageY - this.offsetTop;

        for (f = 0; f < taggedFaces.length; f++) {
            if( ptX >= (taggedFaces[f].X * scale) &&
                ptX <= (taggedFaces[f].X * scale + taggedFaces[f].W * scale) &&
                ptY >= (taggedFaces[f].Y * scale) &&
                ptY <= (taggedFaces[f].Y * scale + taggedFaces[f].H * scale) )
            {
                drawRect(ctx,"#FF0000", taggedFaces[f].X * scale,
                                        taggedFaces[f].Y * scale,
                                        taggedFaces[f].W * scale,
                                        taggedFaces[f].H * scale);
                drawSelect(ctx,"#FF0000", taggedFaces[f].X * scale,
                                          taggedFaces[f].Y * scale,
                                          taggedFaces[f].W * scale,
                                          taggedFaces[f].H * scale, 8);
                selected = true;
                selectRect.X = taggedFaces[f].X;
                selectRect.Y = taggedFaces[f].Y;
                selectRect.W = taggedFaces[f].W;
                selectRect.H = taggedFaces[f].H;
                break;
            }
        }
    }

    function drawRect(ctx,colorStr,X,Y,W,H) {
        ctx.strokeStyle = colorStr;
        ctx.strokeRect( Math.round( X ) ,
                        Math.round( Y ) ,
                        Math.round( W ) ,
                        Math.round( H ) );
    }

    function drawSelect(ctx,colorStr,X,Y,W,H,B) {
        ctx.fillStyle = colorStr;
        ctx.fillRect( X,         Y,         B, B);
        ctx.fillRect( X + W - B, Y,         B, B);
        ctx.fillRect( X,         Y + H - B, B, B);
        ctx.fillRect( X + W - B, Y + H - B, B, B);
    }

    function draw() {
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.drawImage(background, 0, 0, displayWidth, displayHeight);

        for (f = 0; f < taggedFaces.length; f++) {
            drawRect(ctx,"#FF0000", taggedFaces[f].X * scale,
                                    taggedFaces[f].Y * scale,
                                    taggedFaces[f].W * scale,
                                    taggedFaces[f].H * scale);
        }

        if (rect.w != 0 && rect.h != 0) {
            drawRect(ctx,"#00FF00", rect.startX, rect.startY, rect.w, rect.h);
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
            ethnicity: $('input[name=ethnicity]:checked', '#tagOut').val(),
            facehair: $('input[name=facehair]:checked', '#tagOut').val(),
            readglasses: $('input[name=readglasses]:checked', '#tagOut').val(),
            sunglasses: $('input[name=sunglasses]:checked', '#tagOut').val(),
            hairtype: $('input[name=hairtype]:checked', '#tagOut').val(),
            hairstyle: $('input[name=hairstyle]:checked', '#tagOut').val(),
            hat: $('input[name=hat]:checked', '#tagOut').val()
        });

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
          canvasActive = false;
          // Clear tagged faces
          taggedFaces = [];
          // Clear background image
          background.src = "";
        }
    });

    //init();
}



Akshay = {

};
