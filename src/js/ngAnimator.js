(function() {

	'use strict';
	$ = jQuery;

	angular
	.module('uberApp')
	.factory('ngAnimator', ngAnimator);

	ngAnimator.$inject = ['ngMapFactory']
	function ngAnimator(ngMapFactory){
		var options = ngMapFactory.getOptions();

		var service = {
			animateTrip: animateTrip
		};
		return service;

		function animateTrip(trip){
			var out = false; // set out animation to false

			animateIn(trip.car); // animate car in

			// start animation
			Snap.animate(0, trip.pathLength, function(step) {
				// if the trip is past 95% complete trigger 1 animate out
				if(step >= trip.outPercentage && out == false){
					animateOut(trip.car);
					out = true; // set to true so that the animateOut function does not loop
				}
				var moveToPoint = Snap.path.getPointAtLength( trip.path, step );
				var x = moveToPoint.x - options.size; // circle starts top left corner, this offsets so that they are centered
				var y = moveToPoint.y - options.size;
				trip.car.transform('translate(' + x + ',' + y + ')');
			}, trip.speed, mina.easeInOutSine, function(){
				// When everything is done, loop the trip animation
				animateTrip(trip);
			});		
		}

		function animateIn(car){
			car.animate({r: options.size}, 350, mina.easeInOutSine);
		}

		function animateOut(car){
			car.animate({r: 0}, 350, mina.easeInOutSine);
		}

	}

	console.log('ngMapFactory.js init');

})();