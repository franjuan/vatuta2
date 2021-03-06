/**
 * @module Canvas
 */
define(
		[ 'dojo/_base/declare', 'dojo/_base/lang', 'dojox/image', 'easeljs', 'lodash', 'moment', "vatuta/shared/Restriction", "vatuta/shared/Task", "vatuta/shared/SummaryTask" ],
		function(declare, lang, dojoImage, easeljs, _, moment, Restrictions, Task, SummaryTask) {
			return declare(null, {
				/**
				 * @constructs CanvasDrawer
				 */
				constructor : function(element, /* Object */kwArgs) {
					dojox.image.preload(["/icons/ic_add_circle_outline_black_48px.svg",
					                     "/icons/ic_info_outline_black_48px.svg",
					                     "/icons/ic_keyboard_arrow_up_black_48px.svg",
					                     "/icons/ic_keyboard_arrow_down_black_48px.svg",
					                     "icons/ic_delete_black_48px.svg",
					                     "/icons/ic_control_point_duplicate_black_48px.svg"
					                     ]);
					
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
					/* @member {String} */
					this._rulerColor = "#C5CAE9";
					/* @member {Number} */
					this._rulerHeightOffset = 0; //Height offset if ruler is drawn in the same canvas than gantt
					/* @member {Number} */
					this._toolBarHeight = 64; // Height of toolbarmenu
					
					lang.mixin(this, kwArgs);
					
					/* @member {Number} */
					this._parent = angular.element(element)[0];
					
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

					this._stage = new createjs.Stage(this._canvas);
					this._stage.enableMouseOver(20);
					
					this._rulerStage = new createjs.Stage(this._rulerCanvas);
					
					this._listener = null;
					
					// To scroll horizontally ruler and gantt at the same time
					$('#content > md-content').scroll(function(){
						  $('vatuta-gantt #ganttRuler').css('left',-$('#content > md-content').scrollLeft());
					});
					
					this._overTaskContainer = new createjs.Container();
					this._selectedTaskContainer = new createjs.Container();
				},
				listener: function(newListener) {
					return arguments.length ? (this._listener = newListener) : this._listener;
				},
				drawRulerRange: function(ruler, start, end, level, rulerLevel) {
					var currentLocaleData = moment.localeData();
					var element = new createjs.Shape();
					element.graphics.beginStroke("White").beginFill(this._rulerColor).drawRoundRect(this.getXbyMoment(start), level*this._rulerHeight/3, this.getXbyMoment(end) - this.getXbyMoment(start), this._rulerHeight/3, 5);
					
					var text = new createjs.Text(start.format(rulerLevel.format), "bold " + this._dayFontSize + "px " + this._dayFont);
					text.color = "White";
					text.maxWidth = this.getXbyMoment(start) + this.getXbyMoment(end);
					text.textBaseline = "middle";
					text.textAlign = "center";
					text.x = (this.getXbyMoment(start) + this.getXbyMoment(end))/2;
					text.y = (2*level+1)*this._rulerHeight/6;
					
					ruler.addChild(element);
					if (text.x>0) {
						ruler.addChild(text);
					}
					
					//this._rulerStage.update();
				},
				drawTimeRuler: function(project, $window) {
					this._rulerCanvas.width = Math.max(project.actualDuration().asDays() * this._dayWidth + 2*this._sideMargins, $window.innerWidth);
					this._rulerCanvas.height = this._rulerHeight;
					
					var ruler = new createjs.Container();
					
					var background = new createjs.Shape();
					background.graphics.beginFill("#FFF").drawRect(0,0, this._canvas.width, this._rulerHeight);
					ruler.addChild(background);
					
					var rulerLevels = [{unit: "month", steps: 1, format: "MMMM"},
					                   {unit: "week", steps: 1, format: "wo"},
					                   {unit: "day", steps: 1, format: "D"}];
					for (var h = 0; h < 3; h++) {
						var start = moment(this._leftMoment).startOf(rulerLevels[h].unit);
						var end = moment(start).add(rulerLevels[h].steps, rulerLevels[h].unit);
						do {
							this.drawRulerRange(ruler, start, end, h, rulerLevels[h]);
							
							end = start;
							start = moment(end).subtract(rulerLevels[h].steps, rulerLevels[h].unit);
						} while (this.getXbyMoment(end) >= 0);
						end = moment(this._leftMoment).startOf(rulerLevels[h].unit).add(rulerLevels[h].steps, rulerLevels[h].unit);
						do {
							start = end;
							end = moment(start).add(rulerLevels[h].steps, rulerLevels[h].unit);
							
							this.drawRulerRange(ruler, start, end, h, rulerLevels[h]);
						} while (this.getXbyMoment(start) <= this._rulerCanvas.width);
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
					this._height = Math.max(this._rulerHeightOffset + this._taskRowHeight * project.tasks().length, $window.innerHeight - this._rulerHeightOffset -this._toolBarHeight - 2*this._dayWidth);

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
					
//					if (selectedTask) {
//						this.drawSelectedTask(selectedTask, project);
//					}
					
					this._stage.addChild(this._overTaskContainer, this._selectedTaskContainer);
					
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
									this.drawClickedTask(task, project);
									if (this._listener) {
										this._listener.onClickOnTask(event, task);
									};
									event.stopPropagation ? event.stopPropagation() : (event.cancelBubble=true)
								}, this),
								false
					);
					taskShape.on("rollover", 
									function(event) {
										this.drawOverTask(task, project);
										event.stopPropagation ? event.stopPropagation() : (event.cancelBubble=true)
									}, this, false, null, false
						);
					taskShape.on("rollout", 
									function(event) {
										this.drawOutTask(task, project);
										event.stopPropagation ? event.stopPropagation() : (event.cancelBubble=true)
									}, this, false, null, false
						);
					element.on("click", 
							_.bind(
									function(event) {
										this._selectedTaskContainer.removeAllChildren();
										if (this._listener) {
											this._listener.onClickOnTaskContainer(event, task);
										};
										event.stopPropagation ? event.stopPropagation() : (event.cancelBubble=true)
										this._stage.update();
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
				drawClickedTask: function(task, project){
					this._selectedTaskContainer.removeAllChildren();
					
					if (!!task) {
						var earlyLateLimitsContainer = this.drawEarlyLateLimits(task, project);
						
						this._selectedTaskContainer.addChild(earlyLateLimitsContainer);
					}
					
//					var scale = 0.40;
//					
//					this.drawTaskOperation(
//							"moveUpTask",
//							"/icons/ic_keyboard_arrow_up_black_48px.svg",
//							this._rulerColor,
//							scale - 0.10,
//							task,
//							"center",
//							"top");
//					
//					this.drawTaskOperation(
//							"moveDownTask",
//							"/icons/ic_keyboard_arrow_down_black_48px.svg",
//							this._rulerColor,
//							scale - 0.10,
//							task,
//							"center",
//							"bottom");
//					
//					this.drawTaskOperation(
//							"showTaskInfo",
//							"/icons/ic_info_outline_black_48px.svg",
//							this._rulerColor,
//							scale + 0.10,
//							task,
//							"center",
//							"center");
//					
//					this.drawTaskOperation(
//							"deleteTask",
//							"icons/ic_delete_black_48px.svg",
//							"#FF5252",
//							scale,
//							task,
//							"right",
//							"top");
//					
//					this.drawTaskOperation(
//							"addChild",
//							"/icons/ic_control_point_duplicate_black_48px.svg",
//							this._rulerColor,
//							scale,
//							task,
//							"right",
//							"bottom");
//					
//					this.drawTaskOperation(
//							"addSiblingBefore",
//							"/icons/ic_add_circle_outline_black_48px.svg",
//							this._rulerColor,
//							scale,
//							task,
//							"left",
//							"top");
//					
//					this.drawTaskOperation(
//							"addSiblingAfter",
//							"/icons/ic_add_circle_outline_black_48px.svg",
//							this._rulerColor,
//							scale,
//							task,
//							"left",
//							"bottom");
					
					this._stage.update();
					
					return this._selectedTaskContainer;
				},
				drawTaskOperation: function(operation, icon, color, scale, task, horizontal, vertical) {
					var image = new Image();
		            image.src = icon;
		            image.onload = _.bind(handleImageLoad,this);
					
		            function handleImageLoad(event) {
		                var image = event.target;
		                var bitmap = new createjs.Bitmap(image);
		                bitmap.scaleX = scale;
		                bitmap.scaleY = scale;
		                var r = bitmap.getBounds().width * scale / 2;
		                var x = 0;
		                if (horizontal == "left") {
		                	x = Math.min(this.getXbyMoment(task.actualStart()), (this.getXbyMoment(task.actualEnd()) + this.getXbyMoment(task.actualStart()))/2 - 3*r);
		                } else if (horizontal == "right") {
		                	x = Math.max(this.getXbyMoment(task.actualEnd()) - 2*r, (this.getXbyMoment(task.actualEnd()) + this.getXbyMoment(task.actualStart()))/2 + r);
		                } else {
		                	x = (this.getXbyMoment(task.actualEnd()) + this.getXbyMoment(task.actualStart()))/2 - r; 
		                }
		                bitmap.x = x;
		                var y = 0;
		                if (vertical == "top") {
		                	y = this._taskRowHeight * (task.index() - 1) + this._rulerHeightOffset + this._taskTopHeight - 2*r;
		                } else if (vertical == "bottom") {
		                	y = this._taskRowHeight * (task.index()) + this._rulerHeightOffset - this._taskBottomHeight;
		                } else {
		                	y = this._taskRowHeight * (task.index() - 1) + this._rulerHeightOffset + this._taskTopHeight + (this._taskHeight - 2*r)/2;
		                }
		                bitmap.y = y;
		                var circle = new createjs.Shape();
		            	circle.graphics.beginFill(color).drawCircle(x + r, y + r, r);
		            	circle.shadow = new createjs.Shadow("#000000", 1, 1, 5);
		                this._selectedTaskContainer.addChild(circle, bitmap);
		                
		                circle.on("click", 
								_.bind(
										function(event) {
											if (this._listener) {
												this._listener.onClickTaskOperation(event, task, operation);
											};
											event.stopPropagation ? event.stopPropagation() : (event.cancelBubble=true)
											this._selectedTaskContainer.removeAllChildren();
											this._stage.update();
										}, this),
										false
							);
		                
		                this._stage.update();
		            }
				},
				drawOverTask: function(task, project){
					this._overTaskContainer.removeAllChildren();
					
//					if (!!task) {
//						var earlyLateLimitsContainer = this.drawEarlyLateLimits(task, project);
//						
//						this._overTaskContainer.addChild(earlyLateLimitsContainer);
//					}
					
					this._stage.update();
					
					return this._overTaskContainer;
				},
				drawOutTask: function(task, project){
					this._overTaskContainer.removeAllChildren();
					
					this._stage.update();
					
					return this._overTaskContainer;
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
					this._selectedTaskContainer.removeAllChildren();
					this._overTaskContainer.removeAllChildren();
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