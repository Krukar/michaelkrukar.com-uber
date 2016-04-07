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
			// This acts as my init
			ngMapFactory.getData().then(function(data){
				// ngAnimator.initTrip(6);
				angular.forEach(data, function(value, key) {
					ngAnimator.initTrip(value.id);
				});
			});

		}

		function ctrlFunc($scope, $element){
		}

		return directive;
	}

	console.log('ngMap.js init');

})();