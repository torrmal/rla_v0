window.get_dynamic_template = function(template_name,data)
{
	return {name:template_name,data:data};
  return function(){return new Handlebars.SafeString(UI.toHTML(Template[template_name].extend({data: function () { return data; }})));}
  
}

window.validateEmail = function(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 