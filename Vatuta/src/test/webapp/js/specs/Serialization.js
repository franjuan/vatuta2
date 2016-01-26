require(["vatuta/shared/Project", "vatuta/shared/Task", "vatuta/shared/BaseTask", "vatuta/shared/SummaryTask", "vatuta/shared/Engine", "vatuta/shared/Restriction", "vatuta/shared/Tactics", "moment", "vatuta/shared/Duration", "vatuta/services/vatuta"],
		function(Project, Task, BaseTask, SummaryTask, Engine, Restrictions, Tactics, Moment, Duration) {
	describe("Serializarion & Deserialization of Projects", function () {
		beforeEach(function() {
			module('vatuta')
		});
		
	    it("Serializarion & Deserialization", inject(function(ProjectSerializer){ //parameter name = service name
    	
            expect(ProjectSerializer).not.toBeNull()
	    	
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
				_manualStart: Moment().add(10, 'days'),
				_manualEnd: Moment().add(14, 'days')
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
				_dependant : summary,
				_delay : new Duration({
					days : 1
				})
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
			
			var json = ProjectSerializer.serializeProject(project);
			
			var other = ProjectSerializer.deserializeProject(json);
			
			expect(project.name()).toEqual(other.name());
			expect(project.tasks().length).toEqual(other.tasks().length);
			expect(project.actualStart().isSame(other.actualStart())).toBeTruthy();
			expect(project.earlyStart().isSame(other.earlyStart())).toBeTruthy();
			
			for (var i = 0; i < project.tasks().length; i++) {
				expect(project.tasks()[i].id()).toEqual(other.tasks()[i].id());
				expect(project.tasks()[i].name()).toEqual(other.tasks()[i].name());
				expect(project.tasks()[i].description()).toEqual(other.tasks()[i].description());
				expect(project.tasks()[i].tactic().equals(other.tasks()[i].tactic())).toBeTruthy();
				expect(project.tasks()[i].duration()).toEqual(other.tasks()[i].duration());
				expect(project.tasks()[i].earlyStart().isSame(other.tasks()[i].earlyStart())).toBeTruthy();
				expect(project.tasks()[i].earlyEnd().isSame(other.tasks()[i].earlyEnd())).toBeTruthy();
				expect(project.tasks()[i].lateStart().isSame(other.tasks()[i].lateStart())).toBeTruthy();
				expect(project.tasks()[i].lateEnd().isSame(other.tasks()[i].lateEnd())).toBeTruthy();
				expect(project.tasks()[i].actualStart().isSame(other.tasks()[i].actualStart())).toBeTruthy();
				expect(project.tasks()[i].actualEnd().isSame(other.tasks()[i].actualEnd())).toBeTruthy();
				
				expect(project.tasks()[i].getDependencies().length).toEqual(other.tasks()[i].getDependencies().length);
				for (var j = 0; j < project.tasks()[i].getDependencies().length; j++) {
					expect(project.tasks()[i].getDependencies()[j]).toEqual(other.tasks()[i].getDependencies()[j]);
				}
				
				expect(project.tasks()[i].getDependants().length).toEqual(other.tasks()[i].getDependants().length);
				for (var j = 0; j < project.tasks()[i].getDependants().length; j++) {
					expect(project.tasks()[i].getDependants()[j]).toEqual(other.tasks()[i].getDependants()[j]);
				}
			}
			
	    }));
	});
});