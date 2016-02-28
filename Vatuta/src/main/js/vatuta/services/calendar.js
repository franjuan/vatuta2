define([ "moment", "vatuta/vatutaApp" ], function(Moment) {

	angular.module('vatutaApp').factory('CalendarHandler', ["$project", function($project) {
		return {
			// TODO Test cases
			changeDay: function(moment, calendar, timetable) {
				// Get current timetable
				var leaf = this.searchTree(moment, calendar.tree);
				// If it is the same no change expected, get back
				if (this.timetableEquals(timetable, leaf.timetable)) {
					return;
				}
				// Search for parentnode
				var parent = this.searchNode(moment, calendar.tree);
				var day = moment.startOf('day');
				var nextDay = Moment(day).add(1,'day');
				// if leaf has same limits, just change the value
				if (parent.lowDate.isSame(day) && parent.highDate.isSame(nextDay)) {
					leaf.timetable=timetable;
				}
				// if parent has two leaves (of three available per node)
				else if (parent.lowDate.isSame(parent.highDate)) {
					// if new date matches separation date, add second separation and insert new leaf in the middle 
					if (parent.lowDate.isSame(day)) {
						parent.highDate = nextDay;
						parent.middleChild = {isLeaf:true, timetable:timetable};
					} else if (parent.lowDate.isSame(nextDay)) {
						parent.lowDate = day;
						parent.middleChild = {isLeaf:true, timetable:timetable};
					}
					// otherwise if it does not match the current separation, add a separation and insert a new node before or...
					else if (parent.lowDate.isAfter(nextDay)) {
						parent.lowDate = nextDay;
						parent.middleChild = parent.lowChild;
						parent.lowChild = {isBranch:true,
												lowDate: day,
												highDate: day,
												lowChild: {isLeaf:true, timetable:leaf.timetable},
												highChild: {isLeaf:true, timetable:timetable}
											};
					} else {
					// ... behind
						parent.highDate = day;
						parent.middleChild = parent.highChild;
						parent.highChild = {isBranch:true,
								lowDate: day,
								highDate: day,
								lowChild: {isLeaf:true, timetable:timetable},
								highChild: {isLeaf:true, timetable:leaf.timetable}
							};

					}
				}
				// Otherwise parent has three leaves (node is full)
				else {
					var done = false;
					//if new day is beside one of the separation, extend the separation
					if (parent.middleChild.isLeaf && this.timetableEquals(parent.middleChild.timetable, timetable)) {
						if (parent.highDate.isSame(day) )  {
							parent.highDate = nextDay;
							done = true;
						} else if (parent.lowDate.isSame(nextDay)) {
							parent.lowDate = day;
							done = true;
						}
					}
					if (!done) {
						this.addNode2Branch(
							parent,
							{isBranch:true,
								lowDate: day,
								highDate: nextDay,
								lowChild: {isLeaf:true, timetable:leaf.timetable},
								middleChild: {isLeaf:true, timetable:timetable},
								highChild: {isLeaf:true, timetable:leaf.timetable}
							});
					}
				}
				
				this.pruneTree(calendar.tree);
			},
			
			addNode2Branch: function(parent, node) {
				if (node.highDate.isSameOrBefore(parent.lowDate)) {
					parent.lowChild = node;
				} else if (node.lowDate.isSameOrAfter(parent.highDate)) {
					parent.highChild = node;
				} else {
					parent.middleChild = node;
				}
			},
		
			searchTimeTable: function(moment, calendar) {
				return this.searchTree(moment, calendar.tree).timetable;
			},
			
			searchTree: function(moment, node) {
				if (node.isLeaf) {
					return node;
				} else if (node.isBranch) {
					if (moment.isBefore(node.lowDate)) {
						return this.searchTree(moment, node.lowChild);
					} else if (moment.isSameOrAfter(node.highDate)) {
						return this.searchTree(moment, node.highChild);
					} else {
						return this.searchTree(moment, node.middleChild);
					}
				} else throw "Calendar tree is not correct";
			},
			
			searchNode: function(moment, node) {
				if (node.isLeaf) {
					return false;
				} else if (node.isBranch) {
					var child;
					if (moment.isBefore(node.lowDate)) {
						child = this.searchNode(moment, node.lowChild);
					} else if (moment.isSameOrAfter(node.highDate)) {
						child = this.searchNode(moment, node.highChild);
					} else {
						child = this.searchNode(moment, node.middleChild);
					}
					if (!child) {
						return node;
					} else {
						return child;
					}
				} else throw "Calendar tree is not correct";
			},
			
			pruneTree: function(node) {
				// TODO Add prune cases where parent and child can be joined together in one node
				if (node.isLeaf) {
					return;
				} else if (node.isBranch) {
					this.pruneTree(node.lowChild);
					this.pruneTree(node.highChild);
					if (node.middleChild) this.pruneTree(node.middleChild);
					// Convert to leaf when all branches are the same timetable (all are leaves)
					if ((node.lowChild.isLeaf && node.highChild.isLeaf && this.timetableEquals(node.lowChild.timetable, node.highChild.timetable)) &&
							(node.lowDate.isSame(node.highDate) || (node.middleChild.isLeaf && this.timetableEquals(node.lowChild.timetable, node.middleChild.timetable)))) {
						node.isLeaf = true;
						node.timetable = node.lowChild.timetable;
						delete node.isBranch;
						delete node.lowDate;
						delete node.highDate;
						delete node.lowChild;
						delete node.middleChild;
						delete node.highChild;
					// If two leaves of three points to same timetable
					} else if (node.lowChild.isLeaf && node.middleChild.isLeaf && node.highChild.isLeaf) {
						if (this.timetableEquals(node.lowChild.timetable, node.middleChild.timetable)) {
							node.lowDate = node.highDate;
							delete node.middleChild;
						} else if (this.timetableEquals(node.middleChild.timetable, node.highChild.timetable)) {
							node.highDate = node.lowDate;
							delete node.middleChild;
						}
					}
				}
			},
			
			removeRangeFromInterval: function(calendar, timetable, interval, range2remove) {
				_.remove(interval.ranges, function(range, index) {
					return this.rangeEquals(range, range2remove);
				}, this);
			},
			
			addRangeToInterval: function(calendar, timetable, interval) {
				interval.ranges.push({from:{hours:0, minutes:0}, to:{hours:0,minutes:0}});
			},
			
			timetableEquals: function(one, two) {
				return one.id == two.id;
			},
			
			rangeEquals: function(one, two) {
				return angular.equals(one, two);
			}
		}
		
	} ]);
	
});