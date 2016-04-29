           // ['object:moving', 'object:scaling', 'object:rotating'].forEach(objectMove);

           canvas.on("object:selected", function(e)
           {
               // console.log("select this", e);
               gSelectedObject = e.target;
               if (canvas.addChild) 
               {
                   // console.log("draw a line");
               }
               else
               {
                   // console.log("draw nothing");
                   var oCenter = e.target.getCenterPoint();
                   gObjIsOnLine = checkIfOnLine(oCenter);
                   if (gObjIsOnLine) 
                   {
                       // console.log("gObjIsOnLine:", gObjIsOnLine);
                   }
               }
               canvas.renderAll();
           });

           canvas.on('object:moving', function (options)
           { 
               var object = options.target;
               var objectCenter = object.getCenterPoint();

               $('#objPos').text(Math.round(objectCenter.x) + "," + Math.round(objectCenter.y));

           });

           canvas.on("object:modified", function(options)
           {
               var object = options.target;
               var objectCenter = object.getCenterPoint();

               // console.log("object modified: ", objectCenter);
               if (gObjIsOnLine != null)
               {
                   moveLines(objectCenter);
                   gObjIsOnLine = null;
                   gObjIsOnTheseLines.splice(0, gObjIsOnTheseLines.length);
                   gObjIsOnTheseLinesPoint.splice(0, gObjIsOnTheseLinesPoint.length);
               }
               canvas.remove(vertexFocus);
               vertexFocus = null;
               updateModifications();
               canvas.deactivateAllWithDispatch();
               canvas.renderAll();
           });

           canvas.on("selection:cleared", function(options)
           {
               // console.log("selection:cleared");

               gObjIsOnLine = null;
               gObjIsOnTheseLines.splice(0, gObjIsOnTheseLines.length);
               gObjIsOnTheseLinesPoint.splice(0, gObjIsOnTheseLinesPoint.length);
               gSelectedObject = null;
           });

           canvas.on("mouse:over", function(e)
           {
               e.target.setShadow("5px 5px 2px rgba(94, 128, 191, 0.5)");
               canvas.renderAll();
           });

           canvas.on("mouse:out", function(e)
           {
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
               // console.log("e.target in moving is ", e.target);

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
               if (e.target != null)
               {
                   // console.log("setting gSelectedObject to ", e.target);
                   gSelectedObject = e.target;
               }
               if (gPanning == true)
               {
                   // console.log("gPanning set to true");
                   canvas.selection = true;
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
                   // gSelectedObject.points[gSelectedPointInPolyLine].x =
                   //     x - gSelectedObject.getCenterPoint().x;
                   // gSelectedObject.points[gSelectedPointInPolyLine].y =
                   //     y - gSelectedObject.getCenterPoint().y;
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
                                               ,fill: 'navy'
                                               ,opacity: 0.5
                                               ,originX: 'center'
                                               ,originY: 'center'
                                               ,left: gIsMouseAtVertex.x
                                               ,top: gIsMouseAtVertex.y
                                               ,stroke: 'white'
                                               ,strokeWidth: 2
                                               ,hasControls: false
                                               ,hasBorders: false
                                               ,lockScalingX: false
                                               ,lockScalingY: false
                                               ,lockRotation: false
                                              }
                                 );
                       // setTimeout(animateVertexCircle(vertexFocus), 1);
                       canvas.add(vertexFocus);
                   }
                   else
                   {
                       if (gPanning == true && canvas.isDrawingMode == false)
                       {
                           var units = 10;
                           var delta = new fabric.Point(
                                                  options.e.movementX
                                                 ,options.e.movementY
                                                       );
                           canvas.relativePan(delta);
                       }
                   }
               }
               canvas.renderAll();
           });

           canvas.on('mouse:up', function (options) 
           {
               // console.log("mouse-up event");

               gVertexSelected = false;
               gSelectedObject = null;
               gIsMouseAtVertex = null;
               canvas.remove(vertexFocus);
               vertexFocus = null;
               // gPanning = false;
               // canvas.selection = false;
           });

           function addPolyLine(options) 
           {
               // console.log("in addPolyLine");
               canvas.off('object:selected', addPolyLine);

               var fromObject = canvas.addChild.start; // console.log(fromObject);
               var toObject = options.target;

               addPolyLineFromTo(fromObject, toObject);

               canvas.addChild = undefined;
               canvas.deactivateAllWithDispatch();
               canvas.renderAll();
               updateModifications();
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
               canvas.add(objPolyline);
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
               // console.log("getAbsolutePoints: inputObject:", inputObject);

               if (     inputObject.type == "polyline"
                     || inputObject.points != undefined
                     || inputObject.points != null
                  )
               {
                   var relativePoints = inputObject.points;
                   var xPoints = new Array();

                   for (tI = 0; tI < relativePoints.length; tI++)
                   {
                       /* console.log(
                                    inputObject.getCenterPoint().x
                                   ,inputObject.getCenterPoint().y
                                   ,relativePoints[tI].x
                                   ,relativePoints[tI].y
                                   ); */
                       tx = relativePoints[tI].x + inputObject.getCenterPoint().x;
                       ty = relativePoints[tI].y + inputObject.getCenterPoint().y;
                       xPoints.push(
                                     fabric.util.rotatePoint
                                     (
                                        new fabric.Point(tx, ty),
                                        new fabric.Point(
                                            inputObject.getCenterPoint().x
                                          , inputObject.getCenterPoint().y)
                                          , fabric.util.degreesToRadians(inputObject.angle)
                                     )
                                   );
                       // relativePoints[tI].x = pos.x;
                       // relativePoints[tI].y = pos.y;
                   }
                   return xPoints;
               }
           }

           function checkIfOnLine(inCenterPoint)
           {
               for (ctr = 0; ctr < canvas._objects.length; ctr++)
               {
                   if (
                           canvas._objects[ctr].points !== null
                        && canvas._objects[ctr].points !== undefined
                      )
                   {
                       var absPoints = getAbsolutePoints(canvas._objects[ctr]);
                       // console.log("inCenterPoint:", inCenterPoint, ":absPoints:", absPoints);
                       for (pCtr = 0; pCtr < absPoints.length; pCtr++)
                       {
                           if (
                                   (   inCenterPoint.x <= absPoints[pCtr].x + OBJ_SNAP_PROXIMITY
                                    && inCenterPoint.x >= absPoints[pCtr].x - OBJ_SNAP_PROXIMITY) 
                                && (   inCenterPoint.y <= absPoints[pCtr].y + OBJ_SNAP_PROXIMITY
                                    && inCenterPoint.y >= absPoints[pCtr].y - OBJ_SNAP_PROXIMITY) 
                              )
                           {
                               // return(canvas._objects[ctr]);
                               gObjIsOnTheseLines.push(canvas._objects[ctr]);
                               gObjIsOnTheseLinesPoint.push(pCtr);
                           }
                       }
                   }
               }
               return gObjIsOnTheseLines;
           }

           function moveLines(withThisPoint)
           {
               for (ctr = 0; ctr < gObjIsOnTheseLines.length; ctr++)
               {
                   // console.log("withThisPoint:", withThisPoint);

                   gObjIsOnTheseLines[ctr].points[gObjIsOnTheseLinesPoint[ctr]].x = withThisPoint.x - gObjIsOnTheseLines[ctr].getCenterPoint().x;
                   gObjIsOnTheseLines[ctr].points[gObjIsOnTheseLinesPoint[ctr]].y = withThisPoint.y - gObjIsOnTheseLines[ctr].getCenterPoint().y;

                   setPolylineTopLeft(gObjIsOnTheseLines[ctr]);
               }
               canvas.renderAll();
               return null;
           }

           function setPolylineTopLeft(inObject)
           {
              var minX = 99999, minY = 99999;
           
              var currPts = getAbsolutePoints(inObject);
              for (var ctr = 0; ctr < currPts.length; ctr++)
              {
                  // console.log("x:", currPts[ctr].x, " y:", currPts[ctr].y);
                  if (minX > currPts[ctr].x) minX = currPts[ctr].x;
                  if (minY > currPts[ctr].y) minY = currPts[ctr].y;
              }
              inObject._calcDimensions();
              inObject.left = minX;
              inObject.top = minY;
           
              for (var ctr = 0; ctr < currPts.length; ctr++)
              {
                  /*
                  console.log(
                              "RELATIVE x:", currPts[ctr].x
                            , " y:", currPts[ctr].y
                            , " centerX:", inObject.getCenterPoint().x
                            , " centerY:", inObject.getCenterPoint().y
                            , " currX:", inObject.getCenterPoint().x + currPts[ctr].x
                            , " currY:", inObject.getCenterPoint().y + currPts[ctr].y
                             );
                  */
                  inObject.points[ctr].x = currPts[ctr].x - inObject.getCenterPoint().x;
                  inObject.points[ctr].y = currPts[ctr].y - inObject.getCenterPoint().y;
              }
              inObject.setCoords();
           }

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
                           oPoints.forEach(function(p, i) {
                               if (i == 0 || i == oPoints.length - 1)
                               {
                                   return;
                               }
                               tx = currObj.getCenterPoint().x + p.x;
                               ty = currObj.getCenterPoint().y + p.y;
                               var pos = fabric.util.rotatePoint(
                                   new fabric.Point(tx, ty),
                                   new fabric.Point(currObj.getCenterPoint().x, currObj.getCenterPoint().y),
                                   fabric.util.degreesToRadians(currObj.angle)
                               );
                               $('#mousePos').text("x:" + mousePos.x + "y:" + mousePos.y);
                               $('#objPos').text("x:" + pos.x + "y:" + pos.y);

                               if (   (pos.x + VRTX_SNAP_PROXIMITY >= mousePos.x && pos.x - VRTX_SNAP_PROXIMITY <= mousePos.x) 
                                   && (pos.y + VRTX_SNAP_PROXIMITY >= mousePos.y && pos.y - VRTX_SNAP_PROXIMITY <= mousePos.y) 
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

