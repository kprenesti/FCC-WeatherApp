$(document).ready(function() {
  $('.promptCity').hide();

  $('#country').change(function(){
    if($('#country option:selected').attr('value') !== 'US'){
      $('#states').hide();
    } else {
      $('#states').show();
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
    var req_url = "http://api.wunderground.com/api/11e9326259bb14c8/conditions/forecast/q/";
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
    var req_url = "http://api.wunderground.com/api/11e9326259bb14c8/conditions/forecast/q/";
    var req_params = position.coords.latitude + "," + position.coords.longitude;
    console.log(req_params);
    var json_req = encodeURI(req_url+req_params+".json");
    console.log(json_req);
    $.getJSON( json_req, recieveData);
  } //end getWeatherFromForm

  //Called from within getJSON
  function recieveData(data){
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
      forecast: data.forecast.txt_forecast.forecastday = [],
    }; //end kristaData
    fillInFields(kristaData);
    // console.log(kristaData);
  }

  //Called from within recieveData
  function fillInFields(kristaData){
    console.log(kristaData);
    var todayTemp, feelsLikeTemp, forecastText, i;
    var completeForecastDiv = "";
    // console.log(forecastArray);

      if($('input#unitSwitcher').is(':checked')){
        todayTemp = kristaData.temp.degC[0];
        feelsLikeTemp = kristaData.temp.degC[1];
        $('.degree').text('C');
      } else {
        todayTemp = kristaData.temp.degF[0];
        feelsLikeTemp = kristaData.temp.degF[1];
        $('.degree').text('F');
      }

    console.log(todayTemp, feelsLikeTemp, forecastText);
    $('.updated').html(kristaData.today.lastObserved);
    $('.cityName').text(kristaData.city + "'s ");
    $('#presently >.icon').attr('src',kristaData.today.url);
    $('.temp-actual').text(todayTemp);
    $('.condition').text(kristaData.today.weather);
    $('.temp-feelsLike').text(feelsLikeTemp);

    //-------Begin building Forecast section----------//

    for(i=0; i<kristaData.forecast.length; i+=2){
      if($('input#unitSwitcher').is(':checked')){
        forecastText = kristaData.forecast[i].fcttxt_metric;
      } else {
        forecastText = kristaData.forecast[i].fcttxt;
      }
      console.log(forecastText);
      completeForecastDiv += "<div class='dayHolder'><br>";
      completeForecastDiv += "<div class='AM'><br>";
      completeForecastDiv += "<h2 class='title'>"+kristaData.forecast[i].title+"</h2>";
      completeForecastDiv += "<img src='"+ kristaData.forecast[i].icon_url +"' alt='"+ kristaData.forecast[i].icon +"'><br>";
      completeForecastDiv += "<p class='weatherDesc'>"+forecastText+"</p>";
      completeForecastDiv += "</div><!--end AM day"+i+"-->";
    } //end for loop
    return $('#forecastHolder').html(completeForecastDiv);
  } //end buildForecast

}); //end ready
