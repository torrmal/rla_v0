Members = new Meteor.Collection("members");

Router.map( function () {
  this.route('home2', {
    // get parameter via this.params
    path: '/next',
    action: function() {  window.location = '/home/index.html';}
  });
  this.route('home', {
    // get parameter via this.params
    path: '/'
  });
  this.route('demo');
  this.route('demo2');
  //this.route('device');
  this.route('monitor');
  this.route('demo4',{
     
    waitOn: function(){
        return [
          IRLibLoader.load('/youtube-video.js'),
          IRLibLoader.load('/trainerd_class_gender_89_fast.js'),
          IRLibLoader.load('/trainerd_class_face.js')
        ]
    }
  });
  this.route('dashboard',{
     
    waitOn: function(){
        return [
          IRLibLoader.load('/Chart.min.js'),
          IRLibLoader.load('/trainerd_class_gender_89_fast.js'),
          IRLibLoader.load('/trainerd_class_age.js'),
          IRLibLoader.load('/trainerd_class_face.js')
        ]
    }
  });
  this.route('dashboard2',{
    path: '/device',
    waitOn: function(){
        return [
          IRLibLoader.load('/Chart.min.js'),
          IRLibLoader.load('/trainerd_class_gender_89_fast.js'),
          IRLibLoader.load('/trainerd_class_age.js'),
          IRLibLoader.load('/trainerd_class_face.js')
        ]
    }
  });
  this.route('demo3',{
   
    waitOn: function(){
        return [
          IRLibLoader.load('/youtube-video.js'),
          IRLibLoader.load('/trainerd_class_age.js'),
          IRLibLoader.load('/trainerd_class_face.js')
        ]
    }
  });
});



$( document ).ready(function() {

  
});



    
    

    


