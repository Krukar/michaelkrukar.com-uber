(function() {

	'use strict';
	$ = jQuery;

	angular
	.module('uberApp')
	.factory('ngAnimator', ngAnimator);

	ngAnimator.$inject = ['ngMapFactory', '$timeout']
	function ngAnimator(ngMapFactory, $timeout){
		var options = ngMapFactory.getOptions();

		var hovered, highlight;

		var service = {
			initTrip: initTrip
		};
		return service;

		function initTrip(trip){
			var element = $(trip.car.node);

			animate(trip);

			element.on('mouseenter', function(){
				hover(trip);
			});
		}

		// Animations
		function animate(trip){
			var out = false;

			animateIn(trip.car);			
			// start animation
			Snap.animate(0, trip.pathLength, function(step) {
				// if the trip is past 95% complete trigger 1 animate out
				if(step > trip.outPercentage && out === false){
					out = true;
					animateOut(trip.car);
				}
				var moveToPoint = Snap.path.getPointAtLength( trip.path, step );
				var x = moveToPoint.x - options.size; // circle starts top left corner, this offsets so that they are centered
				var y = moveToPoint.y - options.size;
				trip.car.transform('translate(' + x + ',' + y + ')');
			}, trip.timeLength, mina.easeInOutSine, function(){
				// When everything is done, loop the trip animation
				animate(trip);
			});		
		}

		function animateIn(car){
			car.animate({r: options.size}, 350, mina.easeInOutSine);
		}

		function animateOut(car){
			car.animate({r: 0}, 350, mina.easeInOutSine);
		}

		// Events
		function hover(trip){
			if(hovered){
				unhover();
			}
			hovered = trip.car;
			trip.car.animate({r: options.hover}, 350, mina.easeInOutSine);

			$timeout(function() {
				if(hovered === trip.car){
					unhover();
				}
			}, 3000);
		}

		function unhover(){
			hovered.animate({r: options.size}, 350, mina.easeInOutSine);
		}

	}

	console.log('ngMapFactory.js init');

})();