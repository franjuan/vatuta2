/**
 * @module Canvas
 */
define(
		[ 'dojo/_base/declare', 'dojo/_base/lang', 'easeljs', 'lodash', 'moment' ],
		function(declare, lang, easeljs, _, moment) {
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
					/* @member {Number} */
					this._arrowHeight= this._taskTopHeight;
					/* @member {Number} */
					this._arrowWidth= this._arrowHeight*2/3;
					/* @member {String} */
					this._arrowColor = "#000000";
					/* @member {String} */
					this._taskBgColor = "#607D8B";
					/* @member {String} */
					this._taskNameColor = "White";
					/* @member {Number} */
					this._arrowInTaskXOffset = 0.5 * this._dayWidth;
					/* @member {Number} */
					this._arrowCornerR = 10;
						
					lang.mixin(this, kwArgs);
					
					/* @member {Number} */
					var parent = angular.element(element)[0];
					
					parent.addEventListener("click", 
							_.bind(
									function(event) {
										if (this._listener && event.target.localName != 'canvas') {
											this._listener.onClickOnTaskContainer(event);
										};
									}, this),
									false
						);
					
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
					
					var dayCounter = moment(project.start());
					for (i=0; i*this._dayWidth < this._width; i++) {
						var element = new createjs.Shape();
						element.graphics.beginFill("#C5CAE9").drawRoundRect(i*this._dayWidth, 0, this._dayWidth, this._rulerHeight, 5);

						var text = new createjs.Text(dayCounter.date(), "bold " + this._dayFontSize + "px " + this._dayFont);
						text.color = "White";
						text.maxWidth = this._dayWidth;
						text.textBaseline = "middle";
						text.textAlign = "center";
						text.x = i*this._dayWidth + this._dayWidth/2;
						text.y = this._rulerHeight/2;
						
						ruler.addChild(element, text);
						dayCounter.add(1,"day");
					}
					ruler.x = 0;
					ruler.y = 0;
					this._stage.addChild(ruler);

					this._stage.update();
				},
				drawProject: function(project) {
					
					this._width = project.calculatedLength().asDays() * this._dayWidth;
					this._height = this._rulerHeight + this._taskRowHeight * project.tasks().length;
					this._canvas.width = this._width;
					this._canvas.height = this._height;

					// Draw in Z order, biggest first, from top to bottom
					// Dependencies
					_.forEach(project.tasks(),function(task) {
						_.forEach(task.restrictions(),function(restriction) {
							var restrictionContainer = this.drawRestriction(restriction, task, project);
							this._stage.addChildAt(restrictionContainer); // Arrows secondlevel
						}, this);
					}, this);	
					// Tasks
					_.forEach(project.tasks(),function(task) {
						var taskContainer = this.drawTask(task, project);
						this._stage.addChildAt(taskContainer); // Tasks firstlevel
					}, this);
					
					this._stage.update();
				},
				drawTask: function(task, project) {
					var taskContainer = new createjs.Container();
					
					var element = new createjs.Shape();
					element.graphics.beginFill("#FFF").drawRect(0,0, this._canvas.width, this._taskRowHeight);
					
					var taskShape = new createjs.Shape();
					taskShape.mouseChildren = false;
					var daysFromStart = this.daysFromProjectStart(task.earlyStart(), project);
					var daysFromEnd = this.daysFromProjectStart(task.earlyEnd(), project);
					var durationInDays = daysFromEnd - daysFromStart;
					taskShape.graphics.beginFill(this._taskBgColor).drawRect(
							daysFromStart*this._dayWidth,
							this._taskTopHeight,
							durationInDays*this._dayWidth,
							this._taskHeight);
					
					var text = new createjs.Text(task.name(), "bold " + this._taskFontSize + "px " + this._taskFont);
					text.color = this._taskNameColor;
					text.maxWidth = durationInDays*this._dayWidth;
					text.textBaseline = "middle";
					text.textAlign = "center";
					text.x = (daysFromStart + durationInDays/2)*this._dayWidth;
					text.y = this._taskTopHeight + this._taskHeight/2;
					
					taskContainer.addChild(element, taskShape, text);
					
					taskShape.on("click", 
						_.bind(
								function(event) {
									if (this._listener) {
										this._listener.onClickOnTask(event, task);
									};
									event.stopPropagation ? event.stopPropagation() : (event.cancelBubble=true)
								}, this),
								false
					);
					element.on("click", 
							_.bind(
									function(event) {
										if (this._listener) {
											this._listener.onClickOnTaskContainer(event, task);
										};
										event.stopPropagation ? event.stopPropagation() : (event.cancelBubble=true)
									}, this),
									false
						);
					
					taskContainer.x = 0;
					taskContainer.y = this._taskRowHeight * (task.index() - 1) + this._rulerHeight;
					
					return taskContainer;
				},
				drawRestriction: function(restriction, task, project) {
					var container = new createjs.Container();
					
					var xf = (this.daysFromProjectStart(restriction.endingTask().earlyEnd(), project))*this._dayWidth;
					var yf = this._taskRowHeight * (restriction.endingTask().index() - 1) + this._rulerHeight + this._taskTopHeight + this._taskHeight/2;
					
					var xs = this.daysFromProjectStart(restriction.startingTask().earlyStart(), project)*this._dayWidth + this._arrowInTaskXOffset;
					var downwards = restriction.startingTask().index()>restriction.endingTask().index();
					if (downwards) {
						var ys = this._taskRowHeight * (restriction.startingTask().index() - 1) + this._rulerHeight + this._taskTopHeight;
					} else {
						var ys = this._taskRowHeight * (restriction.startingTask().index()) + this._rulerHeight - this._taskBottomHeight;
					}
					
					var base = new createjs.Shape();
					base.graphics
						.beginStroke(this._arrowColor)
						.beginFill(this._arrowColor)
						.drawCircle(xf, yf, this._arrowWidth  / 3)
						.endFill();
					
					var arrow = new createjs.Shape();
					arrow.graphics
						.setStrokeStyle(2,"round","round")
						.beginStroke(this._arrowColor)
						.moveTo(xf,yf)
						.lineTo(xf < xs ? xs-this._arrowCornerR : xs+this._arrowCornerR,yf)
						.arcTo(xs, yf, xs, yf + this._arrowCornerR * (downwards?1:-1), this._arrowCornerR)
						.lineTo(xs,ys);
					
					var head = new createjs.Shape();
					head.graphics
						.setStrokeStyle(1,"butt","miter")
						.beginStroke(this._arrowColor)
						.beginFill(this._arrowColor)
						.moveTo(xs,ys)
						.lineTo(xs + this._arrowWidth/2, ys - this._arrowHeight * (ys > yf ? 1 : -1))
						.lineTo(xs - this._arrowWidth/2, ys - this._arrowHeight * (ys > yf ? 1 : -1))
						.closePath()
						.endFill();
					
					container.addChild(arrow, base, head);
					
					return container;
					
				},
				clear: function() {
					this._stage.clear();
					this._stage.removeAllChildren();
					this._stage.update();
				},
				daysFromProjectStart: function(moment, project) {
					return moment.diff(project.start(), 'days', true);
				}
			});
		}
);