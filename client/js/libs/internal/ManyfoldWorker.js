
window.ManyfoldWorker = function(url, number_of_threads, listener){

	var obj  = this;

	var init = function()
	{
		obj.threads = [];
		obj.current_t = -1;
		obj.number_of_threads = number_of_threads;
		obj.add_new_thread();
	}

	obj.add_new_thread = function()
	{
		var tmp_thread = new Worker(url);

		var build_listener = function(thread_index, listener_c)
		{
			return function(data)
			{
				obj.threads[thread_index].bussy = false;
				return listener_c(data);
			}
		}

		
		var index = obj.threads.push(tmp_thread) - 1;

		obj.threads[index].addEventListener('message', build_listener(index,listener) , false);

		return index;
	}

	obj.postMessage = function(msg)
	{
		

		obj.current_t ++;
		//console.log('current thread:'+obj.current_t);
		if(obj.current_t >= obj.threads.length){
			obj.current_t = 0;
		}
		if(obj.threads[obj.current_t].bussy){
			if(obj.threads.length<obj.number_of_threads){
				obj.add_new_thread();
			}
			return;
		}  

		obj.threads[obj.current_t].bussy = true;
		obj.threads[obj.current_t].postMessage(msg);
	}

	init();

	return obj;



}