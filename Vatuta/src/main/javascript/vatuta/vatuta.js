var vatutaMod = angular.module('vatuta', []);

vatutaMod.service('Project', [function() {
	require("dojo/_base/declare");
	require("dojo/_base/lang");
	/**
     * @exports Project
     */
	return declare("Project", null, {
		/**
		 * @constructs Project
		 */
		constructor : function(/* Object */kwArgs) {
			this._tasks = [];
			lang.mixin(this, kwArgs);
		},
		/**
		 * @function
		 * @memberof Project
		 */
		getTasks : function() {
			return this._tasks;
		},
		/**
		 * @function
		 * @memberof Project
		 */
		addTask : function(task) {
			this._tasks.push(task);
			return task;
		},
		/**
		 * @function
		 * @memberof Project
		 */
		name: function(newName) {
		     return arguments.length ? (this._name = newName) : this._name;
		}
	});
}]);