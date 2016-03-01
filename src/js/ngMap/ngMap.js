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
				angular.forEach(data, function(value, key){
					ngMapFactory.animateTrip(value.path);
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
		var carSize = 10;

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
			car.animate({r: carSize}, 250, mina.easeInOutSine);
		}

		function animateOut(car){
			car.animate({r: 0}, 250, mina.easeInOutSine);	
		}

		function animateTrip(path){
			var car = map.circle(carSize, carSize, 0).attr({
				fill: '#4D868E',
				stroke: 'none'
			});

			var out = false;

			var pathLength = Snap.path.getTotalLength(path);
			var outPerc = Math.round(pathLength * 0.9);
			var speed = pathLength * 5;

			animateIn(car);
			Snap.animate(0, pathLength, function(step) {
				if(step >= outPerc && out == false){
					animateOut(car);
					out = true;
				}
				var moveToPoint = Snap.path.getPointAtLength( path, step );
				var x = moveToPoint.x - carSize;
				var y= moveToPoint.y - carSize;
				car.transform('translate(' + x + ',' + y + ')');
			}, speed, mina.easeInOutSine, function(){
				animateOut(car);
				animateTrip(path);
			});		

		}
	}

	console.log('ngMap.js init');

})();