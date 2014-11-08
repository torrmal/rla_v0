Template.akshay.rendered = function() {

    var canvas = document.getElementById('canvasID'),
        ctx = canvas.getContext('2d'),
        rect = {},
        drag = false;

    taggedFace = {};
    taggedFaces = [];

    var background = new Image();

    function init() {
        //background.src = "http://www.fmwconcepts.com/misc_tests/spraypaint/lena.jpg";
        //background.src = "http://upload.wikimedia.org/wikipedia/en/2/24/Lenna.png";
        //background.src = "/images/widthlong.jpg";
        //background.src = "/images/heightlong.jpg";
        background.src = "/training_images~/untagged/213a13bdf757144d2e0a8057be0426cc.png";

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
            //canvas.width / 2 - background.width / 2,
            //canvas.height / 2 - background.height / 2);
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
        for (f = 0; f < taggedFaces.length; f++) {
            ctx.strokeRect(taggedFaces[f].X, taggedFaces[f].Y,
                taggedFaces[f].W, taggedFaces[f].H);
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
            facehair: $('input[name=facehair]:checked', '#tagOut').val(),
            glasses: $('input[name=glasses]:checked', '#tagOut').val(),
            hairtype: $('input[name=hairtype]:checked', '#tagOut').val(),
            hairstyle: $('input[name=hairstyle]:checked', '#tagOut').val(),
            makeup: $('input[name=makeup]:checked', '#tagOut').val(),
            skincolor: $('input[name=skincolor]:checked', '#tagOut').val(),
            hat: $('input[name=hat]:checked', '#tagOut').val()
        });

        rect.startX = 0;
        rect.startY = 0;
        rect.w = 0;
        rect.h = 0;

        draw();

    });


    $('#doneID').click(function(e) {
        console.log('tagged');
        metaDataImage.insert(taggedFaces);
        // Update teh database with the tags
    });

    init();
}



Akshay = {

};
