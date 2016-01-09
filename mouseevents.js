           // ['object:moving', 'object:scaling', 'object:rotating'].forEach(movePolyLine);
           ['object:moving', 'object:scaling', 'object:rotating'].forEach(mouseMovePolyLine);

           canvas.on("mouse:over", function(e) {
               e.target.setShadow("5px 5px 2px rgba(94, 128, 191, 0.5)");
               canvas.renderAll();
           });

           canvas.on("mouse:out", function(e) {
               // console.log("mouse out");
               e.target.setShadow(null);
               canvas.renderAll();
           });

           $(document).on('click', '#addVertex', function(evt) 
           {
                 $('#rightClickMenu').hide();
                 if (gContextObj) 
                 {
                     // console.log("Selected object is of type - ", gContextObj.type);
                     addVertexToPolyLine(gContextObj);
                 }
                 return false;
           });

           $(document).on('click', '#showContextObject', function(evt) 
           {
                 $('#rightClickMenu').hide();
                 if (gContextObj) 
                 {
                     console.log(gContextObj);
                 }
                 return false;
           });

           canvas.on("mouse:down", function(e)
           {
               if ($('#rightClickMenu').css("display", "block"))
               {
                   $('#rightClickMenu').css("display", "none");
               }

               if ($('#rightClickMenu').css("display", "block"))
               {
                   $('#rightClickMenu').css("display", "none");
               }
               if (gIsMouseAtVertex)
               {
                   gVertexSelected = true;
               }
           });

           canvas.on('mouse:move', function (options) 
           {
               var offset = $('#canvas').offset();
               x = options.e.pageX - offset.left;
               y = options.e.pageY - offset.top;

               $('#cursor').text(x + "," + y);

               if (gVertexSelected)
               {
                   // console.log("dragging this vertex", gSelectedObject, gSelectedPointInPolyLine, gIsMouseAtVertex, gSelectedObject.getCenterPoint());
                   gSelectedObject.points[gSelectedPointInPolyLine].x =
                       x - gSelectedObject.getCenterPoint().x;
                   gSelectedObject.points[gSelectedPointInPolyLine].y =
                       y - gSelectedObject.getCenterPoint().y;
                   gSelectedObject.setCoords();
               }
               else
               {
                   gIsMouseAtVertex = checkIfMouseAtVertex(new Point(x, y));
                   canvas.remove(vertexFocus);
                   vertexFocus = null;
                   if (gIsMouseAtVertex != null) 
                   {
                       vertexFocus = new fabric.Circle(
                                              {
                                                radius: 10
                                               ,fill: 'navy' // '#'+Math.floor(Math.random()*16777215).toString(16)
                                               ,opacity: 0.5
                                               ,originX: 'center'
                                               ,originY: 'center'
                                               ,left: gIsMouseAtVertex.x
                                               ,top: gIsMouseAtVertex.y
                                               ,stroke: 'white'
                                               ,strokeWidth: 2
                                              }
                                 );
                       // setTimeout(animateVertexCircle(vertexFocus), 1);
                       canvas.add(vertexFocus);
                   }
               }
               canvas.renderAll();
           });

           canvas.on('mouse:up', function (options) 
           {
               // console.log("mouse-up event");
               // console.log(options.target);

               var object = options.target;
               if (object == null)
               {
                   return;
               }
               var objectCenter = object.getCenterPoint();
               if (object.type != 'group')
               {
                   if (object.addChild)
                   {
                       if (object.addChild.from)
                           object.addChild.from.forEach(function (polyline, index, arr)
                           {
                               deletefromCanvasUsingGuid(polyline, object.addChild.from, false);
                               deletefromCanvasUsingGuid(polyline, polyline.toNode.addChild.to, true);
                               // Removes the current polyline from the "from" array of object
                               curr = arr.splice(index, 1);

                               // Now set the start (0) and end (length-1) coords of the polyline
                               polyline.points[0].x = objectCenter.x;
                               polyline.points[0].y = objectCenter.y;
                               polyline.points[polyline.points.length - 1].x 
                                   = curr[0].toNode.getCenterPoint().x;
                               polyline.points[polyline.points.length - 1].y
                                   = curr[0].toNode.getCenterPoint().y;

                               var translatedPoints = getAbsolutePoints(polyline);
                               polyline.points = translatedPoints;

                               curr = makePolyLine(polyline.points);
                               curr.fromNode = object;
                               curr.toNode = polyline.toNode;

                               objectList.push(curr);
                               arr.push(curr);
                               polyline.toNode.addChild.to.push(curr);
                               canvas.add(curr);
                               curr.sendToBack();
                           })
                       if (object.addChild.to)
                           object.addChild.to.forEach(function (polyline, index, arr) {
                               deletefromCanvasUsingGuid(polyline, object.addChild.to, false);
                               deletefromCanvasUsingGuid(polyline, polyline.fromNode.addChild.from, true);
                               curr = arr.splice(index, 1);

                               polyline.points[polyline.points.length - 1].x = objectCenter.x;
                               polyline.points[polyline.points.length - 1].y = objectCenter.y;
                               polyline.points[0].x = curr[0].fromNode.getCenterPoint().x;
                               polyline.points[0].y = curr[0].fromNode.getCenterPoint().y;

                               var translatedPoints = getAbsolutePoints(polyline);
                               polyline.points = translatedPoints;

                               curr = makePolyLine(polyline.points);
                               curr.toNode = object;
                               curr.fromNode = polyline.fromNode;

                               objectList.push(curr);
                               arr.push(curr);
                               polyline.fromNode.addChild.from.push(curr);
                               canvas.add(curr);
                               curr.sendToBack();
                           })
                   }
               } 
               else 
               {
                   console.log("group found");
               }
               gVertexSelected = false;
               gSelectedObject = null;
               gIsMouseAtVertex = null;
           });

           function checkIfMouseAtVertex(mousePos) 
           {
               isSet = null;

               canvas.getObjects().forEach(
                   function(currObj)
                   {
                       if (currObj.type === "polyline")
                       {
                           currObj.setCoords();
                           var oPoints = currObj.points; // Get array of points for this object/polyline
                           oPoints.forEach(function(p) {
                               tx = currObj.getCenterPoint().x + p.x;
                               ty = currObj.getCenterPoint().y + p.y;
                               var pos = fabric.util.rotatePoint(
                                   new fabric.Point(tx, ty),
                                   new fabric.Point(currObj.getCenterPoint().x, currObj.getCenterPoint().y),
                                   fabric.util.degreesToRadians(currObj.angle)
                               );
                               $('#mousePos').text("x:" + mousePos.x + "y:" + mousePos.y);
                               $('#objPos').text("x:" + pos.x + "y:" + pos.y);

                               if (   (pos.x + 10 >= mousePos.x && pos.x - 10 <= mousePos.x) 
                                   && (pos.y + 10 >= mousePos.y && pos.y - 10 <= mousePos.y) 
                                  )
                               {
                                   // console.log("focused");
                                   isSet = pos;
                                   gSelectedObject = currObj;
                                   gSelectedPointInPolyLine = oPoints.indexOf(p);
                               }
                           });
                       }
                   });
               return isSet;
           }

           // Animate 
           // 1. Circles at vertex selection
           function animateVertexCircle(thisCircle)
           {
               thisCircle.animate('radius', "+=" + 1, 
                                 { 
                                     from: 2
                                    ,duration: 1000
                                    ,abort: function() { if (vertexFocus === null) return true; }
                                    ,onChange: canvas.renderAll.bind(canvas)
                                    ,onComplete: function() { animateVertexCircle(thisCircle); } 
                                 });
               canvas.renderAll();
           }

           function addPolyLine(options) 
           {
               // console.log("in addPolyLine");
               canvas.off('object:selected', addPolyLine);

               var fromObject = canvas.addChild.start; // console.log(fromObject);
               var toObject = options.target;

               addPolyLineFromTo(fromObject, toObject);

               canvas.addChild = undefined;
               canvas.renderAll();
           }

           function deletefromCanvasUsingGuid(thisObj, fromThisArray, removeFromArray)
           {
               for (ctr = 0; ctr < fromThisArray.length; ctr++)
               {
                   if (thisObj.id == fromThisArray[ctr].id)
                   {
                       if (removeFromArray)
                       {
                           fromThisArray.splice(ctr, 1);
                       }
                       canvas.remove(thisObj);
                   }
               }
           }

           // END OF POLYLINE CHANGES 

           function addPolyLineFromTo(fromObject, toObject, polyPoints)
           {
               var objPolyline;

               if (polyPoints)
               {
                   objPolyline = makePolyLine(
                                              polyPoints
                                             );
               }
               else
               {
                   objPolyline = makePolyLine(
                                              [
                                                  new Point(fromObject.getCenterPoint().x
                                                          , fromObject.getCenterPoint().y)
                                                , new Point(toObject.getCenterPoint().x
                                                          , toObject.getCenterPoint().y)
                                              ]
                                             );
               }
               objPolyline.fromNode = fromObject;
               objPolyline.toNode = toObject;

               objectList.push(objPolyline);
               canvas.add(objPolyline);

               objPolyline.sendToBack();
               
               // to remove line references when the line gets removed
               objPolyline.addChildRemove = function () {
                   fromObject.addChild.from.forEach(function (e, i, arr) {
                       if (e === objPolyline)
                           arr.splice(i, 1);
                   });
                   toObject.addChild.to.forEach(function (e, i, arr) {
                       if (e === objPolyline)
                           arr.splice(i, 1);
                   });
               }

               fromObject.addChild = {
                   // this retains the existing arrays (if there were any)
                   from: (fromObject.addChild && fromObject.addChild.from) || [],
                   to: (fromObject.addChild && fromObject.addChild.to)
               }
               fromObject.addChild.from.push(objPolyline);

               toObject.addChild = {
                   from: (toObject.addChild && toObject.addChild.from),
                   to: (toObject.addChild && toObject.addChild.to) || []
               }
               toObject.addChild.to.push(objPolyline);
           }


           function mouseMovePolyLine(event) 
           {
               canvas.on(event, function (options) {
                   var object = options.target;
                   var objectCenter = object.getCenterPoint();

                   if (object.type != 'group')
                   {
                       if (object.addChild)
                       {
                           if (object.addChild.from)
                               object.addChild.from.forEach(function (polyline, index, arr)
                               {
                                   polyline.points[0].x = 
                                       objectCenter.x - polyline.getCenterPoint().x;
                                   polyline.points[0].y =
                                       objectCenter.y - polyline.getCenterPoint().y;
                               })
                           if (object.addChild.to)
                               object.addChild.to.forEach(function (polyline, index, arr) 
                               {
                                   polyline.points[polyline.points.length - 1].x =
                                       objectCenter.x - polyline.getCenterPoint().x;
                                   polyline.points[polyline.points.length - 1].y =
                                       objectCenter.y - polyline.getCenterPoint().y;
                               })
                       }
                   } 
                   else 
                   {
                       console.log("group found");
                   }
                   canvas.renderAll();
               });
           }

           function getAbsolutePoints(inputObject)
           {
               if (inputObject.type == "polyline")
               {
                   var absolutePoints = inputObject.points;

                   for (tI = 1; tI < absolutePoints.length - 1; tI++)
                   {
                       /* console.log(
                                    inputObject.getCenterPoint().x
                                   ,inputObject.getCenterPoint().y
                                   ,absolutePoints[tI].x
                                   ,absolutePoints[tI].y
                                   ); */
                       tx = absolutePoints[tI].x + inputObject.getCenterPoint().x;
                       ty = absolutePoints[tI].y + inputObject.getCenterPoint().y;
                       var pos = fabric.util.rotatePoint(
                           new fabric.Point(tx, ty),
                           new fabric.Point(
                                      inputObject.getCenterPoint().x
                                    , inputObject.getCenterPoint().y)
                                    , fabric.util.degreesToRadians(inputObject.angle)
                                           );
                       absolutePoints[tI].x = pos.x;
                       absolutePoints[tI].y = pos.y;
                   }
                   return absolutePoints;
               }
           }