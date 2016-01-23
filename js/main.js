$(document).ready(function(){
  var theDate = new Date()
  var dateDisplay = theDate.toDateString;
  var location = "";
  beginCallNow();

function beginCallNow(){
    var latitude, longitude;
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(Position){
        latitude = Position.coords.latitude;
        longitude = Position.coords.longitude;
        var query = latitude + ',' + longitude;
        ajaxRequest(query);
      });
    } else {
      $('.promptCity').css('display', 'block');
    }
} //end beginCallNow


//Weather Underground KeyID: 11e9326259bb14c8
function ajaxRequest(query){
  $.ajax({
    url: "http://api.wunderground.com/api/11e9326259bb14c8/conditions/forecast/geolookup/q/" + query + ".json",
    method: "get",
    data: {
      units: auto,
    },
    success: function(data){
      var imageSource = 'http://openweathermap.org/img/w/' + data.list[0].weather[0].icon + '.png';
      console.log(imageSource);
      $('.cityName').html(data.city.name + '\'s');
      $('#weatherNow .icon').attr('src', imageSource);
      $('span.unit').html($('#myform input[name=units]:checked').val());
      $('#weatherNow .currentDegrees').html(data.list[0].main.temp);
      },
    }); //end .ajax;
  } //end ajaxWithGeo
}); //end ready
