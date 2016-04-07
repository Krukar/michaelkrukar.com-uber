(function() {

	'use strict';
	$ = jQuery;

	angular
	.module('uberApp')
	.factory('ngMapFactory', ngMapFactory);

	ngMapFactory.$inject = ['$http'];
	function ngMapFactory($http){
		var data;

		var service = {
			getData: getData,
			getMinutes: getMinutes
		};
		return service;
		
		function getData(){
			if(!data){
				var promise = $http.get('/data/trips.json').then(function(response) {
					data = response.data;
					return data;
				});
				return promise;
			}
			else{
				return data;
			}
		}

		function getMinutes(time){
			var regex = new RegExp('^(.{1,2}):(.{1,2}):(.{1,2})').exec(time);
			var minutes = (parseInt(regex[1]) * 60) + parseInt(regex[2]);
			return minutes;
		}

	}

	console.log('ngMapFactory.js init');

})();