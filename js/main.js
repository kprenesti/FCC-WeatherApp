$(document).ready(function(){
  var theDate = new Date()
  var dateDisplay = theDate.toDateString;
  var location = "";
  askForGeoloc();

  function askForGeoloc(){
    var latitude, longitude;
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(Position){
        latitude = Position.coords.latitude;
        longitude = Position.coords.longitude;
        var query = latitude + ',' + longitude;
        console.log(query);
        ajaxRequest(query);
      });
    } else {
      $('.promptCity').css('display', 'block');
    }
  } //end beginCallNow

  $('#subForm').click(function(){
    var cityName = $('#city').val();
    if(cityName.indexOf(/\s/g !== -1)){
      cityName.replace(/\s/g, "_");
    } else if(cityName.indexOf(/[^A-z\s]/g) !== -1){
      cityName.replace(/[^A-z\s]/g, "");
    }
    console.log(cityName);
    var query = $('#states').val() + "\/" + cityName;

  }); //end form click

  //Weather Underground KeyID: 11e9326259bb14c8
  function ajaxRequest(query){
    $.ajax({
      url: "http://api.wunderground.com/api/11e9326259bb14c8/conditions/forecast/geolookup/q/" + query + ".json",
      method: "get",
      data: {
        units: auto,
      },
      success: function(response){
        var imageSource = "http://icons.wxug.com/i/c/i/" + response.current_observation.icon + ".gif";
        console.log(response.current_observation.display_location.full);
        $('.cityName').html(response.current_observation.display_location.full + '\'s');
        $('#weatherNow .icon').attr('src', imageSource);
        $('span.unit').html($('#myform input[name=units]:checked').val());
        $('#weatherNow .currentDegrees').html(data.list[0].main.temp);
        },
      }).fail(function(){
        $('#todaysWeather').html("<h2>Weather information is currently unavailable.  Please try again later</h2>");
      }); //end .ajax;
    } //end ajaxWithGeo

}); //end ready
