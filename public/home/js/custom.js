$('#affixThis').affix({
      offset: {
        top: $('#outside-nav').height()
      }
});

$("#myNav div ul li a[href^='#']").on('click', function(e) {

   // prevent default anchor click behavior
   e.preventDefault();

   // store hash
   var hash = this.hash;

   // animate
   $('html, body').animate({
       scrollTop: $(this.hash).offset().top
     }, 400, function(){

       // when done, add hash to url
       // (default click behaviour)
       window.location.hash = hash;
     });

});

$("#adamBlur").hover(
  function() {
    $("#infoAdam").fadeIn();
  }, function() {
    $("#infoAdam").fadeOut();
  });

$("#jorgeBlur").hover(
  function() {
    $("#infoJorge").fadeIn();
  }, function() {
    $("#infoJorge").fadeOut();
  });

$("#robertBlur").hover(
  function() {
    $("#infoRobert").fadeIn();
  }, function() {
    $("#infoRobert").fadeOut();
  });