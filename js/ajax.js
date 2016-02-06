$(document).ready(function() {
  $('.promptCity').hide();

  $('#country').change(function(){
    if($('#country option:selected').attr('value') == 'US'){
      $('#states').show();
    } else {
      $('#states').hide();
    }
  })

  $('#weather_status_form').submit(function(event){
    getWeatherFromForm();
    event.preventDefault();
    // alert('It works!');
  }); //end submit form

  geolocation();

  //called from within Ready
  function geolocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(getWeatherFromGeo); //end geolocation lookup
    } else {
      $('.promptCity').show();
    } //end if geolocation
  } //end geolocation

  //Called from within Ready and SubmitForm
  function getWeatherFromForm(){
    console.log('-------------------');
    var req_url = "https://api.wunderground.com/api/11e9326259bb14c8/conditions/forecast/q/";
    var req_params, city, state, country;
    if($('#country option:selected').attr('value') === 'US'){
      if($('#location').val() !== '' && $('#states option:selected').attr('value') !== 'Nope'){
        state = $('#states option:selected').attr('value');
        city = $('#location').val();
        req_params = state + "/" + city;
      } else if ($('#location').val() !== '' && $('#states option:selected').attr('value') === 'Nope') {
        req_params = city;
        console.log("No state was selected");
      }
    } else {
      country = $('#country option:selected').attr('value');
      city = $('#location').val();
      req_params = country +"/"+city;
    }
    var json_req = encodeURI(req_url+req_params+".json");
    console.log(json_req);
    $.getJSON( json_req, recieveData);
  } //end getWeatherFromForm

  //Called from within Ready
  function getWeatherFromGeo(position){
    // console.log(position);
    console.log('-------------------');
    //$("#forecastHolder").hide();
    var req_url = "https://api.wunderground.com/api/11e9326259bb14c8/conditions/forecast/q/";
    var req_params = position.coords.latitude + "," + position.coords.longitude;
    console.log(req_params);
    var json_req = encodeURI(req_url+req_params+".json");
    console.log(json_req);
    $.getJSON( json_req, recieveData);
  } //end getWeatherFromForm

  //Called from within getJSON
  function recieveData(data){
    if(data.error){
      console.log(data.error.description);
    }
    // console.log(data);
    var kristaData = {
      city: data.current_observation.display_location.full,
      temp: {
        degF:[data.current_observation.temp_f,data.current_observation.feelslike_f],
        degC:[data.current_observation.temp_c,data.current_observation.feelslike_c],
      },
      today: {
        lastObserved: data.current_observation.observation_time,
        icon: data.current_observation.icon,
        url: data.current_observation.icon_url,
        weather: data.current_observation.weather
      },
      forecast: data.forecast.txt_forecast.forecastday,
    }; //end kristaData
    fillInFields(kristaData);
    setBackgroundImage(kristaData);
    buildForecast(kristaData);
    // console.log(kristaData);
  }

  //Called from within recieveData
  function fillInFields(kristaData){
    var todayTemp, feelsLikeTemp;
    // console.log(forecastArray);

    if($('input#unitSwitcher').is(':checked')){
      todayTemp = Math.round(kristaData.temp.degC[0]);
      feelsLikeTemp = Math.round(kristaData.temp.degC[1]);
      $('.degree').text('C');
    } else {
      todayTemp = Math.round(kristaData.temp.degF[0]);
      feelsLikeTemp = Math.round(kristaData.temp.degF[1]);
      $('.degree').text('F');
    }

    console.log(todayTemp, feelsLikeTemp);
    $('.updated').html(kristaData.today.lastObserved);
    $('.cityName').text(kristaData.city + "'s ");
    $('#presently >.icon').attr('src',kristaData.today.url);
    $('.temp-actual').text(todayTemp);
    $('.condition').text(kristaData.today.weather);
    $('.temp-feelsLike').text(feelsLikeTemp);
  } //end fillInFields

  function buildForecast(kristaData){
    var completeForecastDiv = "";
    var Forecast = kristaData['forecast'];
    var dayForecastText, nightForecastText;
    for(i = 0; i < Forecast.length; i += 2){
      console.log(Forecast);
      if($('input#unitSwitcher').is(':checked')){
        dayForecastText = Forecast[i].fcttext_metric;
        nightForecastText = Forecast[i+1].fcttext_metric
      } else {
        dayForecastText = Forecast[i].fcttext;
        nightForecastText = Forecast[i+1].fcttext;
      }
      console.log(dayForecastText, nightForecastText);
      completeForecastDiv += "<div class='dayHolder'>";
      completeForecastDiv += "<div class='AM'>";
      completeForecastDiv += "<h2 class='title'>"+Forecast[i].title+"</h2>";
      completeForecastDiv += "<img class='icon' src='"+ Forecast[i].icon_url +"' alt='"+ Forecast[i].icon +"'>";
      completeForecastDiv += "<p class='weatherDesc'>" + dayForecastText + "</p>";
      completeForecastDiv += "</div><!--end AM day"+i+"-->";
      completeForecastDiv += "<div class='PM'>";
      completeForecastDiv += "<h2 class='title'>"+Forecast[i+1].title+"</h2>";
      completeForecastDiv += "<img class='icon' src='"+ Forecast[i+1].icon_url +"' alt='"+ Forecast[i+1].icon +"'>";
      completeForecastDiv += "<p class='weatherDesc'>" + nightForecastText + "</p>";
      completeForecastDiv += "</div><!--end PM night"+i+"-->";
      completeForecastDiv += "</div><!--end dayHolder-->";
    } //end for loop
    return $('#forecastHolder').html(completeForecastDiv);
  } //end buildForecast


  function setBackgroundImage(kristaData) {
    var weather = kristaData.today.weather;
    if(weather.indexOf('Drizzle') !== -1 || weather.indexOf('Rain') !== -1|| weather.indexOf('Thunderstorms') !== -1 || weather.indexOf('Spray') !== -1 || weather.indexOf('Precipitation') !== -1){
      $('.bodywrap').css('background-image', 'url("http://newallpaper.net/wp-content/uploads/2015/04/ef9f528564810c7760a5e0828dd0a396-storms-rain-window-glass-reflection-abstract-bokeh-wallpaper.jpg")');
    } else if(weather.indexOf('Snow') !== -1 || weather.indexOf('Ice') !== -1){
      $('.bodywrap').css('background-image', 'url("http://mysalesbriefcase.com/wp-content/uploads/2015/01/snow-day-5.jpg")');
      // $('*').css('color', '');
    } else if(weather.indexOf('Cloud') !== -1|| weather.indexOf('Cloudy')!== -1 || weather.indexOf('Overcast')!== -1){
      $('.bodywrap').css('background-image', 'url("https://c1.staticflickr.com/7/6023/5975465375_9c089b6085_b.jpg")');
    } else if(weather.indexOf('Mist') !== -1 || weather.indexOf('Fog') !== -1 || weather.indexOf('Haze') !== -1){
      $('.bodywrap').css('background-image', 'url("https://upload.wikimedia.org/wikipedia/commons/1/13/Flickr_-_don_macauley_-_Misty_Landscape.jpg")');
    } else {
      $('.bodywrap').css('background-image', 'url("https://upload.wikimedia.org/wikipedia/commons/1/16/Appearance_of_sky_for_weather_forecast,_Dhaka,_Bangladesh.JPG")');
    }
  } //end setBackgroundImage function
}); //end ready
