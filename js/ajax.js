$(document).ready(function() {
  beginCallNow();
  function beginCallNow(){
      var latitude, longitude;
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(Position){
          latitude = Position.coords.latitude;
          longitude = Position.coords.longitude;
          console.log('latitude: ' + latitude, 'longitude: '+ longitude);

          ajaxWithGeo(latitude, longitude);
        });
      } else {
        $('.bodywrap').prepend('Please enter a zipcode or City Name for current weather information.');
      }
  } //end beginCallNow

  function ajaxWithGeo(latitude, longitude){
    $.ajax({
      url: "http://api.openweathermap.org/data/2.5/forecast?units=imperial",
      method: "get",
      data: {
        APPID: "f07943ab2e5d89848ac5de98ea9d55f2",
        lat: latitude,
        lon: longitude
      },
      dataType: "json",
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


}) //end ready
