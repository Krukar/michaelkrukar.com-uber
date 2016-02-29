$(function() {
	var s = Snap('#uber');

	var car = s.circle(15, 15, 0).attr({
		fill: '#E63C2F',
		stroke: 'none'
	});

	var trip = s.path('M402.7,870l-9-56.8c-4.6-29.4-12.8-58.1-24.2-85.6l-37.7-90.8l225.9-69.2').attr({
		fill: 'none'
	});

	var tripLength = Snap.path.getTotalLength(trip);

	function animateTrip(){
		
		car.animate({r: 15}, 250);

		Snap.animate(0, tripLength, function(step) {
			moveToPoint = Snap.path.getPointAtLength( trip, step );
			x = moveToPoint.x - 15;
			y= moveToPoint.y - 15;
			car.transform('translate(' + x + ',' + y + ')');
		},5000, function(){
			car.animate({r: 0}, 250, function(){
				animateTrip();
			});
		});		
	}

	animateTrip();

});