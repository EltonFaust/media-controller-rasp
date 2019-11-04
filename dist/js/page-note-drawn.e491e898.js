(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["page-note-drawn"],{"1b66":function(t,e,s){"use strict";var i;Object.defineProperty(e,"__esModule",{value:!0}),function(t){t["redraw"]="redraw",t["fill"]="fill",t["mouseup"]="mouseup",t["mousedown"]="mousedown",t["mouseenter"]="mouseenter",t["mouseleave"]="mouseleave"}(i=e.AllowedEvents||(e.AllowedEvents={}));var o=function(){function t(t){var e=t.elementId,s=t.width,i=t.height,o=t.backgroundColor,n=void 0===o?[255,255,255]:o,a=t.lineWidth,r=void 0===a?5:a,h=t.strokeColor,d=void 0===h?[0,0,0]:h,c=t.disabled,l=t.showWarnings,u=void 0!==l&&l,v=t.maxSnapshots,p=void 0===v?10:v;if(this.requiredParam(t,"elementId"),this.requiredParam(t,"width"),this.requiredParam(t,"height"),this.elementId=e,this.canvasNode=document.getElementById(this.elementId),this.canvasNode instanceof HTMLCanvasElement)this.canvas=this.canvasNode;else{if(!(this.canvasNode instanceof HTMLElement))throw new Error("No element found with following id: "+this.elementId);var g=document.createElement("canvas");this.canvasNode.appendChild(g),this.canvas=g}this.context=this.canvas.getContext("2d"),this.width=s,this.height=i,this.maxSnapshots=p,this.snapshots=[],this.undos=[],this.positions=[],this.leftCanvasDrawing=!1,this.isDrawing=!1,this.isDrawingModeEnabled=!0,this.imageRestored=!1,this.lineWidth=r,this.strokeColor=this.toValidColor(d),this.bucketToolColor=this.toValidColor(d),this.bucketToolTolerance=0,this.isBucketToolEnabled=!1,this.listenersList=["mouseDown","mouseMove","mouseLeave","mouseUp","touchStart","touchMove","touchEnd"],this.allowedEvents=this.getAllowedEvents(),this.redrawCounter=0,this.dispatchEventsOnceEvery=0,this.events={redrawEvent:new Event("cfd_redraw"),fillEvent:new Event("cfd_fill"),mouseUpEvent:new Event("cfd_mouseup"),mouseDownEvent:new Event("cfd_mousedown"),mouseEnterEvent:new Event("cfd_mouseenter"),mouseLeaveEvent:new Event("cfd_mouseleave"),touchStartEvent:new Event("cfd_touchstart"),touchEndEvent:new Event("cfd_touchend")},this.bindings={mouseDown:this.mouseDown.bind(this),mouseMove:this.mouseMove.bind(this),mouseLeave:this.mouseLeave.bind(this),mouseUp:this.mouseUp.bind(this),mouseUpDocument:this.mouseUpDocument.bind(this),touchStart:this.touchStart.bind(this),touchMove:this.touchMove.bind(this),touchEnd:this.touchEnd.bind(this)},this.touchIdentifier=void 0,this.previousX=void 0,this.previousY=void 0,this.showWarnings=u,this.isNodeColorEqualCache={},this.setDimensions(),this.setBackground(n),this.storeSnapshot(),c||this.enableDrawingMode()}return t.prototype.requiredParam=function(t,e){if(!t||!t[e])throw new Error(e+" is required")},t.prototype.logWarning=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];this.showWarnings&&console.warn.apply(console,t)},t.prototype.addListeners=function(){var t=this;this.listenersList.forEach(function(e){t.canvas.addEventListener(e.toLowerCase(),t.bindings[e])}),document.addEventListener("mouseup",this.bindings.mouseUpDocument)},t.prototype.removeListeners=function(){var t=this;this.listenersList.forEach(function(e){t.canvas.removeEventListener(e.toLowerCase(),t.bindings[e])}),document.removeEventListener("mouseup",this.bindings.mouseUpDocument)},t.prototype.getAllowedEvents=function(){var t=[];for(var e in i)t.push(e);return t},t.prototype.enableDrawingMode=function(){return this.isDrawingModeEnabled=!0,this.addListeners(),this.toggleCursor(),this.isDrawingModeEnabled},t.prototype.disableDrawingMode=function(){return this.isDrawingModeEnabled=!1,this.removeListeners(),this.toggleCursor(),this.isDrawingModeEnabled},t.prototype.mouseDown=function(t){if(0===t.button){var e=t.pageX-this.canvas.offsetLeft,s=t.pageY-this.canvas.offsetTop;this.drawPoint(e,s)}},t.prototype.mouseMove=function(t){var e=t.pageX-this.canvas.offsetLeft,s=t.pageY-this.canvas.offsetTop;this.drawLine(e,s,t)},t.prototype.touchStart=function(t){if(t.changedTouches.length>0){var e=t.changedTouches[0],s=e.pageX,i=e.pageY,o=e.identifier,n=s-this.canvas.offsetLeft,a=i-this.canvas.offsetTop;this.touchIdentifier=o,this.drawPoint(n,a)}},t.prototype.touchMove=function(t){if(t.changedTouches.length>0){var e=t.changedTouches[0],s=e.pageX,i=e.pageY,o=e.identifier,n=s-this.canvas.offsetLeft,a=i-this.canvas.offsetTop;if(o!=this.touchIdentifier)return;this.previousX=n,this.previousY=a,this.drawLine(n,a,t)}},t.prototype.touchEnd=function(){this.handleEndDrawing(),this.canvas.dispatchEvent(this.events.touchEndEvent)},t.prototype.mouseUp=function(){this.handleEndDrawing(),this.canvas.dispatchEvent(this.events.mouseUpEvent)},t.prototype.mouseUpDocument=function(){this.leftCanvasDrawing=!1},t.prototype.mouseLeave=function(){this.isDrawing&&(this.leftCanvasDrawing=!0),this.isDrawing=!1,this.canvas.dispatchEvent(this.events.mouseLeaveEvent)},t.prototype.mouseEnter=function(){this.canvas.dispatchEvent(this.events.mouseEnterEvent)},t.prototype.handleEndDrawing=function(){this.isDrawing=!1,this.storeSnapshot()},t.prototype.drawPoint=function(t,e){this.isBucketToolEnabled?this.fill(t,e,this.bucketToolColor,{tolerance:this.bucketToolTolerance}):(this.isDrawing=!0,this.storeDrawing(t,e,!1),this.canvas.dispatchEvent(this.events.mouseDownEvent),this.handleDrawing())},t.prototype.drawLine=function(t,e,s){this.leftCanvasDrawing&&(this.leftCanvasDrawing=!1,s instanceof MouseEvent?this.mouseDown(s):s instanceof TouchEvent&&this.touchEnd()),this.isDrawing&&(this.storeDrawing(t,e,!0),this.handleDrawing(this.dispatchEventsOnceEvery))},t.prototype.handleDrawing=function(t){var e=this;this.context.lineJoin="round";var s=[this.positions.slice().pop()];s.forEach(function(t){t&&t[0]&&t[0].strokeColor&&(e.context.strokeStyle=e.rgbaFromArray(t[0].strokeColor),e.context.lineWidth=t[0].lineWidth,e.draw(t))}),t?this.redrawCounter%t===0&&this.canvas.dispatchEvent(this.events.redrawEvent):this.canvas.dispatchEvent(this.events.redrawEvent),this.undos=[],this.redrawCounter+=1},t.prototype.draw=function(t){var e=this;t.forEach(function(s,i){var o=s.x,n=s.y,a=s.moving;e.context.beginPath(),a&&i?e.context.moveTo(t[i-1]["x"],t[i-1]["y"]):e.context.moveTo(o-1,n),e.context.lineTo(o,n),e.context.closePath(),e.context.stroke()})},t.prototype.fill=function(t,e,s,i){var o=i.tolerance;if(s=this.toValidColor(s),0===this.positions.length&&!this.imageRestored)return this.setBackground(s,!1),this.canvas.dispatchEvent(this.events.redrawEvent),void this.canvas.dispatchEvent(this.events.fillEvent);var n=this.width*this.height,a=this.context.getImageData(0,0,this.width,this.height),r=a.data,h=this.getNodeColor(t,e,r);if(!this.isNodeColorEqual(h,s,o)){var d=[];d.push([t,e]);while(d.length){if(d.length>n)break;var c=d.pop(),l=c,u=c;while(this.isNodeColorEqual(this.getNodeColor(l[0]-1,l[1],r),h,o))l=[l[0]-1,l[1]];while(this.isNodeColorEqual(this.getNodeColor(u[0]+1,u[1],r),h,o))u=[u[0]+1,u[1]];for(var v=l[0],p=u[0],g=v;g<=p;g++)this.setNodeColor(g,l[1],s,r),this.isNodeColorEqual(this.getNodeColor(g,l[1]+1,r),h,o)&&d.push([g,l[1]+1]),this.isNodeColorEqual(this.getNodeColor(g,l[1]-1,r),h,o)&&d.push([g,l[1]-1])}this.context.putImageData(a,0,0),this.canvas.dispatchEvent(this.events.redrawEvent),this.canvas.dispatchEvent(this.events.fillEvent)}},t.prototype.toValidColor=function(t){if(Array.isArray(t)&&4===t.length&&t.pop(),Array.isArray(t)&&3===t.length){var e=t.slice();return e.push(255),e}return this.logWarning("Color is not valid!\nIt must be an array with RGB values:  [0-255, 0-255, 0-255]"),[0,0,0,255]},t.prototype.isNodeColorEqual=function(t,e,s){var i=""+t[0]+t[1]+t[2]+t[3],o=""+e[0]+e[1]+e[2]+e[3],n=i+o+s;if(s=s||0,this.isNodeColorEqualCache.hasOwnProperty(i+o+s))return this.isNodeColorEqualCache[n];var a=Math.abs(e[0]-t[0]),r=Math.abs(e[1]-t[1]),h=Math.abs(e[2]-t[2]),d=a/255,c=r/255,l=h/255,u=(d+c+l)/3*100,v=s>=u;return this.isNodeColorEqualCache[n]=v,v},t.prototype.getNodeColor=function(t,e,s){var i=4*(t+e*this.width);return[s[i],s[i+1],s[i+2],s[i+3]]},t.prototype.setNodeColor=function(t,e,s,i){var o=4*(t+e*this.width);i[o]=s[0],i[o+1]=s[1],i[o+2]=s[2],i[o+3]=s[3]},t.prototype.rgbaFromArray=function(t){return"rgba("+t[0]+","+t[1]+","+t[2]+","+t[3]+")"},t.prototype.setDimensions=function(){this.canvas.height=this.height,this.canvas.width=this.width},t.prototype.toggleCursor=function(){this.canvas.style.cursor=this.isDrawingModeEnabled?"crosshair":"auto"},t.prototype.storeDrawing=function(t,e,s){if(s){var i=this.positions.length-1;this.positions[i].push({x:t,y:e,moving:s,lineWidth:this.lineWidth,strokeColor:this.strokeColor,isBucket:!1})}else this.positions.push([{x:t,y:e,isBucket:!1,moving:s,lineWidth:this.lineWidth,strokeColor:this.strokeColor}])},t.prototype.storeSnapshot=function(){var t=this.getCanvasSnapshot();this.snapshots.push(t),this.snapshots.length>this.maxSnapshots&&(this.snapshots=this.snapshots.splice(-Math.abs(this.maxSnapshots)))},t.prototype.getCanvasSnapshot=function(){return this.context.getImageData(0,0,this.width,this.height)},t.prototype.restoreCanvasSnapshot=function(t){this.context.putImageData(t,0,0)},t.prototype.on=function(t,e){var s=t.event,i=t.counter;this.requiredParam(t,"event"),this.allowedEvents.includes(s)?("redraw"===s&&i&&Number.isInteger(i)&&(this.dispatchEventsOnceEvery=i),this.canvas.addEventListener("cfd_"+s,function(){return e()})):this.logWarning("This event is not allowed: "+s)},t.prototype.setLineWidth=function(t){this.lineWidth=t},t.prototype.setBackground=function(t,e){void 0===e&&(e=!0);var s=this.toValidColor(t);s&&(e&&(this.backgroundColor=s),this.context.fillStyle=this.rgbaFromArray(s),this.context.fillRect(0,0,this.width,this.height))},t.prototype.setDrawingColor=function(t){this.configBucketTool({color:t}),this.setStrokeColor(t)},t.prototype.setStrokeColor=function(t){this.strokeColor=this.toValidColor(t)},t.prototype.configBucketTool=function(t){var e=t.color,s=void 0===e?null:e,i=t.tolerance,o=void 0===i?null:i;s&&(this.bucketToolColor=this.toValidColor(s)),o&&o>0&&(this.bucketToolTolerance=o>100?100:o)},t.prototype.toggleBucketTool=function(){return this.isBucketToolEnabled=!this.isBucketToolEnabled},t.prototype.toggleDrawingMode=function(){return this.isDrawingModeEnabled?this.disableDrawingMode():this.enableDrawingMode()},t.prototype.clear=function(){this.context.clearRect(0,0,this.width,this.height),this.positions=[],this.imageRestored=!1,this.backgroundColor&&this.setBackground(this.backgroundColor),this.handleEndDrawing()},t.prototype.save=function(){return this.canvas.toDataURL()},t.prototype.restore=function(t,e){var s=this,i=new Image;i.src=t,i.onload=function(){s.imageRestored=!0,s.context.drawImage(i,0,0),"function"===typeof e&&e()}},t.prototype.undo=function(){var t=this.snapshots[this.snapshots.length-1],e=this.snapshots[this.snapshots.length-2];e?(this.restoreCanvasSnapshot(e),this.snapshots.pop(),this.undos.push(t),this.undos=this.undos.splice(-Math.abs(this.maxSnapshots)),this.imageRestored=!0):this.logWarning("There are no more undos left.")},t.prototype.redo=function(){if(this.undos.length>0){var t=this.undos.pop();t&&(this.restoreCanvasSnapshot(t),this.snapshots.push(t),this.snapshots=this.snapshots.splice(-Math.abs(this.maxSnapshots)))}else this.logWarning("There are no more redo left.")},t}();e.default=o},"9cf3":function(t,e,s){"use strict";s.r(e);var i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"note-drawn"},[s("div",{staticClass:"drawning-area",attrs:{id:"note-drawning"}}),s("b-container",{staticClass:"drawn-options border-top border-secondary",attrs:{fluid:""}},[s("div",{staticClass:"line-options text-center"},[s("div",{staticClass:"line-colors"},[s("div",{staticClass:"colors-container"},t._l(t.colors,function(e,i){return s("div",{key:i,staticClass:"color-item",class:{"color-selected":i==t.color}},[s("div",{staticClass:"color-select",style:{"background-color":"rgb("+e.join(", ")+")"},on:{click:function(e){return t.selectColor(i)}}})])}),0)]),s("div",{staticClass:"line-size d-flex"},[s("div",{staticClass:"size-ajust",on:{click:t.decrementSize}},[t._v("-")]),s("div",{staticClass:"size-value"},[t._v(t._s(t.size)+"px")]),s("div",{staticClass:"size-ajust",on:{click:t.incrementSize}},[t._v("+")])])]),s("div",{staticClass:"actions text-right"},[s("div",{staticStyle:{flex:"1"}},[s("b-button",{attrs:{disable:t.buttonBlock,variant:"light",size:"sm"},on:{click:t.undo}},[s("i",{staticClass:"material-icons"},[t._v("undo")])]),t._v("\n                 \n                "),s("b-button",{attrs:{disable:t.buttonBlock,variant:"warning",size:"sm"},on:{click:t.discardChanges}},[t._v("\n                    Discard\n                ")]),t._v("\n                 \n                "),s("b-button",{attrs:{disable:t.buttonBlock,variant:"success",size:"sm"},on:{click:t.save}},[t._v("Save")])],1)])])],1)},o=[],n=s("1b66"),a=s.n(n),r=s("ac91"),h={name:"note-drawn",data:function(){return{drawn:null,size:3,color:"light",colors:{light:[248,249,250],primary:[0,123,255],secondary:[108,117,125],success:[40,167,69],warning:[255,193,7],danger:[220,53,69]},buttonBlock:!1}},mounted:function(){var t=this,e=document.querySelector(".note-drawn .drawning-area"),s=e.offsetWidth,i=e.offsetHeight-5;this.drawn=new a.a({elementId:"note-drawning",width:s,height:i,backgroundColor:[0,0,0],lineWidth:this.size,strokeColor:this.colors[this.color]});var o=this.$route.params.id;o&&(window.ipcRenderer.once("note-get-reply",function(e,o){var n=o.content,a=s,r=i,h=new Image;h.src=n,h.onload=function(){if(h.height>r||h.width>a){h.height>h.width?a=Math.floor(r*(h.width/h.height)):r=Math.floor(a*(h.height/h.width));var e=document.createElement("canvas"),s=e.getContext("2d");e.width=h.width,e.height=h.height,s.drawImage(h,0,0,e.width,e.height);var i={width:Math.floor(h.width),height:Math.floor(h.height)},o={width:null,height:null};while(.5*i.width>a)o.width=Math.floor(.5*i.width),o.height=Math.floor(.5*i.height),s.drawImage(e,0,0,i.width,i.height,0,0,o.width,o.height),i.width=o.width,i.height=o.height;var d=document.createElement("canvas"),c=d.getContext("2d");d.width=a,d.height=r,c.drawImage(e,0,0,i.width,i.height,0,0,a,r),n=d.toDataURL()}t.drawn.restore(n,function(){t.drawn.snapshots=[],t.drawn.undos=[],t.drawn.storeSnapshot()})}}),window.ipcRenderer.send("note-get",o))},methods:{selectColor:function(t){this.color=t,this.drawn.setStrokeColor(this.colors[this.color])},incrementSize:function(){this.size=this.size+1,this.drawn.setLineWidth(this.size)},decrementSize:function(){this.size>1&&(this.size=this.size-1,this.drawn.setLineWidth(this.size))},undo:function(){this.drawn.undo()},discardChanges:function(){window.history.length>1?this.$router.go(-1):this.$router.push("/")},save:function(){var t=this;this.buttonBlock=!0,this.$store.dispatch(r["a"].SAVE_NOTE,{id:this.$route.params.id,content:this.drawn.save()}).then(function(){t.discardChanges()})}}},d=h,c=(s("d066"),s("2877")),l=Object(c["a"])(d,i,o,!1,null,"36bd939c",null);e["default"]=l.exports},d066:function(t,e,s){"use strict";var i=s("ef85"),o=s.n(i);o.a},ef85:function(t,e,s){}}]);
//# sourceMappingURL=page-note-drawn.e491e898.js.map