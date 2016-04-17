(function() {

	'use strict';
	$ = jQuery;

	angular
	.module('uberApp')
	.factory('ngMapFactory', ngMapFactory);

	ngMapFactory.$inject = ['$http'];
	function ngMapFactory($http){
		var data;

		var options = {
			map: Snap('#ngMap'),
			cars: Snap('#cars'),
			size: 20,
			hover: 50,
			speed: 0.8,
			heatmap: true
		};

		var service = {
			init: init, 
			getOptions: getOptions,
			setActive: setActive
		};
		return service;
		
		function init(){
			// Note: Not sure if this is the correct way. I've created an init function that grabs my json, creates a data object and handles all the math
			// It does seem weird that i only call it once but there's a !data at the top for an if else
			if(!data){
				var promise = $http.get('/data/data.json').then(function(response) {
					data = response.data;

					angular.forEach(data, function(value, key) {
						// Add a car
						data[key].car = options.cars.circle(options.size, options.size, 0).attr({
							id: value.date,
							class: 'car'
						});

						data[key].pathLength = Snap.path.getTotalLength(data[key].path); // calc path length
						data[key].outPercentage = Math.round(data[key].pathLength * 0.95); // calc percentage on when to animate out

						// time length is the minutes converted to seconds with a multiplier to make it faster/slow
						// notes: if the trip took 12 minutes, it will animate in 12 seconds * whatever the offset is so that the animations are smoother
						data[key].timeLength = (getMinutes(data[key].time) * 1000) * options.speed;

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
			return options;
		}

		function setActive(trip){
			options.active = trip;
		}

		function getMinutes(time){
			var regex = new RegExp('^(.{1,2}):(.{1,2}):(.{1,2})').exec(time);
			var minutes = (parseInt(regex[1]) * 60) + parseInt(regex[2]);
			return minutes;
		}

	}

	console.log('ngMapFactory.js init');

})();