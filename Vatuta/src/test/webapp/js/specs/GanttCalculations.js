require(["vatuta/shared/Project", "vatuta/shared/Task", "vatuta/shared/BaseTask", "vatuta/shared/SummaryTask", "vatuta/shared/Engine", "vatuta/shared/Restriction", "vatuta/shared/Tactics", "moment", "vatuta/shared/Duration"],
		function(Project, Task, BaseTask, SummaryTask, Engine, Restrictions, Tactics, Moment, Duration) {

	var customMatchers = {
		toBeAfter: function(util, customEqualityTesters) {
			return {
				compare: function(actual, expected) {
					var result = {};
					if (!Moment.isMoment(actual)) {
						result.pass = false;
						result.message = "Actual " + actual + " is not a moment";
						return result;
					};
					if (!Moment.isMoment(expected)) {
						result.pass = false;
						result.message = "Expected " + expected + " is not a moment";
						return result;
					};
					result.pass = actual.isAfter(expected);
					if (result.pass) {
						result.message = "Actual " + actual.format() + " is after expected " + expected.format();
			        } else {
			        	result.message = "Actual " + actual.format() + " is NOT after expected " + expected.format();
					}
					return result;
				}
			}
		},
		toBeBefore: function(util, customEqualityTesters) {
			return {
				compare: function(actual, expected) {
					var result = {};
					if (!Moment.isMoment(actual)) {
						result.pass = false;
						result.message = "Actual " + actual + " is not a moment";
						return result;
					};
					if (!Moment.isMoment(expected)) {
						result.pass = false;
						result.message = "Expected " + expected + " is not a moment";
						return result;
					};
					result.pass = actual.isBefore(expected);
					if (result.pass) {
						result.message = "Actual " + actual.format() + " is before expected " + expected.format();
			        } else {
			        	result.message = "Actual " + actual.format() + " is NOT before expected " + expected.format();
					}
					return result;
				}
			}
		},
		toBeSameDay: function(util, customEqualityTesters) {
			return {
				compare: function(actual, expected) {
					var result = {};
					if (!Moment.isMoment(actual)) {
						result.pass = false;
						result.message = "Actual " + actual + " is not a moment";
						return result;
					};
					if (!Moment.isMoment(expected)) {
						result.pass = false;
						result.message = "Expected " + expected + " is not a moment";
						return result;
					};
					result.pass = actual.isSame(expected, 'day');
					if (result.pass) {
						result.message = "Expected " + expected.format() + " is same day as actual " + actual.format();
			        } else {
			        	result.message = "Expected " + expected.format() + " is NOT same day actual " + actual.format();
					}
					return result;
				}
			}
		},
	};
	
	describe("EarlyStart & EarlyEnd calculations", function () {

		beforeEach(function() {
		    jasmine.addMatchers(customMatchers);
		});
		
	    it("End2Start & End2Start", function () {
	    	var project = new Project({
				_name : "Example Project"
			});
			Engine.currentProject(project);
			
			// Start2End
			var base = new Task({
				_name : "Base",
				_duration : new Duration({days: 20})
			});
			project.addTask(base);
			
			var summary = new SummaryTask({
				_name : "Summary"
			});
			project.addTask(summary);
			
			var taskA = new Task({
				_name : "A",
				_duration :new Duration({days: 5})
			});
			project.addTask(taskA, summary);
			
			var taskB = new Task({
				_name : "B",
				_duration :new Duration({days: 4})
			});
			project.addTask(taskB, summary);
			
			var taskC = new Task({
				_name : "C",
				_duration :new Duration({days: 6})
			});
			project.addTask(taskC, summary);
			
			new Restrictions.EndToStart({
				_dependency : base,
				_dependant : summary
			});
			
			new Restrictions.EndToStart({
				_dependency : taskA,
				_dependant : taskB
			});
			
			new Restrictions.EndToStart({
				_dependency : taskB,
				_dependant : taskC
			});
			
			Engine.calculateEarlyStartLateEnding();
			
			expect(summary.earlyEnd()).toBeAfter(base.earlyEnd());
			
			expect(taskA.earlyStart()).toBeBefore(taskB.earlyStart());
	        expect(taskB.earlyStart()).toBeBefore(taskC.earlyStart());
	        expect(taskA.earlyEnd()).toBeSameDay(taskB.earlyStart());
	        expect(taskB.earlyEnd()).toBeSameDay(taskC.earlyStart());
	    });
	    
	    it("End2Start + End2End", function () {
	    	var project = new Project({
				_name : "Example Project"
			});
			Engine.currentProject(project);
			
			// Start2End
			var base = new Task({
				_name : "Base",
				_duration : new Duration({days: 20})
			});
			project.addTask(base);
			
			var summary = new SummaryTask({
				_name : "Summary"
			});
			project.addTask(summary);
			
			var taskA = new Task({
				_name : "A",
				_duration :new Duration({days: 5})
			});
			project.addTask(taskA, summary);
			
			var taskB = new Task({
				_name : "B",
				_duration :new Duration({days: 4})
			});
			project.addTask(taskB, summary);
			
			var taskC = new Task({
				_name : "C",
				_duration :new Duration({days: 6})
			});
			project.addTask(taskC, summary);
			
			new Restrictions.EndToStart({
				_dependency : base,
				_dependant : summary
			});
			
			new Restrictions.EndToStart({
				_dependency : taskA,
				_dependant : taskB
			});
			
			new Restrictions.EndToEnd({
				_dependency : taskB,
				_dependant : taskC
			});
			
			Engine.calculateEarlyStartLateEnding();
			
			expect(summary.earlyStart()).toBeSameDay(base.earlyEnd());
			
			expect(taskB.earlyStart()).toBeAfter(taskA.earlyStart());
	        expect(taskC.earlyStart()).toBeAfter(taskA.earlyStart());
	        expect(taskA.earlyEnd()).toBeSameDay(taskB.earlyStart());
	        expect(taskB.earlyEnd()).toBeSameDay(taskC.earlyEnd());
	        
	    });
	    
	    it("Start2Start + Start2Start", function () {
	    	var project = new Project({
				_name : "Example Project"
			});
			Engine.currentProject(project);
			
			// Start2End
			var base = new Task({
				_name : "Base",
				_duration : new Duration({days: 3})
			});
			project.addTask(base);
			
			var summary = new SummaryTask({
				_name : "Summary"
			});
			project.addTask(summary);
			
			var taskA = new Task({
				_name : "A",
				_duration :new Duration({days: 5})
			});
			project.addTask(taskA, summary);
			
			var taskB = new Task({
				_name : "B",
				_duration :new Duration({days: 4})
			});
			project.addTask(taskB, summary);
			
			var taskC = new Task({
				_name : "C",
				_duration :new Duration({days: 6})
			});
			project.addTask(taskC, summary);
			
			new Restrictions.StartToStart({
				_dependency : base,
				_dependant : summary
			});
			
			new Restrictions.EndToStart({
				_dependency : taskA,
				_dependant : taskB
			});
			
			new Restrictions.StartToStart({
				_dependency : taskB,
				_dependant : taskC
			});
			
			Engine.calculateEarlyStartLateEnding();
			
			expect(summary.earlyEnd()).toBeAfter(base.earlyEnd());
			expect(summary.earlyStart()).toBeSameDay(base.earlyStart());
			
			expect(taskB.earlyStart()).toBeAfter(taskA.earlyStart());
	        expect(taskC.earlyStart()).toBeAfter(taskA.earlyStart());
	        expect(taskA.earlyStart()).toBeBefore(taskC.earlyStart());
	        expect(taskB.earlyStart()).toBeSameDay(taskC.earlyStart());
	        
	    });
	    
	    it("Start2Start + Start2Finish", function () {
	    	var project = new Project({
				_name : "Example Project"
			});
			Engine.currentProject(project);
			
			// Start2End
			var base = new Task({
				_name : "Base",
				_duration : new Duration({days: 3})
			});
			project.addTask(base);
			
			var summary = new SummaryTask({
				_name : "Summary"
			});
			project.addTask(summary);
			
			var taskA = new Task({
				_name : "A",
				_duration :new Duration({days: 5})
			});
			project.addTask(taskA, summary);
			
			var taskB = new Task({
				_name : "B",
				_duration :new Duration({days: 4})
			});
			project.addTask(taskB, summary);
			
			var taskC = new Task({
				_name : "C",
				_duration :new Duration({days: 6})
			});
			project.addTask(taskC, summary);
			
			new Restrictions.StartToStart({
				_dependency : base,
				_dependant : summary
			});
			
			new Restrictions.EndToStart({
				_dependency : taskA,
				_dependant : taskB
			});
			
			new Restrictions.StartToEnd({
				_dependency : taskB,
				_dependant : taskC
			});
			
			Engine.calculateEarlyStartLateEnding();
			
			expect(summary.earlyEnd()).toBeAfter(base.earlyEnd());
			expect(summary.earlyStart()).toBeSameDay(base.earlyStart());
			
			expect(taskB.earlyStart()).toBeAfter(taskA.earlyStart());
	        expect(taskC.earlyStart()).toBeSameDay(taskA.earlyStart());
	        expect(taskB.earlyStart()).toBeAfter(taskC.earlyStart());
	        expect(taskC.earlyEnd()).toBeAfter(taskB.earlyStart());
	        
	    });
	    
	    it("Start2Start + Start2Finish + Manual Tasks", function () {
	    	var project = new Project({
				_name : "Example Project"
			});
			Engine.currentProject(project);

			// Start2End
			var base = new Task({
				_name : "Base",
				_duration : new Duration({
					days : 4
				}),
				_tactic: Tactics.MANUAL.name(),
				_actualStart: Moment().add(2, 'days'),
				_actualEnd: Moment().add(6, 'days')
			});
			project.addTask(base);

			var summary = new SummaryTask({
				_name : "Summary"
			});
			project.addTask(summary);

			var taskA = new Task({
				_name : "A",
				_duration : new Duration({
					days : 5
				})
			});
			project.addTask(taskA, summary);

			var taskB = new Task({
				_name : "B",
				_duration : new Duration({
					days : 4
				}),
				_tactic: Tactics.MANUAL.name(),
				_actualStart: Moment().add(8, 'days'),
				_actualEnd: Moment().add(12, 'days')
			});
			project.addTask(taskB, summary);

			var taskC = new Task({
				_name : "C",
				_duration : new Duration({
					days : 5
				})
			});
			project.addTask(taskC, summary);

			new Restrictions.StartToStart({
				_dependency : base,
				_dependant : summary
			});

			new Restrictions.EndToStart({
				_dependency : taskA,
				_dependant : taskB
			});

			new Restrictions.StartToEnd({
				_dependency : taskB,
				_dependant : taskC
			});
			
			Engine.calculateEarlyStartLateEnding();
			
			expect(summary.earlyStart()).toBeSameDay(base.earlyStart());
			
			expect(taskB.earlyStart()).toBeAfter(taskA.earlyEnd());
	        expect(taskC.earlyStart()).toBeAfter(taskA.earlyStart());
	        expect(taskB.earlyStart()).toBeAfter(taskC.earlyStart());
	        expect(taskC.earlyEnd()).toBeSameDay(taskB.earlyStart());
	        
	        expect(taskB.actualStart().diff(taskA.actualEnd(),'days')).toEqual(1);
	        
	    });
	    
	    it("Start2Start + Start2Finish + ALAP&Actual values", function () {
	    	var project = new Project({
				_name : "Example Project"
			});
			Engine.currentProject(project);

			// Start2End
			var base = new Task({
				_name : "Base",
				_duration : new Duration({
					days : 4
				}),
				_tactic: Tactics.getTacticInstanceByName("ALAP").name()
			});
			project.addTask(base);

			var summary = new SummaryTask({
				_name : "Summary"
			});
			project.addTask(summary);

			var taskA = new Task({
				_name : "A",
				_duration : new Duration({
					days : 4
				})
			});
			project.addTask(taskA, summary);

			var taskB = new Task({
				_name : "B",
				_duration : new Duration({
					days : 4
				}),
				_tactic: Tactics.MANUAL.name(),
				_actualStart: Moment().add(8, 'days'),
				_actualEnd: Moment().add(12, 'days')
			});
			project.addTask(taskB, summary);

			var taskC = new Task({
				_name : "C",
				_duration : new Duration({
					days : 5
				})
			});
			project.addTask(taskC, summary);

			new Restrictions.StartToStart({
				_dependency : base,
				_dependant : summary
			});

			new Restrictions.EndToStart({
				_dependency : taskA,
				_dependant : taskB
			});

			new Restrictions.StartToEnd({
				_dependency : taskB,
				_dependant : taskC
			});
			
			Engine.calculateEarlyStartLateEnding();
			
			expect(summary.earlyStart()).toBeSameDay(base.earlyStart());
			
			expect(taskB.earlyStart()).toBeSameDay(taskA.earlyEnd());
	        expect(taskC.earlyStart()).toBeSameDay(taskA.earlyStart());
	        expect(taskB.earlyStart()).toBeAfter(taskC.earlyStart());
	        expect(taskC.earlyEnd()).toBeAfter(taskB.earlyStart());
	        
	        expect(taskB.actualStart().diff(taskA.actualEnd(),'days')).toEqual(0);
	        
	        expect(taskA.actualStart()).toBeSameDay(base.actualStart());
	    });
	    
	    it("Start2Start + Start2Finish + ALAP&Manual&Actual values", function () {
	    	var project = new Project({
				_name : "Example Project"
			});
			Engine.currentProject(project);

			// Start2End
			var base = new Task({
				_name : "Base",
				_duration : new Duration({
					days : 4
				}),
				_tactic: Tactics.getTacticInstanceByName("ASAP").name()
			});
			project.addTask(base);

			var summary = new SummaryTask({
				_name : "Summary"
			});
			project.addTask(summary);

			var taskA = new Task({
				_name : "A",
				_duration : new Duration({
					days : 5
				}),
				_tactic: Tactics.getTacticInstanceByName("ALAP").name()
			});
			project.addTask(taskA, summary);

			var taskB = new Task({
				_name : "B",
				_duration : new Duration({
					days : 4
				}),
				_tactic: Tactics.MANUAL.name(),
				_actualStart: Moment().add(10, 'days'),
				_actualEnd: Moment().add(14, 'days')
			});
			project.addTask(taskB, summary);

			var taskC = new Task({
				_name : "C",
				_duration : new Duration({
					days : 6
				}),
				_tactic: Tactics.getTacticInstanceByName("ASAP").name()
			});
			project.addTask(taskC, summary);

			new Restrictions.StartToStart({
				_dependency : base,
				_dependant : summary
			});

			new Restrictions.EndToStart({
				_dependency : taskA,
				_dependant : taskB
			});

			new Restrictions.StartToEnd({
				_dependency : taskB,
				_dependant : taskC
			});
			
			Engine.calculateEarlyStartLateEnding();
			
			expect(summary.actualStart()).toBeAfter(base.actualStart());
			expect(summary.earlyStart()).toBeSameDay(base.earlyStart());
			expect(summary.actualStart().diff(base.actualStart(),'days')).toEqual(4);
			
			expect(taskB.earlyStart()).toBeAfter(taskA.earlyEnd());
	        expect(taskC.earlyStart()).toBeAfter(taskA.earlyStart());
	        expect(taskB.earlyStart()).toBeAfter(taskC.earlyStart());
	        expect(taskC.earlyEnd()).toBeSameDay(taskB.earlyStart());
	        
	        expect(taskA.actualStart().diff(taskC.actualStart(),'days')).toEqual(1);
	        
	        expect(taskA.actualStart()).toBeAfter(base.actualStart());
	        expect(taskC.actualStart()).toBeSameDay(summary.actualStart());
	    });
	});
});