/**
 * @module Canvas
 */
define(
		[ 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/dom', 'easeljs' ],
		function(declare, lang, dom, easeljs) {
			return declare(null, {
				/**
				 * @constructs CanvasDrawer
				 */
				constructor : function(/* Object */kwArgs) {
					/* @member {Object} */
					this._canvasId = 'canvas';
					/* @member {Number} */
					this._width = window.innerWidth;
					/* @member {Number} */
					this._height = window.innerHeight;
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
					
					this._taskRowHeight= this._taskTopHeight + this._taskHeight + this._taskBottomHeight;
					
					var canvas = dom.byId(this._canvasId);
					canvas.width = this._width;
					canvas.height = this._height;
					
				    /* @member {Object} */
					this._stage = new createjs.Stage(this._canvasId);
				},
				drawTimeRuler: function(project) {
					var ruler = new createjs.Container();
					
					for (i=0; i*this._dayWidth < this._width; i++) {
						var element = new createjs.Shape();
						element.graphics.beginFill("DeepSkyBlue").drawRoundRect(i*this._dayWidth, 0, this._dayWidth, this._rulerHeight, 5);

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
					element.graphics.beginFill("DeepSkyBlue").drawRect(
							task.getEarlyStart()*this._dayWidth,
							this._taskTopHeight,
							task.getDuration()*this._dayWidth,
							this._taskHeight);
					
					var text = new createjs.Text(task.getName(), "bold " + this._taskFontSize + "px " + this._taskFont);
					text.color = "White";
					text.maxWidth = this._dayWidth*task.getDuration();
					text.textBaseline = "middle";
					text.textAlign = "center";
					text.x = (task.getEarlyStart() + task.getDuration()/2)*this._dayWidth;
					text.y = this._taskTopHeight + this._taskHeight/2;
					
					taskContainer.addChild(element, text);
					return taskContainer;
				}
			});
		}
);