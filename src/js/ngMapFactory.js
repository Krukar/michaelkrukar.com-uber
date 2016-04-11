(function() {

	'use strict';
	$ = jQuery;

	angular
	.module('uberApp')
	.factory('ngMapFactory', ngMapFactory);

	ngMapFactory.$inject = ['$http'];
	function ngMapFactory($http){
		var data;

		var service = {
			init: init,
			getOptions: getOptions
		};
		return service;
		
		function init(){
			// Note: Not sure if this is the correct way. I've created an init function that grabs my json, creates a data object and handles all the math
			if(!data){
				var promise = $http.get('/data/data.json').then(function(response) {
					data = response.data;
					var options = getOptions();

					angular.forEach(data, function(value, key) {
						// Add a car
						data[key].car = options.map.circle(options.size, options.size, 0).attr({
							id: value.date,
							class: 'car'
						});
						data[key].pathLength = Snap.path.getTotalLength(data[key].path); // calc path length
						data[key].outPercentage = Math.round(data[key].pathLength * 0.95); // calc percentage on when to animate out
						// 10 minute trip takes 10 seconds to animate augmented by whatever our multiplier is
						data[key].speed = (getMinutes(data[key].time) * 1000) * options.speed;
					});

					return data;
				});
				return promise;
			}
			else{
				return data;
			}
		}

		function getOptions(){
			var options = {
				map: Snap('#ngMap'),
				size: 20,
				speed: 0.8
			};
			return options;
		}

		function getMinutes(time){
			var regex = new RegExp('^(.{1,2}):(.{1,2}):(.{1,2})').exec(time);
			var minutes = (parseInt(regex[1]) * 60) + parseInt(regex[2]);
			return minutes;
		}

	}

	console.log('ngMapFactory.js init');

})();