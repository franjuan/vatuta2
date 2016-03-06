// TODO Load angular libraries as AMD also?
require([ "angular-material", 
          "vatuta/services", "vatuta/controllers", "vatuta/directives",
          "lib/css!https://cdnjs.cloudflare.com/ajax/libs/angular-material/1.0.6/angular-material.min.css",
          "lib/css!https://cdnjs.cloudflare.com/ajax/libs/angular-material/1.0.6/angular-material.layouts.min.css",
          "lib/css!https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic"],
          function() {
			angular.bootstrap(document, [ 'vatutaApp' ]);
});