/**
 * @module Engine
 */
define([ "dojo/_base/declare", "./vatuta/project.js", "underscorejs" ],
	function(declare, Project, _) {
		/**
	     * @constructor
	     * @alias module:Engine
	     */
		return {
			/** Calculate early start and late end dates of every task of the project
			 * @function
			 * @param {Project} project Project to be calculated */
			calculateEarlyStartLateEnding : function(project) {
				return "Dojo";
			}
		};
	});