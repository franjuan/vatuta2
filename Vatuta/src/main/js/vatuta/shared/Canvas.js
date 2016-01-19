/**
 * @module Canvas
 */
define(
		[ 'dojo/_base/declare', 'dojo/_base/lang', 'easeljs', 'lodash', 'moment', "vatuta/shared/Restriction", "vatuta/shared/Task", "vatuta/shared/SummaryTask" ],
		function(declare, lang, easeljs, _, moment, Restrictions, Task, SummaryTask) {
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
					this._arrowCornerR = 10;
					/* @member {Number} */
					this._connectorRatio = this._arrowWidth  / 3;
					/* @member {Number} */
					this._sideMargins = this._arrowWidth  + this._arrowCornerR;
					/* @member {String} */
					this._earlyLateLimitsColor = "#607D8B";
					/* @member {Number} */
					this._rulerHeightOffset = 0; //Height offset if ruler is drawn in the same canvas than gantt
					
					lang.mixin(this, kwArgs);
					
					/* @member {Number} */
					this._parent = angular.element(element)[0];
					
//					parent.addEventListener("click", 
//							_.bind(
//									function(event) {
//										if (this._listener && event.target.localName != 'canvas') {
//											this._listener.onClickOnTaskContainer(event);
//										};
//									}, this),
//									false
//						);
					
					this._width = this._parent.offsetWidth;
					/* @member {Number} */
					this._height = this._parent.offsetHeight;
					
					this._taskRowHeight= this._taskTopHeight + this._taskHeight + this._taskBottomHeight;
					
					this._rulerCanvas = angular.element("#ganttRuler")[0];
					this._rulerCanvas.width = this._width;
					this._rulerCanvas.heigth = this._rulerHeight;
					
					this._canvas = angular.element("#ganttCanvas")[0];
					this._canvas.width = this._width;
					this._canvas.height = this._height;
					
				    /* @member {Object} */
					this._stage = new createjs.Stage(this._canvas);
					this._rulerStage = new createjs.Stage(this._rulerCanvas);
					
					this._listener = null;
					
					// To scroll horizontally ruler and gantt at the same time
					$('#content > md-content').scroll(function(){
						  $('vatuta-gantt #ganttRuler').css('left',-$('#content > md-content').scrollLeft());
					});
				},
				listener: function(newListener) {
					return arguments.length ? (this._listener = newListener) : this._listener;
				},
				drawRulerRange: function(ruler, start, end, level, unit) {
					var currentLocaleData = moment.localeData();
					var element = new createjs.Shape();
					element.graphics.beginStroke("White").beginFill("#C5CAE9").drawRoundRect(this.getXbyMoment(start), level*this._rulerHeight/3, this.getXbyMoment(end) - this.getXbyMoment(start), this._rulerHeight/3, 5);
					
					var text = new createjs.Text(start.get(unit), "bold " + this._dayFontSize + "px " + this._dayFont);
					text.color = "White";
					text.maxWidth = this.getXbyMoment(start) + this.getXbyMoment(end);
					text.textBaseline = "middle";
					text.textAlign = "center";
					text.x = (this.getXbyMoment(start) + this.getXbyMoment(end))/2;
					text.y = (2*level+1)*this._rulerHeight/6;
					
					ruler.addChild(element, text);
				},
				drawTimeRuler: function(project, $window) {
					this._rulerCanvas.width = Math.max(project.actualDuration().asDays() * this._dayWidth + 2*this._sideMargins, $window.innerWidth);
					this._rulerCanvas.height = this._rulerHeight;
					
					var ruler = new createjs.Container();
					
					var background = new createjs.Shape();
					background.graphics.beginFill("#FFF").drawRect(0,0, this._canvas.width, this._rulerHeight);
					ruler.addChild(background);
					
					var rulerLevels = ["month", "week", "day"]
					for (var h = 0; h < 2; h++) {
						var start = moment(this._leftMoment).startOf(rulerLevels[h]);
						var end = moment(this._leftMoment).endOf(rulerLevels[h]);
						do {
							this.drawRulerRange(ruler, start, end, h, rulerLevels[h]);
							
							end = start;
							start = moment(end).subtract(1, rulerLevels[h]);
						} while (this.getXbyMoment(start) >= 0);
						endX = moment(this._leftMoment).endOf(rulerLevels[h]);
						do {
							start = end;
							end = moment(start).add(1, rulerLevels[h]);
							
							this.drawRulerRange(ruler, start, end, h, rulerLevels[h]);
						} while (this.getXbyMoment(end) <= this._rulerCanvas.width);
					}
					
					for (var h = 2; h < 3; h++) {
						var dayCounter = moment(this._leftMoment).subtract(1,"day");
						for (i=-1; i*this._dayWidth < this._width; i++) {
							var element = new createjs.Shape();
							element.graphics.beginFill("#C5CAE9").drawRoundRect(i*this._dayWidth + this._sideMargins, h*this._rulerHeight/3, this._dayWidth, this._rulerHeight/3, 5);
	
							var text = new createjs.Text(dayCounter.date(), "bold " + this._dayFontSize + "px " + this._dayFont);
							text.color = "White";
							text.maxWidth = this._dayWidth;
							text.textBaseline = "middle";
							text.textAlign = "center";
							text.x = this._dayWidth*(i + 1/2) + this._sideMargins;
							text.y = (2*h+1)*this._rulerHeight/6;
							
							ruler.addChild(element, text);
							dayCounter.add(1,"day");
						}
					}
					ruler.x = 0;
					ruler.y = 0;
					this._rulerStage.addChild(ruler);
					//this._stage.addChild(ruler); // TODO Verificar que pintar dos veces el ruler no afecta al rendimiento

					this._rulerStage.update();
					//this._stage.update();
			
				},
				drawProject: function(project, selectedTask, $window) {
					this._width = Math.max(project.actualDuration().asDays() * this._dayWidth + 2*this._sideMargins, $window.innerWidth - this._dayWidth);
					this._height = Math.max(this._rulerHeightOffset + this._taskRowHeight * project.tasks().length, $window.innerHeight - this._rulerHeightOffset - 2*this._dayWidth);

					this._canvas.width = this._width;
					this._canvas.height = this._height;
					
					this._leftMoment =
						(project.actualDuration().asDays() * this._dayWidth + 2*this._sideMargins < this._width) ?
									moment(project.actualStart()).subtract(
											(this._width - 2*this._sideMargins - (project.actualDuration().asDays() * this._dayWidth))/(2*this._dayWidth),
											"days").startOf("day"):
									moment(project.actualStart()).startOf("day");

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
					
					if (selectedTask) {
						this.drawSelectedTask(selectedTask, project);
					}
					
					this._stage.update();
				},
				drawTask: function(task, project) {
					if (task.isInstanceOf(Task)) {
						return this.drawBasicTask(task, project);
					} else if (task.isInstanceOf(SummaryTask)) {
						return this.drawSummaryTask(task, project);
					}
				},
				drawBasicTask: function (task, project) {
					// Consider hours in drawing, not whole days
					var taskContainer = new createjs.Container();
					
					var element = new createjs.Shape();
					element.graphics.beginFill("#FFF").drawRect(0,0, this._canvas.width, this._taskRowHeight);
					
					var taskShape = new createjs.Shape();
					taskShape.mouseChildren = false;
					var daysFromStart = this.daysFromProjectStart(task.actualStart(), project);
					var daysFromEnd = this.daysFromProjectStart(task.actualEnd(), project);
					var durationInDays = daysFromEnd - daysFromStart;
					taskShape.graphics.beginFill(this._taskBgColor).drawRect(
							daysFromStart*this._dayWidth + this._sideMargins,
							this._taskTopHeight,
							durationInDays*this._dayWidth,
							this._taskHeight);
					//taskShape.shadow = new createjs.Shadow("#000000", 3, 3, 10);
					
					var text = new createjs.Text(task.name(), "bold " + this._taskFontSize + "px " + this._taskFont);
					text.color = this._taskNameColor;
					text.maxWidth = durationInDays*this._dayWidth;
					text.textBaseline = "middle";
					text.textAlign = "center";
					text.x = (daysFromStart + durationInDays/2)*this._dayWidth + this._sideMargins;
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
					taskContainer.y = this._taskRowHeight * (task.index() - 1) + this._rulerHeightOffset;
					
					return taskContainer;
				},
				drawSummaryTask: function (task, project) {
					var taskContainer = this.drawBasicTask(task, project);
					
					var bag = new createjs.Shape();
					
					var daysFromStart = this.daysFromProjectStart(task.actualStart(), project);
					var daysFromEnd = this.daysFromProjectStart(task.actualEnd(), project);
					var durationInDays = daysFromEnd - daysFromStart;
					bag.graphics
						.beginStroke(this._arrowColor)
						.setStrokeDash([10, 3], 0)
						.moveTo(daysFromStart*this._dayWidth + this._sideMargins, this._taskTopHeight + this._taskHeight)
						.lineTo(daysFromStart*this._dayWidth + this._sideMargins, this._taskRowHeight * (task.maxIndex() - task.index() + 1))
						.lineTo(daysFromStart*this._dayWidth + this._sideMargins + durationInDays*this._dayWidth, this._taskRowHeight * (task.maxIndex() - task.index() + 1))
						.lineTo(daysFromStart*this._dayWidth + this._sideMargins + durationInDays*this._dayWidth, this._taskTopHeight + this._taskHeight);
					
					taskContainer.addChild(bag);
					
					return taskContainer;
				},
				drawSelectedTask: function(task, project, $window){
					if (this._selectedTaskContainer) {
						this._selectedTaskContainer.removeAllChildren();
					} else {
						this._selectedTaskContainer = new createjs.Container();
						this._stage.addChild(this._selectedTaskContainer);
					}
					
					if (task) {
						var earlyLateLimitsContainer = this.drawEarlyLateLimits(task, project);
						
						this._selectedTaskContainer.addChild(earlyLateLimitsContainer);
					}
					
					this._stage.update();
					
					return this._selectedTaskContainer;
				},
				drawEarlyLateLimits: function(task, project){
					var earlyLateLimitsContainer = new createjs.Container();
					
					var base = this._taskTopHeight/Math.sin(Math.PI * 2 / 3);
					
					var earlyStart = this.daysFromProjectStart(task.earlyStart(), project);
					var lateStart = this.daysFromProjectStart(task.lateStart(), project);
					var startShape = new createjs.Shape();
					startShape.graphics
						.setStrokeStyle(1,"round","round")
						.beginStroke(this._earlyLateLimitsColor)
						.beginFill(this._earlyLateLimitsColor)
						.moveTo(earlyStart*this._dayWidth, this._taskTopHeight)
						.lineTo(earlyStart*this._dayWidth - base/2, 0)
						.lineTo(earlyStart*this._dayWidth + base/2, 0)
						.closePath()
						.endFill()
						.moveTo(earlyStart*this._dayWidth + base/2, 0)
						.lineTo(lateStart*this._dayWidth - base/2, 0)
						.beginStroke(this._earlyLateLimitsColor)
						.beginFill(this._earlyLateLimitsColor)
						.moveTo(lateStart*this._dayWidth, this._taskTopHeight)
						.lineTo(lateStart*this._dayWidth - base/2, 0)
						.lineTo(lateStart*this._dayWidth + base/2, 0)
						.closePath()
						.endFill();
					
					var earlyEnd = this.daysFromProjectStart(task.earlyEnd(), project);
					var lateEnd = this.daysFromProjectStart(task.lateEnd(), project);
					var endShape = new createjs.Shape();
					endShape.graphics
						.setStrokeStyle(1,"round","round")
						.beginStroke(this._earlyLateLimitsColor)
						.beginFill(this._earlyLateLimitsColor)
						.moveTo(earlyEnd*this._dayWidth, this._taskTopHeight + this._taskHeight)
						.lineTo(earlyEnd*this._dayWidth - base/2, 2*this._taskTopHeight + this._taskHeight)
						.lineTo(earlyEnd*this._dayWidth + base/2, 2*this._taskTopHeight + this._taskHeight)
						.closePath()
						.endFill()
						.moveTo(earlyEnd*this._dayWidth + base/2, 2*this._taskTopHeight + this._taskHeight)
						.lineTo(lateEnd*this._dayWidth - base/2, 2*this._taskTopHeight + this._taskHeight)
						.beginStroke(this._earlyLateLimitsColor)
						.beginFill(this._earlyLateLimitsColor)
						.moveTo(lateEnd*this._dayWidth, this._taskTopHeight + this._taskHeight)
						.lineTo(lateEnd*this._dayWidth - base/2, 2*this._taskTopHeight + this._taskHeight)
						.lineTo(lateEnd*this._dayWidth + base/2, 2*this._taskTopHeight + this._taskHeight)
						.closePath()
						.endFill();
					
					earlyLateLimitsContainer.addChild(startShape, endShape);
					
					earlyLateLimitsContainer.x = this._sideMargins;
					earlyLateLimitsContainer.y = this._taskRowHeight * (task.index() - 1) + this._rulerHeightOffset;
					
					return earlyLateLimitsContainer;
				},
				drawRestriction: function(restriction, task, project) {
					if (restriction.isInstanceOf(Restrictions.EndToStart)) {
						return this.drawEndToStartRestriction(restriction, task, project);
					} else if (restriction.isInstanceOf(Restrictions.EndToEnd)) {
						return this.drawEndToEndRestriction(restriction, task, project);
					} else if (restriction.isInstanceOf(Restrictions.StartToStart)) {
						return this.drawStartToStartRestriction(restriction, task, project);
					} else if (restriction.isInstanceOf(Restrictions.StartToEnd)) {
						return this.drawStartToEndRestriction(restriction, task, project);
					}
				},
				drawEndToStartRestriction: function(restriction, task, project) {
					var container = new createjs.Container();
					
					// X position of ending task
					var x1 = (this.daysFromProjectStart(restriction.dependency().actualEnd(), project))*this._dayWidth + this._sideMargins;
					// X position of starting task
					var x2 = this.daysFromProjectStart(restriction.dependant().actualStart(), project)*this._dayWidth + this._sideMargins;
					
					// Directions 
					var downwards = restriction.dependant().index() > restriction.dependency().index();
					var backwards = x2 < x1;
					// To allow curve from beginning
					if (x1==x2) x2+=this._arrowCornerR;
					
					if (!backwards) {
						var y1 = this._taskRowHeight * (restriction.dependency().index() - 1) + this._rulerHeightOffset + this._taskTopHeight + this._taskHeight/2;
					} else {
						if (!downwards) {
							var y1 = this._taskRowHeight * (restriction.dependency().index() - 1) + this._rulerHeightOffset + this._taskTopHeight;
						} else {
							var y1 = this._taskRowHeight * (restriction.dependency().index() - 1) + this._rulerHeightOffset + this._taskTopHeight + this._taskHeight;
						}
					}
					
					if (downwards) {
						var y2 = this._taskRowHeight * (restriction.dependant().index() - 1) + this._rulerHeightOffset + this._taskTopHeight;
					} else {
						var y2 = this._taskRowHeight * (restriction.dependant().index()) + this._rulerHeightOffset - this._taskBottomHeight;
					}
					
					var base = new createjs.Shape();
					base.graphics
						.beginStroke(this._arrowColor)
						.beginFill(this._arrowColor)
						.drawCircle(x1, y1, this._connectorRatio)
						.endFill();
					
					var arrow = new createjs.Shape();
					if (!backwards) {
						arrow.graphics
							.setStrokeStyle(2,"round","round")
							.beginStroke(this._arrowColor)
							.moveTo(x1, y1)
							.lineTo(x2 - this._arrowCornerR, y1)
							.arcTo(x2, y1, x2, y1 + this._arrowCornerR * (downwards?1:-1), this._arrowCornerR)
							.lineTo(x2,y2);
					} else {
						arrow.graphics
							.setStrokeStyle(2,"round","round")
							.beginStroke(this._arrowColor)
							.moveTo(x1,y1)
							.arcTo(x1, y1 + this._arrowCornerR * (downwards?1:-1), x1 - this._arrowCornerR, y1 + this._arrowCornerR * (downwards?1:-1), this._arrowCornerR)
							.lineTo(x2 + this._arrowCornerR, y1 + this._arrowCornerR * (downwards?1:-1))
							.arcTo(x2, y1 + this._arrowCornerR * (downwards?1:-1), x2, y1 + 2*this._arrowCornerR * (downwards?1:-1), this._arrowCornerR)
							.lineTo(x2,y2);
					}
					
					var head = new createjs.Shape();
					head.graphics
						.setStrokeStyle(1,"butt","miter")
						.beginStroke(this._arrowColor)
						.beginFill(this._arrowColor)
						.moveTo(x2,y2)
						.lineTo(x2 + this._arrowWidth/2, y2 - this._arrowHeight * (y2 > y1 ? 1 : -1))
						.lineTo(x2 - this._arrowWidth/2, y2 - this._arrowHeight * (y2 > y1 ? 1 : -1))
						.closePath()
						.endFill();
					
					container.addChild(arrow, base, head);
					
					return container;
					
				},
				drawStartToEndRestriction: function(restriction, task, project) {
					var container = new createjs.Container();
					
					// X position of ending task
					var x1 = (this.daysFromProjectStart(restriction.dependency().actualStart(), project))*this._dayWidth + this._sideMargins;
					// X position of starting task
					var x2 = this.daysFromProjectStart(restriction.dependant().actualEnd(), project)*this._dayWidth + this._sideMargins;
					
					// Directions 
					var downwards = restriction.dependant().index() > restriction.dependency().index();
					var backwards = x2 <= x1;
					// To allow curve from beginning
					if (x1==x2) x2-=this._arrowCornerR;
					
					if (backwards) {
						var y1 = this._taskRowHeight * (restriction.dependency().index() - 1) + this._rulerHeightOffset + this._taskTopHeight + this._taskHeight/2;
					} else {
						if (!downwards) {
							var y1 = this._taskRowHeight * (restriction.dependency().index() - 1) + this._rulerHeightOffset + this._taskTopHeight;
						} else {
							var y1 = this._taskRowHeight * (restriction.dependency().index() - 1) + this._rulerHeightOffset + this._taskTopHeight + this._taskHeight;
						}
					}
					
					if (downwards) {
						var y2 = this._taskRowHeight * (restriction.dependant().index() - 1) + this._rulerHeightOffset + this._taskTopHeight;
					} else {
						var y2 = this._taskRowHeight * (restriction.dependant().index()) + this._rulerHeightOffset - this._taskBottomHeight;
					}
					
					var base = new createjs.Shape();
					base.graphics
						.beginStroke(this._arrowColor)
						.beginFill(this._arrowColor)
						.drawCircle(x1, y1, this._connectorRatio)
						.endFill();
					
					var arrow = new createjs.Shape();
					if (backwards) {
						arrow.graphics
							.setStrokeStyle(2,"round","round")
							.beginStroke(this._arrowColor)
							.moveTo(x1, y1)
							.lineTo(x2 + this._arrowCornerR, y1)
							.arcTo(x2, y1, x2, y1 + this._arrowCornerR * (downwards?1:-1), this._arrowCornerR)
							.lineTo(x2,y2);
					} else {
						arrow.graphics
							.setStrokeStyle(2,"round","round")
							.beginStroke(this._arrowColor)
							.moveTo(x1,y1)
							.arcTo(x1, y1 + this._arrowCornerR * (downwards?1:-1), x1 + this._arrowCornerR, y1 + this._arrowCornerR * (downwards?1:-1), this._arrowCornerR)
							.lineTo(x2 - this._arrowCornerR, y1 + this._arrowCornerR * (downwards?1:-1))
							.arcTo(x2, y1 + this._arrowCornerR * (downwards?1:-1), x2, y1 + 2*this._arrowCornerR * (downwards?1:-1), this._arrowCornerR)
							.lineTo(x2,y2);
					}
					
					var head = new createjs.Shape();
					head.graphics
						.setStrokeStyle(1,"butt","miter")
						.beginStroke(this._arrowColor)
						.beginFill(this._arrowColor)
						.moveTo(x2,y2)
						.lineTo(x2 + this._arrowWidth/2, y2 - this._arrowHeight * (y2 > y1 ? 1 : -1))
						.lineTo(x2 - this._arrowWidth/2, y2 - this._arrowHeight * (y2 > y1 ? 1 : -1))
						.closePath()
						.endFill();
					
					container.addChild(arrow, base, head);
					
					return container;
					
				},
				drawEndToEndRestriction: function(restriction, task, project) {
					var container = new createjs.Container();
					
					// X position of ending task
					var x1 = this.daysFromProjectStart(restriction.dependency().actualEnd(), project)*this._dayWidth + this._sideMargins;
					// X position of starting task
					var x2 = this.daysFromProjectStart(restriction.dependant().actualEnd(), project)*this._dayWidth + this._sideMargins;
					
					// Directions 
					var downwards = restriction.dependant().index() > restriction.dependency().index();
					var backwards = x2 < x1;
					
					// Y position
					var y1 = this._taskRowHeight * (restriction.dependency().index() - 1) + this._rulerHeightOffset + this._taskTopHeight + this._taskHeight/2;
					var y2 = this._taskRowHeight * (restriction.dependant().index() - 1) + this._rulerHeightOffset + this._taskTopHeight + this._taskHeight/2;
					
					var base = new createjs.Shape();
					base.graphics
						.beginStroke(this._arrowColor)
						.beginFill(this._arrowColor)
						.drawCircle(x1, y1, this._connectorRatio)
						.endFill();
					
					var arrow = new createjs.Shape();
					if (backwards) {
						arrow.graphics
							.setStrokeStyle(2,"round","round")
							.beginStroke(this._arrowColor)
							.moveTo(x1, y1)
							.lineTo(x1 + this._arrowHeight, y1)
							.arcTo(x1 + this._arrowCornerR + this._arrowHeight, y1, x1 + this._arrowCornerR + this._arrowHeight, y1 + this._arrowCornerR * (downwards?1:-1), this._arrowCornerR)
							.lineTo(x1 + this._arrowCornerR + this._arrowHeight, y2 + this._arrowCornerR * (downwards?-1:+1))
							.arcTo(x1 + this._arrowCornerR + this._arrowHeight, y2, x1 + this._arrowHeight, y2, this._arrowCornerR)
							.lineTo(x2,y2);
					} else {
						arrow.graphics
							.setStrokeStyle(2,"round","round")
							.beginStroke(this._arrowColor)
							.moveTo(x1, y1)
							.lineTo(x2 + this._arrowHeight, y1)
							.arcTo(x2 + this._arrowCornerR + this._arrowHeight, y1, x2 + this._arrowCornerR + this._arrowHeight, y1 + this._arrowCornerR * (downwards?1:-1), this._arrowCornerR)
							.lineTo(x2 + this._arrowCornerR + this._arrowHeight, y2 + this._arrowCornerR * (downwards?-1:+1))
							.arcTo(x2 + this._arrowCornerR + this._arrowHeight, y2, x2 + this._arrowHeight, y2, this._arrowCornerR)
							.lineTo(x2,y2);
					}
					
					var head = new createjs.Shape();
					head.graphics
						.setStrokeStyle(1,"butt","miter")
						.beginStroke(this._arrowColor)
						.beginFill(this._arrowColor)
						.moveTo(x2,y2)
						.lineTo(x2 + this._arrowHeight, y2 - this._arrowWidth/2)
						.lineTo(x2 + this._arrowHeight, y2 + this._arrowWidth/2)
						.closePath()
						.endFill();
					
					container.addChild(arrow, base, head);
					
					return container;
					
				},
				drawStartToStartRestriction: function(restriction, task, project) {
					var container = new createjs.Container();
					
					// X position of ending task
					var x1 = this.daysFromProjectStart(restriction.dependency().actualStart(), project)*this._dayWidth + this._sideMargins;
					// X position of starting task
					var x2 = this.daysFromProjectStart(restriction.dependant().actualStart(), project)*this._dayWidth + this._sideMargins;
					
					// Directions 
					var downwards = restriction.dependant().index() > restriction.dependency().index();
					var backwards = x2 < x1;
					
					// Y position
					var y1 = this._taskRowHeight * (restriction.dependency().index() - 1) + this._rulerHeightOffset + this._taskTopHeight + this._taskHeight/2;
					var y2 = this._taskRowHeight * (restriction.dependant().index() - 1) + this._rulerHeightOffset + this._taskTopHeight + this._taskHeight/2;
					
					var base = new createjs.Shape();
					base.graphics
						.beginStroke(this._arrowColor)
						.beginFill(this._arrowColor)
						.drawCircle(x1, y1, this._connectorRatio)
						.endFill();
					
					var arrow = new createjs.Shape();
					if (!backwards) {
						arrow.graphics
							.setStrokeStyle(2,"round","round")
							.beginStroke(this._arrowColor)
							.moveTo(x1, y1)
							.lineTo(x1 - this._arrowHeight, y1)
							.arcTo(x1 - this._arrowCornerR - this._arrowHeight, y1, x1 - this._arrowCornerR - this._arrowHeight, y1 + this._arrowCornerR * (downwards?1:-1), this._arrowCornerR)
							.lineTo(x1 - this._arrowCornerR - this._arrowHeight, y2 + this._arrowCornerR * (downwards?-1:+1))
							.arcTo(x1 - this._arrowCornerR - this._arrowHeight, y2, x1 - this._arrowHeight, y2, this._arrowCornerR)
							.lineTo(x2,y2);
					} else {
						arrow.graphics
							.setStrokeStyle(2,"round","round")
							.beginStroke(this._arrowColor)
							.moveTo(x1, y1)
							.lineTo(x2 - this._arrowHeight, y1)
							.arcTo(x2 - this._arrowCornerR - this._arrowHeight, y1, x2 - this._arrowCornerR - this._arrowHeight, y1 + this._arrowCornerR * (downwards?1:-1), this._arrowCornerR)
							.lineTo(x2 - this._arrowCornerR - this._arrowHeight, y2 + this._arrowCornerR * (downwards?-1:+1))
							.arcTo(x2 - this._arrowCornerR - this._arrowHeight, y2, x2 - this._arrowHeight, y2, this._arrowCornerR)
							.lineTo(x2,y2);
					}
					
					var head = new createjs.Shape();
					head.graphics
						.setStrokeStyle(1,"butt","miter")
						.beginStroke(this._arrowColor)
						.beginFill(this._arrowColor)
						.moveTo(x2,y2)
						.lineTo(x2 - this._arrowHeight, y2 - this._arrowWidth/2)
						.lineTo(x2 - this._arrowHeight, y2 + this._arrowWidth/2)
						.closePath()
						.endFill();
					
					container.addChild(arrow, base, head);
					
					return container;
					
				},
				clear: function() {
					this._stage.clear();
					this._stage.removeAllChildren();
					if (this._selectedTaskContainer) {
						this._selectedTaskContainer.removeAllChildren();
						delete this._selectedTaskContainer;
					}
					this._stage.update();
				},
				daysFromProjectStart: function(moment, project) {
					return moment.diff(this._leftMoment, 'days', true);
				},
				getXbyMoment: function(moment) {
					return moment.diff(this._leftMoment, 'days', true) * this._dayWidth + this._sideMargins;
				}
			});
		}
);