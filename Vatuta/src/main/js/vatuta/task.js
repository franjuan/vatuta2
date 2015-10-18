define([ "dojo/_base/declare", "dojo/_base/lang", "lodash" ], function(declare,
		lang, _) {
	var Task = declare("Task", null, {
		constructor : function (/* Object */kwArgs) {
			lang.mixin(this, kwArgs);
			if (!this._id) {
				this._id='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				    return v.toString(16);
				});
			}
		},
		index: function(newIndex) {
		     return arguments.length ? (this._index = newIndex) : this._index;
		},
		id: function(newId) {
		     return arguments.length ? (this._id = newId) : this._id;
		},
		name: function(newName) {
		     return arguments.length ? (this._name = newName) : this._name;
		},
		duration: function(newDuration) {
		     return arguments.length ? (this._duration = newDuration) : this._duration;
		},
		getRestrictions : function() {
			if (!this._restrictions) {
				this._restrictions = [];
			}
			return this._restrictions;
		},
		addRestriction : function(restriction) {
			this.getRestrictions().push(restriction);
			this._dependencies = null;
			this._dependants = null;
			return restriction;
		},
		getDependencies : function() {
			if (!this._dependencies) {
				this._dependencies = [];
				_.forEach(this.getRestrictions(), function(restriction) {
					_.forEach(restriction.getDependencies4Task(this), function(dependency) {
						this._dependencies.push(dependency);
					}, this);
				}, this);
			}
			return this._dependencies;
		},
		getDependants : function() {
			if (!this._dependants) {
				this._dependants = [];
				_.forEach(this.getRestrictions(), function(restriction) {
					_.forEach(restriction.getDependants4Task(this), function(dependant) {
						this._dependants.push(dependant);
					}, this);
				}, this);
			}
			return this._dependants;
		},
		getEarlyStart: function() {
			return this._earlyStart;
		},
		getEarlyEnd: function() {
			return this._earlyEnd;
		},
		getLateStart: function() {
			return this._lateStart;
		},
		getLateEnd: function() {
			return this._lateEnd;
		},
		jsonify: function () {
			var o = {_id: this._id, _index: this._index, _name: this._name, _duration: this._duration, _class: this.__proto__.declaredClass, _taskRestrictions: []};
			for (var i = 0; i < this.getRestrictions().length; i++) {
				o._taskRestrictions.push(this.getRestrictions()[i].jsonify());
			};
			return o;
		},
		prepareAfterLoading: function(project, namespace) {
			if (this._taskRestrictions && Array.isArray(this._taskRestrictions)) {
				for (var i = 0; i < this._taskRestrictions.length; i++) {
					var restriction = this._taskRestrictions[i];
					var _class = restriction._class;
					eval(_class + '.objectify(restriction, project, this, namespace)');
				};
			}
			for (var i = 0; i < this.getRestrictions().length; i++) {
				this.getRestrictions()[i].prepareAfterLoading(project);
			};
			delete this._taskRestrictions;
		}
	});
	Task.objectify = function(json, project, namespace) {
		var _class = json._class;
		delete json._class;
		var task = new namespace[_class](json);
		return task;
	};
	return Task;
});