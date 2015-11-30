/**
 * @module Canvas
 */
define(
		[ 'dojo/_base/declare', 'dojo/_base/lang', 'easeljs', 'lodash', 'moment', "./vatuta/restriction.js" ],
		function(declare, lang, easeljs, _, moment, Restrictions) {
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
					
					$('#content > md-content').scroll(function(){
						  $('vatuta-gantt #ganttRuler').css('left',-$('#content > md-content').scrollLeft());
					});
				},
				listener: function(newListener) {
					return arguments.length ? (this._listener = newListener) : this._listener;
				},
				drawTimeRuler: function(project) {
					this._rulerCanvas.width = this._canvas.width;
					this._rulerCanvas.height = this._rulerHeight;
					
					var ruler = new createjs.Container();
					
					var background = new createjs.Shape();
					background.graphics.beginFill("#FFF").drawRect(0,0, this._canvas.width, this._rulerHeight);
					ruler.addChild(background);
					
					var dayCounter = moment(project.actualStart().subtract(1,"day"));
					for (i=-1; i*this._dayWidth < this._width; i++) {
						var element = new createjs.Shape();
						element.graphics.beginFill("#C5CAE9").drawRoundRect(i*this._dayWidth + this._sideMargins, 0, this._dayWidth, this._rulerHeight, 5);

						var text = new createjs.Text(dayCounter.date(), "bold " + this._dayFontSize + "px " + this._dayFont);
						text.color = "White";
						text.maxWidth = this._dayWidth;
						text.textBaseline = "middle";
						text.textAlign = "center";
						text.x = this._dayWidth*(i + 1/2) + this._sideMargins;
						text.y = this._rulerHeight/2;
						
						ruler.addChild(element, text);
						dayCounter.add(1,"day");
					}
					ruler.x = 0;
					ruler.y = 0;
					this._rulerStage.addChild(ruler);
					this._stage.addChild(ruler); // TODO Verificar que pintar dos veces el ruler no afecta al rendimiento

					this._rulerStage.update();
					this._stage.update();
			
				},
				drawProject: function(project) {
					
					this._width = project.actualDuration().asDays() * this._dayWidth + 2*this._sideMargins;
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
					var daysFromStart = this.daysFromProjectStart(task.actualStart(), project);
					var daysFromEnd = this.daysFromProjectStart(task.actualEnd(), project);
					var durationInDays = daysFromEnd - daysFromStart;
					taskShape.graphics.beginFill(this._taskBgColor).drawRect(
							daysFromStart*this._dayWidth + this._sideMargins,
							this._taskTopHeight,
							durationInDays*this._dayWidth,
							this._taskHeight);
					
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
					taskContainer.y = this._taskRowHeight * (task.index() - 1) + this._rulerHeight;
					
					return taskContainer;
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
						var y1 = this._taskRowHeight * (restriction.dependency().index() - 1) + this._rulerHeight + this._taskTopHeight + this._taskHeight/2;
					} else {
						if (!downwards) {
							var y1 = this._taskRowHeight * (restriction.dependency().index() - 1) + this._rulerHeight + this._taskTopHeight;
						} else {
							var y1 = this._taskRowHeight * (restriction.dependency().index() - 1) + this._rulerHeight + this._taskTopHeight + this._taskHeight;
						}
					}
					
					if (downwards) {
						var y2 = this._taskRowHeight * (restriction.dependant().index() - 1) + this._rulerHeight + this._taskTopHeight;
					} else {
						var y2 = this._taskRowHeight * (restriction.dependant().index()) + this._rulerHeight - this._taskBottomHeight;
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
					var backwards = x2 < x1;
					// To allow curve from beginning
					if (x1==x2) x2-=this._arrowCornerR;
					
					if (backwards) {
						var y1 = this._taskRowHeight * (restriction.dependency().index() - 1) + this._rulerHeight + this._taskTopHeight + this._taskHeight/2;
					} else {
						if (!downwards) {
							var y1 = this._taskRowHeight * (restriction.dependency().index() - 1) + this._rulerHeight + this._taskTopHeight;
						} else {
							var y1 = this._taskRowHeight * (restriction.dependency().index() - 1) + this._rulerHeight + this._taskTopHeight + this._taskHeight;
						}
					}
					
					if (downwards) {
						var y2 = this._taskRowHeight * (restriction.dependant().index() - 1) + this._rulerHeight + this._taskTopHeight;
					} else {
						var y2 = this._taskRowHeight * (restriction.dependant().index()) + this._rulerHeight - this._taskBottomHeight;
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
					var y1 = this._taskRowHeight * (restriction.dependency().index() - 1) + this._rulerHeight + this._taskTopHeight + this._taskHeight/2;
					var y2 = this._taskRowHeight * (restriction.dependant().index() - 1) + this._rulerHeight + this._taskTopHeight + this._taskHeight/2;
					
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
					var y1 = this._taskRowHeight * (restriction.dependency().index() - 1) + this._rulerHeight + this._taskTopHeight + this._taskHeight/2;
					var y2 = this._taskRowHeight * (restriction.dependant().index() - 1) + this._rulerHeight + this._taskTopHeight + this._taskHeight/2;
					
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
					this._stage.update();
				},
				daysFromProjectStart: function(moment, project) {
					return moment.diff(project.actualStart(), 'days', true);
				}
			});
		}
);