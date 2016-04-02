(function() {

	'use strict';
	$ = jQuery;

	angular
	.module('uberApp')
	.directive('ngMap', ngMap)
	.directive('ngData', ngData)
	.factory('ngMapFactory', ngMapFactory)
	.factory('ngAnimator', ngAnimator);

	ngMap.$inject = ['ngMapFactory', 'ngAnimator'];
	function ngMap(ngMapFactory, ngAnimator){
		var directive = {
			restrict: 'A',
			link: linkFunc, 
			controller: ctrlFunc
		};

		function linkFunc(scope, element, attrs){
			ngMapFactory.getData().then(function(data){
				ngAnimator.animateTrip(data[4].path);

				// Run all trips
				// angular.forEach(data, function(value, key) {
  					// ngAnimator.animateTrip(value.path);
				// });
		});
		}

		function ctrlFunc($scope){
		}

		return directive;
	}

	ngData.$inject = ['ngMapFactory'];
	function ngData(ngMapFactory){
		var directive = {
			restrict: 'A',
			link: linkFunc, 
			controller: ctrlFunc
		};

		function linkFunc(scope, element, attrs){
			console.log(ngMapFactory)
			ngMapFactory.getData().then(function(data){
				console.log(data);
				scope.total_cost = ngMapFactory.calculate_total_cost(data);
				scope.total_distance = ngMapFactory.calculate_total_distance(data);
				scope.total_time = ngMapFactory.calculate_total_time(data);
				scope.average_cost_km = ngMapFactory.calculate_average_cost_km(scope.total_cost, scope.total_distance);
				scope.average_cost_minute = ngMapFactory.calculate_average_cost_minute(scope.total_cost, scope.total_time);
			});
		}

		function ctrlFunc($scope){
		}

		return directive;
	}

	ngMapFactory.$inject = ['$http'];
	function ngMapFactory($http){
		var service = {
			getData: getData,
			calculate_average_cost_km: calculate_average_cost_km,
			calculate_average_cost_minute: calculate_average_cost_minute,
			calculate_total_cost: calculate_total_cost,
			calculate_total_distance: calculate_total_distance,
			calculate_total_time: calculate_total_time
		};
		return service;

		function getData(){
			var promise = $http.get('/data/trips.json').then(function(response) {
				return response.data;
			});
			return promise;
		}

		function calculate_total_cost(data){
			var total_cost = 0;
			angular.forEach(data, function(value, key){
				total_cost = total_cost + value.total;
			});
			return total_cost;
		}

		function calculate_total_distance(data){
			var total_distance = 0;
			angular.forEach(data, function(value, key){
				total_distance = total_distance + value.km;
			});
			return Math.round(total_distance * 100) / 100;
		}

		function calculate_total_time(data){
			var total_minutes = 0;
			var total_hours = 0;
			angular.forEach(data, function(value, key){
				total_minutes = total_minutes + parseInt(value.tripTime.slice(3, 5));
				total_hours = total_hours + parseInt(value.tripTime.slice(0, 2));
			});
			return total_hours + (total_minutes / 60);
		}

		function calculate_average_cost_km(cost, distance){
			return Math.round((cost/distance) * 100) / 100;
		}

		function calculate_average_cost_minute(cost, time){
			return Math.round((cost/(time * 60)) * 100) / 100;
		}
	}

	function ngAnimator(){
		var map = Snap('#uber');
		var carSize = 20;

		var service = {
			animateTrip: animateTrip
		};
		return service;

		function animateTrip(path){
			var car = map.circle(carSize, carSize, 0).attr({
				fill: 'blue',
				stroke: 'none',
				r: '20'
			});

			var pathLength = Snap.path.getTotalLength(path);
			var outPerc = Math.round(pathLength * 0.95);
			var speed = pathLength * 5;

			Snap.animate(0, pathLength, function(step) {
				var moveToPoint = Snap.path.getPointAtLength( path, step );
				var x = moveToPoint.x - carSize;
				var y = moveToPoint.y - carSize;
				car.transform('translate(' + x + ',' + y + ')');
			}, speed, mina.easeInOutSine, function(){
			});		
		}
	}

	console.log('ngMap.js init');

})();