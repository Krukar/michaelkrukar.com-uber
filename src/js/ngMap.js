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
			ngMapFactory.getTrips().then(function(data){
				scope.trips = data;

				angular.forEach(scope.trips, function(trip) {
					if(trip.path){
						ngAnimator.initTrip(trip);
					}
				});

			});
		}

		function ctrlFunc($scope, $element){
			$scope.options = ngMapFactory.getOptions();
		}

		return directive;
	}

	console.log('ngMap.js init');

})();