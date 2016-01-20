$(document).ready(function(){

  var theDate = new Date()
  var dateDisplay = theDate.toDateString;
  var month = theDate.getMonth();
    if(month < 3 || month >= 10){
      $('.bodywrap').css('background-image', 'url("images/winter.jpg")');
    } else if (month >=2 && month <= 4){
      $('.bodywrap').css('background-image', 'url("images/spring.jpg")');
    } else if (month >= 5 && month <= 9){
      $('.bodywrap').css('background-image', 'url("images/summer.jpg")');
    } else {
      $('.bodywrap').css('background-image', 'url("images/fall.jpg")');
    }



















}); //end ready
