// TODO Load angular libraries as AMD also?
require([ "angular-material", 
          "vatuta/services", "vatuta/controllers", "vatuta/directives",
          "lib/css!https://ajax.googleapis.com/ajax/libs/angular_material/1.0.0/angular-material.min.css",
          "lib/css!https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic"],
          function() {
			angular.bootstrap(document, [ 'vatutaApp' ]);
});