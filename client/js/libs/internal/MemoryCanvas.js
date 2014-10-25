
window.MemoryCanvas = function(copy_from, frequency, width, height){

	
	
	width = (width == undefined) ? copy_from.width : width;

	height = (height == undefined) ? copy_from.height : height;
    
    var obj = this;

    obj.updated = function(){};



    obj.update = function()
    {	
    	obj.context.drawImage(copy_from, 0, 0, width, height);
    	obj.updated();
    }

    obj.start = function(){
    	if(frequency != undefined){
	    	
	    	obj.interval = window.setInterval(obj.update, frequency);
	    }
        else{
            obj.update();
        }
    }

    obj.stop = function(){
    	window.clearInterval(obj.interval);
    }

    obj.draw_in_div = function(element){
    	
    	element.html(obj.canvas);
    }

    obj.draw_in_canvas_context = function(element,element_context){
    	element_context.drawImage(obj.context, 0, 0, element.width, element.height);
    	
    }

    obj.update_canvas_with = function(new_canvas){
    	obj.canvas = new_canvas;
    	width = new_canvas.width;
    	height = new_canvas.height;
    	obj.context = obj.canvas.getContext("2d");
    }

    obj.getContext = function(){
        return obj.context;
    }

    
    var tmp_canvas = document.createElement("canvas");
    tmp_canvas.width = width;
    tmp_canvas.height = height;

    // in memory canvas (supposed to be faster)
    obj.update_canvas_with(tmp_canvas);

    // delete the temp one
    tmp_canvas = null;

    

    obj.update();

    obj.start();

    return obj;
    
}