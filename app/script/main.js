require.config({
	urlArgs: "bust=0.206566596403718",
	paths: {
		bootstrap: "../bower_components/bootstrap/dist/js/bootstrap",
		requirejs: "../bower_components/requirejs/require",
		backbone: "../bower_components/backbone/backbone",
		underscore: "../bower_components/underscore/underscore",
		jquery: "../bower_components/jquery/dist/jquery",
		d3: "../bower_components/d3/d3",
		"es5-shim": "../bower_components/es5-shim/es5-shim",
		json3: "../bower_components/json3/lib/json3",
		CM: "./controllermodule"
	},
	shim: {
		backbone: {
			exports: "Backbone",
			deps: [
				"jquery",
				"underscore"
			]
		},
		underscore: {
			exports: "_"
		},
		bootstrap: {
			deps: [
				"jquery"
			]
		}
	},
	packages: [

	]
});


(function() {
  require(['jquery', 'CM', 'bootstrap', 'd3'], function($, CM) {
    console.log($);
    console.log('Main loading finished.');
   CM.exCtrl.init();

    CM.mainCtrl.init();
  });



})();