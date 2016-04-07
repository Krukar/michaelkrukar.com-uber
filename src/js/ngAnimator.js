(function() {

	'use strict';
	$ = jQuery;

	angular
	.module('uberApp')
	.factory('ngAnimator', ngAnimator);

	ngAnimator.$inject = ['ngMapFactory']
	function ngAnimator(ngMapFactory){
		var map = Snap('#ngMap');
		var carSize = 20; // size of car
		var speedMultiplier = 0.6;

		var service = {
			initTrip: initTrip 
		};
		return service;

		// create a trip object once that can be looped. All the calculations will occur on init
		function initTrip(id){
			var data = ngMapFactory.getData();

			// create car
			data[id].car = map.circle(carSize, carSize, 0).attr({
				id: 'trip' + id,
				class: 'car'
			});


			data[id].pathLength = Snap.path.getTotalLength(data[id].path); // calc path length
			data[id].outPercentage = Math.round(data[id].pathLength * 0.95); // calc percentage on when to animate out
			data[id].speed = (data[id].pathLength * ngMapFactory.getMinutes(data[id].time)) * speedMultiplier; // calc speed

			animateTrip(data[id]);
		}

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
				var x = moveToPoint.x - carSize; // circle starts top left corner, this offsets so that they are centered
				var y = moveToPoint.y - carSize;
				trip.car.transform('translate(' + x + ',' + y + ')');
			}, trip.speed, mina.easeInOutSine, function(){
				// When everything is done, loop the trip animation
				animateTrip(trip);
			});		
		}

		function animateIn(car){
			car.animate({r: carSize}, 350, mina.easeInOutSine);
		}

		function animateOut(car){
			car.animate({r: 0}, 350, mina.easeInOutSine);
		}

	}

	console.log('ngMapFactory.js init');

})();