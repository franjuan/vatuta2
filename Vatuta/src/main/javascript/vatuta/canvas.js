/**
 * @module Canvas
 */
define(
		[ 'dojo/_base/declare', 'dojo/_base/lang', 'easeljs', 'lodash' ],
		function(declare, lang, easeljs, _) {
			return declare(null, {
				/**
				 * @constructs CanvasDrawer
				 */
				constructor : function(element, /* Object */kwArgs) {
					/* @member {Number} */
					this._dayWidth = this._width/60;
					/* @member {Number} */
					this._rulerHeight = this._dayWidth;
					/* @member {Number} */
					this._dayFont = "Arial";
					/* @member {Number} */
					this._dayFontSize = this._rulerHeight/2;
					/* @member {Number} */
					this._taskHeight= this._dayWidth;
					/* @member {Number} */
					this._taskFont = "Arial";
					/* @member {Number} */
					this._taskFontSize = this._taskHeight/2;
					/* @member {Number} */
					this._taskTopHeight= this._taskHeight*0.15;
					/* @member {Number} */
					this._taskBottomHeight= this._taskHeight*0.15;
						
					lang.mixin(this, kwArgs);
					
					/* @member {Number} */
					var parent = angular.element(element)[0];
					this._width = parent.offsetWidth;
					/* @member {Number} */
					this._height = parent.offsetHeight;
					
					this._taskRowHeight= this._taskTopHeight + this._taskHeight + this._taskBottomHeight;
					
					this._canvas = element.children()[0];
					this._canvas.width = this._width;
					this._canvas.height = this._height;
					
				    /* @member {Object} */
					this._stage = new createjs.Stage(this._canvas);
					
					this._listener = null;
				},
				listener: function(newListener) {
					return arguments.length ? (this._listener = newListener) : this._listener;
				},
				drawTimeRuler: function(project) {
					var ruler = new createjs.Container();
					
					for (i=0; i*this._dayWidth < this._width; i++) {
						var element = new createjs.Shape();
						element.graphics.beginFill("#C5CAE9").drawRoundRect(i*this._dayWidth, 0, this._dayWidth, this._rulerHeight, 5);

						var text = new createjs.Text(i, "bold " + this._dayFontSize + "px " + this._dayFont);
						text.color = "White";
						text.maxWidth = this._dayWidth;
						text.textBaseline = "middle";
						text.textAlign = "center";
						text.x = i*this._dayWidth + this._dayWidth/2;
						text.y = this._rulerHeight/2;
						
						ruler.addChild(element, text);
					}
					ruler.x = 0;
					ruler.y = 0;
					this._stage.addChild(ruler);

					this._stage.update();
				},
				drawProject: function(project) {
					this._width = project.calculatedLength() * this._dayWidth;
					this._height = this._rulerHeight + this._taskRowHeight * project.getTasks().length;
					this._canvas.width = this._width;
					this._canvas.height = this._height;

					for (i=0; i < project.getTasks().length; i++) {
						var task = project.getTasks()[i];
						var taskContainer = this.drawTask(task);
						taskContainer.x = 0;
						taskContainer.y = this._taskRowHeight * i + this._rulerHeight;
						this._stage.addChild(taskContainer);
						
					};
					this._stage.update();
				},
				drawTask: function(task) {
					var taskContainer = new createjs.Container();
					var element = new createjs.Shape();
					element.graphics.beginFill("#607D8B").drawRect(
							task.getEarlyStart()*this._dayWidth,
							this._taskTopHeight,
							task.duration()*this._dayWidth,
							this._taskHeight);
					
					var text = new createjs.Text(task.name(), "bold " + this._taskFontSize + "px " + this._taskFont);
					text.color = "White";
					text.maxWidth = this._dayWidth*task.duration();
					text.textBaseline = "middle";
					text.textAlign = "center";
					text.x = (task.getEarlyStart() + task.duration()/2)*this._dayWidth;
					text.y = this._taskTopHeight + this._taskHeight/2;
					
					taskContainer.addChild(element, text);
					
					taskContainer.addEventListener("click", 
						_.bind(
								function() {
									if (this._listener) {
										this._listener.onSelectedTaskChange(task);
									};
								}, this)
					);
					
					return taskContainer;
				}
			});
		}
);