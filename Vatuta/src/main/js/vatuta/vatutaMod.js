define([ ], function() {

	return angular.module('vatuta', [])
		.config( ['$compileProvider', function( $compileProvider )
			    {
					// To allow download gantt
			        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file|mailto):|data:image\//);
			    }
	]);

});