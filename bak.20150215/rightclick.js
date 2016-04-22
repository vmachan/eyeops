// Right-click handler

       $('canvas').bind('contextmenu', function (env) 
       {
           // console.log("right clicked");

           var objectFound = false;
           var clickPoint = new fabric.Point(env.offsetX, env.offsetY);

           env.preventDefault();

           canvas.forEachObject(function (obj)
           {
               if (!objectFound && obj.containsPoint(clickPoint))
               {
                   objectFound = true;
                   var cnvsPos = $('canvas').offset();
                   curX = env.clientX;
                   curY = env.clientY;
                   $('#rightClickMenu').css({'top': curY, 'left': curX}).fadeIn('slow');
                   gContextObj = obj;
               }
           });
           return false; //stops the event propigation
       });

       function Point(x, y) {
           this.x = x;
           this.y = y;
       }

       function guid()
       {
         function s4()
         {
           return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
         }
         return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
       }

       function getGlobalCoordinates(thisObj, thisParent)
       {
           var gX = thisParent.getCenterPoint().x + thisObj.x;
           var gY = thisParent.getCenterPoint().y + thisObj.y;
           return (new Point(gX, gY));
       }



       /* 
         1. Get the global co-ordinates for the points of the selected polyline 
         2. Add the new vertex i.e. push it at the proper index in the points array
         3. Re-create (delete and create) the selected polyline
         4. Then need to figure out the dragging of the vertices
       */
       function addVertexToPolyLine(e)
       {
           var thisPolyLine = (e.target ? e.target : e);

           // console.log("addVertexToPolyLine: thisPolyLine is ", thisPolyLine);

           var selectedPoints = thisPolyLine.points;
           var globalPoints = [];
           selectedPoints.forEach(
                                   function(d)
                                   { 
                                       // console.log(d);
                                       globalPoints.push(getGlobalCoordinates(d, thisPolyLine));
                                   }
                                 );
           // 2. Add the new vertex i.e. push it at the proper index in the points array
           var offset = $('#canvas').offset();
           var mouseX = curX /* e.e.pageX */ - offset.left;
           var mouseY = curY /* e.e.pageY */ - offset.top;

           // **** Need to tweak this to add the new point at the right index **** 
           globalPoints.splice(globalPoints.length - 1, 0, new Point(mouseX - 50, mouseY - 50));
           // globalPoints.forEach(function(d) { console.log(d.x, d.y); });

           addPolyLineFromTo(thisPolyLine.fromNode, thisPolyLine.toNode, globalPoints);

           // Remove the old polyline
           deletefromCanvasUsingGuid(thisPolyLine, thisPolyLine.toNode.addChild.to, true);
           deletefromCanvasUsingGuid(thisPolyLine, thisPolyLine.fromNode.addChild.from, true);
       }

