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
		var highlightId;

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

			// creat event listener
			// we use angular since it has mouseenter
			// we use trip.car.node because this element does not exist inside angular
			var element = $(trip.car.node);

			element.on('mouseenter', function(){
				element.unbind('mouseenter');
				setActive(trip);
			});
		}

		function animateOut(trip){
			trip.car.animate({r: 0}, 350, mina.easeInOutSine);
			if(highlightId == trip.path){
				highlight.animate({
					strokeWidth: '0'
				}, 350, mina.easeInOutSine, function(){
					highlight.remove();
				});
			}
		}

		function setActive(trip){
			if(highlight){
				var prevHighlight = highlight;
				// animate highlight out
				highlight.animate({
					strokeWidth: '0'
				}, 350, mina.easeInOutSine, function(){
					prevHighlight.remove();
				});
			}

			// if there was a previous one hovered, unhover it
			if(options.active){
				animateIn(options.active);
			}
			ngMapFactory.setActive(trip);

			// animate the one that is hovered
			trip.car.animate({
				r: options.hover
			}, 350, mina.easeInOutSine);

			// create the highlight
			highlight = Snap('#highlight').path(trip.path).attr({
				class: 'highlight'
			});

			// animate highlight in
			highlight.animate({
				strokeWidth: '4px'
			}, 350, mina.easeInOutSine);

			highlightId = highlight.node.getAttribute('d');
		}

	}

	console.log('ngMapFactory.js init');

})();