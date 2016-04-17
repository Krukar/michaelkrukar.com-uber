(function() {

	'use strict';
	$ = jQuery;

	angular
	.module('uberApp')
	.factory('ngAnimator', ngAnimator);

	ngAnimator.$inject = ['ngMapFactory']
	function ngAnimator(ngMapFactory){
		var options = ngMapFactory.getOptions();

		var highlight;

		var service = {
			animateTrip: animateTrip
		};
		return service;

		function animateTrip(trip){
			var out = false; // set out animation to false

			animateIn(trip); // animate car in

			// start animation
			Snap.animate(0, trip.pathLength, function(step) {
				// if the trip is past 95% complete trigger 1 animate out
				if(step >= trip.outPercentage && out == false){
					animateOut(trip);
					out = true; // set to true so that the animateOut function does not loop
				}
				var moveToPoint = Snap.path.getPointAtLength( trip.path, step );
				var x = moveToPoint.x - options.size; // circle starts top left corner, this offsets so that they are centered
				var y = moveToPoint.y - options.size;
				trip.car.transform('translate(' + x + ',' + y + ')');
			}, trip.timeLength, mina.easeInOutSine, function(){
				// When everything is done, loop the trip animation
				animateTrip(trip);
			});		
		}

		function animateIn(trip){
			trip.car.animate({
				r: options.size
			}, 350, mina.easeInOutSine);

			// create event listener
			// goes here instead of animateTrip() in case you unhover then want to rehover
			trip.car.mouseover(function(){
				// remove the mouseover event
				trip.car.unmouseover();
				setActive(trip);
			});
		}

		function animateOut(trip){
			trip.car.animate({r: 0}, 350, mina.easeInOutSine);

			if(trip.car == highlight){
				console.log('match')
			}

		}

		function setActive(trip){
			// if there was a previous one hovered, unhover it
			if(options.active){
				animateIn(options.active);
			}
			ngMapFactory.setActive(trip);

			// animate the one that is hovered
			trip.car.animate({
				r: options.hover
			}, 350, mina.easeInOutSine);

			if(highlight){
				animateHighlightOut();
			}

			animateHighlightIn(trip.path);
		}

		function animateHighlightIn(path){
			highlight = Snap('#highlight').path(path).attr({
				class: 'highlight'
			});

			highlight.animate({
				strokeWidth: '16px'
			}, 350, mina.easeInOutSine);
		}

		function animateHighlightOut(){
			highlight.animate({
				strokeWidth: '0'
			}, 350, mina.easeInOutSine);
			highlight.remove();
		}

	}

	console.log('ngMapFactory.js init');

})();