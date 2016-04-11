(function() {

	'use strict';
	$ = jQuery;

	angular
	.module('uberApp')
	.directive('ngMap', ngMap);

	ngMap.$inject = ['ngMapFactory', 'ngAnimator'];
	function ngMap(ngMapFactory, ngAnimator){
		var directive = {
			restrict: 'A',
			link: linkFunc, 
			controller: ctrlFunc
		};

		function linkFunc(scope, element, attrs){
			ngMapFactory.init().then(function(data){
				scope.trips = data;
				angular.forEach(scope.trips, function(trip, key) {
					if(trip.path){
						ngAnimator.animateTrip(trip);
					}
				});
			});
		}

		function ctrlFunc($scope, $element){
			$element.on('click', function(){
				$('.trips').toggle();
			})
		}

		return directive;
	}

	console.log('ngMap.js init');

})();