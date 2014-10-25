var set_main_menu_links = function(){
  var tmp = function(tid){
    
    return function(){ 
            
            $('body,html').animate(
              {
                scrollTop: (parseInt($('#'+tid).position().top)-65)+'px'

              }, 
              2000
            );



      }
  }
  for(var i in Menu_items){
    $('#'+Menu_items[i].id+'_link').click( tmp(Menu_items[i].id) );
  }
}



Template.top_div.height = '70px';
Template.one_liner_parallax.top = function(){ return Template.top_div.height; };

Template.top_div.menu_items = function () {
    return Menu_items;
};


Template.parallax.scrolled = false;
var runned =  false;

Template.home.events(
  { 
    'click #start': function(){
      if(!runned){
          runned = true;
          Street_Facing_View('#main_street_view');
      }

    },
    'click #join_real_button': function()
    {
      var name = $('#person_name').val();
      if(!name){
        $('#person_name_i').addClass('has-error');
      }
      else
      {
        $('#person_name_i').removeClass('has-error'); 
      }
      var company = $('#company_name').val();
      if(!company){
        $('#company_name_i').addClass('has-error');
      }
      else
      {
        $('#company_name_i').removeClass('has-error'); 
      }
      var email = $('#email').val();
      if(!validateEmail(email)){
        
        email = false;
      }

      if(!email){
        $('#email_i').addClass('has-error');
      }
      else
      {
        $('#email_i').removeClass('has-error'); 
      }

      if(!name || !company ||!email){
        
        return;
      }
      Members.insert( {name:name,company:company,email:email} );
      $('#join_form').html('Thank you '+name+'!, we will contact you very soon.');
      
    }
  }
); 





Template.parallax.items = function(){

  
  var ret = parallax_items;
  for(var i in ret){
    
    // Calculate the top values for he parallaxes
    ret[i].parallax_top = (i==0)? '0': (parseInt(ret[i-1].parallax_top)+parseInt(ret[i-1].parallax_height) ) + '%';
    // Add template to render in parallax
    ret[i].template = get_dynamic_template( ret[i].parallax_template, ret[i] );
  }

  return ret;
}



Template.home.rendered = function(){
    set_main_menu_links();

    $('#inputCanvas').hide();
    
    var height = $(document).scrollTop();
    
    var height2 = $('#tryit').position().top-100;
    
   
    if(height>10){
        $('#product_banner').hide('slow');
        $('.parallax_items').css('background-color','white');
      }

      Street_Facing_View('#main_street_view');

    $(document).scroll(function() {

      var height = $(document).scrollTop();

       

      if(height> height2){
        if(!runned){
            runned = true;
            var videoInput = $('#inputVideo')[0];
            var canvasInput = $('#inputCanvas')[0];
            var htracker = new headtrackr.Tracker({calcAngles:true,ui_target:$('#legend')});
                htracker.init(videoInput, canvasInput);
                var loaded = htracker.start();
                if(!loaded){
                   $('#legend').html('You must use either GoogleChrome or Firefox to try this');

                }
            
        }
      }
      if(height<10){
        $('#product_banner').show('slow');
        Template.parallax.scrolled = false;
        //$('.parallax_items').css('background-color','black');
      }

      else if(!Template.parallax.scrolled){
        $('#product_banner').hide('slow');
        Template.parallax.scrolled = true;
        //$('.parallax_items').css('background-color','white');//.animate({'background-color':'#ffffff'},2000);
      }

    });


}