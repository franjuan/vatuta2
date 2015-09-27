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
					this._dayFont = "Arial";
					/* @member {Number} */
					this._dayWidth = this._width/60;	    
					
					lang.mixin(this, kwArgs);
					
					/* @member {Number} */
					this._ruleHeight = this._ruleHeight?this._ruleHeight:this._dayWidth;
					/* @member {Number} */
					this._dayFontSize = this._dayFontSize?this._dayFontSize:this._ruleHeight/2;
					
					var canvas = dom.byId(this._canvasId);
					canvas.width = this._width;
					canvas.height = this._height;
					
				    /* @member {Object} */
					this._stage = new createjs.Stage(this._canvasId);
					
					var task = new createjs.Shape();
					var rect = task.graphics.beginFill("DeepSkyBlue").drawRect(0, 0, 200, 50);
					task.x = 100;
					task.y = 100;
					this._stage.addChild(task);

					this._stage.update();

				},
				drawTimeRule: function() {
					var rule = new createjs.Container();
					
					for (i=0; i*this._dayWidth < this._width; i++) {
						var element = new createjs.Shape();
						element.graphics.beginFill("DeepSkyBlue").drawRoundRect(i*this._dayWidth, 0, this._dayWidth, this._ruleHeight, 5);
						var text = new createjs.Text(i, "bold " + this._dayFontSize + "px " + this._dayFont);
						text.color = "White";
						text.maxWidth = this._dayWidth;
						
						
						text.textBaseline = "middle";
						text.textAlign = "center";
						text.x = i*this._dayWidth + this._dayWidth/2;
						text.y = this._ruleHeight/2;
						
						rule.addChild(element, text);
					}
					rule.x = 0;
					rule.y = 0;
					this._stage.addChild(rule);

					this._stage.update();
				}
			});
		}
);