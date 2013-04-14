function JSONP_LocalWeather(callback) {
	var url = 'http://api.worldweatheronline.com/free/v1/weather.ashx?q=Brisbane&format=json&extra=localObsTime&num_of_days=3&key=zj39ybnp7pr6f7r559wj887d';
	jsonP(url, callback);
}

// Helper Method
function jsonP(url, callback) {
	$.ajax({
		type: 'GET',
		url: url,
		async: false,
		contentType: "application/json",
		jsonpCallback: callback,
		dataType: 'jsonp',
		success: function (json) {
		    console.dir('success');
		},
		error: function (e) {
		    console.log(e.message);
		}
	});
}

function GetLocalWeather() {
	var localWeatherInput = {
		callback: 'LocalWeatherCallback'
	};
	JSONP_LocalWeather('LocalWeatherCallback');
}
function LocalWeatherCallback(localWeather) {

	var skycons = new Skycons({"color": '#333'});

	var forecastGroups = {

		// These 4 are used for the today block
		clearDay: ["113"],
		clearNight: ["113"],
		cloudyDay: ["116","119","122"],
		cloudyNight: ["116","119","122"],
		// This is used for tomorrow and the day after block
		cloudy: ["116","119","122"],
		// and everything else
		rain: ["176","185","200","263","314","311","308","305","302","299","296","293","284","281","266","359","356","353","389","386"],
		sleet: ["182","320","317","365","362"],
		snow: ["179","227","230","350","338","335","332","329","326","323","377","374","371","368","389","386"],
		fog: ["143","260","248"],

		skyconType: function(weatherCode,target,when){

			if(when=="today"){
				if(obsTime.getHours()<=16){
					if(jQuery.inArray(weatherCode, this.clearDay)>=0) {
						skycons.add(target, Skycons.CLEAR_DAY);
					} else if(jQuery.inArray(weatherCode, this.cloudyDay)>=0) {
						skycons.add(target, Skycons.PARTLY_CLOUDY_DAY);
					} else if(jQuery.inArray(weatherCode, this.cloudy)>=0) {
						skycons.add(target, Skycons.CLOUDY);
					} else if(jQuery.inArray(weatherCode, this.rain)>=0) {
						skycons.add(target, Skycons.RAIN);
					} else if(jQuery.inArray(weatherCode, this.sleet)>=0) {
						skycons.add(target, Skycons.SLEET);
					} else if(jQuery.inArray(weatherCode, this.snow)>=0) {
						skycons.add(target, Skycons.SNOW);
					} else if(jQuery.inArray(weatherCode, this.fog)>=0) {
						skycons.add(target, Skycons.FOG);
					}
				}	
				if(obsTime.getHours()>=17){
					if(jQuery.inArray(weatherCode, this.clearNight)>=0) {
						skycons.add(target, Skycons.CLEAR_NIGHT);
					} else if(jQuery.inArray(weatherCode, this.cloudyNight)>=0) {
						skycons.add(target, Skycons.PARTLY_CLOUDY_NIGHT);
					} else if(jQuery.inArray(weatherCode, this.cloudy)>=0) {
						skycons.add(target, Skycons.CLOUDY);
					} else if(jQuery.inArray(weatherCode, this.rain)>=0) {
						skycons.add(target, Skycons.RAIN);
					} else if(jQuery.inArray(weatherCode, this.sleet)>=0) {
						skycons.add(target, Skycons.SLEET);
					} else if(jQuery.inArray(weatherCode, this.snow)>=0) {
						skycons.add(target, Skycons.SNOW);
					} else if(jQuery.inArray(weatherCode, this.fog)>=0) {
						skycons.add(target, Skycons.FOG);
					}
				}	
			}
			if(jQuery.inArray(weatherCode, this.cloudy)>=0) {
				skycons.add(target, Skycons.CLOUDY);
			} else if(jQuery.inArray(weatherCode, this.rain)>=0) {
				skycons.add(target, Skycons.RAIN);
			} else if(jQuery.inArray(weatherCode, this.sleet)>=0) {
				skycons.add(target, Skycons.SLEET);
			} else if(jQuery.inArray(weatherCode, this.snow)>=0) {
				skycons.add(target, Skycons.SNOW);
			} else if(jQuery.inArray(weatherCode, this.fog)>=0) {
				skycons.add(target, Skycons.FOG);
			} else {
				skycons.add(target, Skycons.CLEAR_DAY);
			}
		}
	}

	var time = localWeather.data.current_condition[0].localObsDateTime;
	var obsTime = new Date(time);
	var obsHour = obsTime.getHours();
	var	obsMeridiem = "AM";
	if(obsHour>=13){
		obsHour = obsHour-12;
		obsMeridiem = "PM";
	};
	var obsMin = obsTime.getMinutes();

	var weatherObject = {
		today: function(forecast,temp,time,weatherCode){
			$('#weather-container .weather-today .desc').html(forecast);
			$('#weather-container .weather-today .temp').html(temp);
			$('#weather-container .weather-today .time-now').html("As of "+obsHour+":"+obsMin+""+obsMeridiem);
			forecastGroups.skyconType(weatherCode,'today-skycon',"today");
		},
		tomorrow: function(tempMin,tempMax,forecast,weatherCode){
			$('#weather-container .weather-tomorrow .desc').html(forecast);
			$('#weather-container .weather-tomorrow .temp-min').html(tempMin);
			$('#weather-container .weather-tomorrow .temp-max').html(tempMax);
			forecastGroups.skyconType(weatherCode,'tomorrow-skycon',"tomorrow");
		},
		dayAfter: function(tempMin,tempMax,forecast,weatherCode){
			$('#weather-container .weather-dayafter .desc').html(forecast);
			$('#weather-container .weather-dayafter .temp-min').html(tempMin);
			$('#weather-container .weather-dayafter .temp-max').html(tempMax);
			forecastGroups.skyconType(weatherCode,'dayafter-skycon',"dayAfter");
		}
	}

	weatherObject.today (
		localWeather.data.current_condition[0].weatherDesc[0].value,
		localWeather.data.current_condition[0].temp_C,
		localWeather.data.current_condition[0].localObsDateTime,
		localWeather.data.current_condition[0].weatherCode
	);
	weatherObject.tomorrow (
		localWeather.data.weather[1].tempMinC,
		localWeather.data.weather[1].tempMaxC,
		localWeather.data.weather[1].weatherDesc[0].value,
		localWeather.data.weather[1].weatherCode
	);
	weatherObject.dayAfter (
		localWeather.data.weather[2].tempMinC,
		localWeather.data.weather[2].tempMaxC,
		localWeather.data.weather[2].weatherDesc[0].value,
		localWeather.data.weather[2].weatherCode
	);

	skycons.play();
					$(".desc").slabText({
					"viewportBreakpoint":380
				});

}