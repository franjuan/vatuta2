define([ "vatuta/vatutaApp"  ], function() {

	angular.module('vatutaApp').factory('CalendarHandler', ["$project", function($project) {
		return {
			changeDay: function(year, month, day, calendar, timetable) {	
			},
		
			searchTimeTable: function(moment, calendar) {
				return this.searchTree(moment, calendar.tree);
			},
			
			searchTree: function(moment, node) {
				if (node.isLeaf) {
					return node.timetable;
				} else if (node.isBranch) {
					if (moment.isBefore(node.lowDate)) {
						return this.searchTree(moment, node.lowChild);
					} else if (moment.isSameOrAfter(node.highDate)) {
						return this.searchTree(moment, node.highChild);
					} else {
						return this.searchTree(moment, node.middleChild);
					}
				} else throw "Calendar tree is not correct";
			}
		}
		
	} ]);
	
});