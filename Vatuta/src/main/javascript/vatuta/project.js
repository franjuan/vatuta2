define([ "dojo/_base/declare", "dojo/_base/lang", "./vatuta/task.js" ],
		function(declare, lang, Task) {
			return declare(null, {
				constructor : function(/* Object */kwArgs) {
					lang.mixin(this, kwArgs);
				},
				getHello : function() {
					this.task = new Task({
						duration : 3
					});
					return '<em> Dojo!' + this.task.getDuration() + '</em>';
				}
			});
		});