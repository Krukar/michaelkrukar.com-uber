(function() {

	'use strict';
	$ = jQuery;

	angular
	.module('uberApp')
	.directive('ngMap', ngMap)
	.factory('ngMapFactory', ngMapFactory);

	ngMap.$inject = ['ngMapFactory'];
	function ngMap(ngMapFactory){
		var directive = {
			restrict: 'A',
			link: linkFunc, 
			controller: ctrlFunc
		};

		function linkFunc(scope, element, attrs){
			ngMapFactory.getData().then(function(data){
				// Test a single trip
				//ngMapFactory.animateTrip(data[4].path);
				angular.forEach(data, function(value, key) {
  					ngMapFactory.animateTrip(value.path);
  					console.log(value)
				});
			});
		}

		function ctrlFunc($scope){
		}

		return directive;
	}

	ngMapFactory.$inject = ['$http'];
	function ngMapFactory($http){
		var map = Snap('#uber');
		var carSize = 20;

		var service = {
			getData: getData,
			animateIn: animateIn,
			animateOut: animateOut,
			animateTrip: animateTrip
		};
		return service;

		function getData(){
			var promise = $http.get('/data/trips.json').then(function(response) {
				return response.data;
			});
			return promise;
		}

		function animateIn(car){
		}

		function animateOut(car){
		}

		function animateTrip(path){
			var car = map.circle(carSize, carSize, 0).attr({
				fill: 'blue',
				stroke: 'none',
				r: '20'
			});

			var pathLength = Snap.path.getTotalLength(path);
			var outPerc = Math.round(pathLength * 0.95);
			var speed = pathLength * 5;

			// animateIn(car);
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