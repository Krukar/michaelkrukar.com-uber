(function() {

	'use strict';
	$ = jQuery;

	angular
	.module('uberApp')
	.factory('ngMapFactory', ngMapFactory);

	ngMapFactory.$inject = ['$http'];
	function ngMapFactory($http){
		var options = {
			map: Snap('#ngMap'),
			cars: Snap('#cars'),
			size: 20,
			hover: 50,
			speed: 0.8,
			ui: {
				heatmap: false,
				streets: true
			}
		};

		var service = {
			getTrips: getTrips, 
			getOptions: getOptions,
			setActive: setActive
		};
		return service;
		
		function getTrips(){
			var promise = $http.get('/data/data.json').then(function(response) {
				var trips = {};

				angular.forEach(response.data, function(value, key) {
					trips[value.date] = value;

					trips[value.date].car = options.cars.circle(options.size, options.size, 0).attr({
						id: value.date,
						class: 'car'
					});

					trips[value.date].pathLength = Snap.path.getTotalLength(value.path); // calc path length
					trips[value.date].outPercentage = Math.round(trips[value.date].pathLength * 0.95); // calc percentage on when to animate out


					// time length is the minutes converted to seconds with a multiplier to make it faster/slow
					// notes: if the trip took 12 minutes, it will animate in 12 seconds * whatever the offset is so that the animations are smoother
					trips[value.date].timeLength = (getMinutes(value.time) * 1000) * options.speed;

				});
				return trips;
			});
			return promise;
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