           $("#createBox").click(function()
           {
               var l_addChild = new Object();
               var rect = new fabric.CustomRect(
                                      {
                                        top: 200,
                                        left: 200,
                                        width: 60,
                                        height: 70,
                                        fill: 'red',
                                        id: guid()
                                      }
                                     ,{
                                        addChild: l_addChild
                                      }
                                     );
               canvas.add(rect);
               saveState();
           });
           $("#createCircle").click(function()
           {
               var objCircle = new fabric.Circle(
                                      {
                                        radius: 40
                                       ,fill: 'green'
                                       ,left: 300
                                       ,top: 200
                                      }
                                     );
               objCircle.id = guid();
               canvas.add(objCircle);
               saveState();
           });

           function makePolyLine(coords, inFromNode, inToNode) 
           {
               console.log("in makePolyLine");

               // var objPolyLine = new fabric.Polyline(coords, {
               var objPolyLine = new fabric.CustomPolyline(coords, {
                   fill: null,
                   stroke: '#000022', // '#'+Math.floor(Math.random()*16777215).toString(16), 
                   strokeWidth: 2,
                   hasControls: true,
                   hasBorders: false,
                   lockScalingX: true,
                   lockScalingY: true,
                   lockRotation: true,
                   lockMovementX: false,
                   lockMovementY: false,
                   perPixelTargetFind: true,
                   targetFindTolerance: 4,
                   selectable: true,
                   fromNode: inFromNode,
                   toNode: inToNode,
                   id: guid()
               });
               return objPolyLine;
           }        

           // Save state
           function saveState()
           {
               console.log("saveState");
               if (gSaveHistory == true)
               {
                   var myjson = jQuery.extend(true, {}, canvas.toJSON());
                   // myjson = canvas.toJSON();

                   if (gUndoPtr < (gSavedStates.length - 1))
                   {
                       gSavedStates.splice(gUndoPtr, (gSavedStates.length - 1 - gUndoPtr));
                   }
                   gSavedStates.push(myjson);
                   gUndoPtr = gSavedStates.length - 1;
               }
           }

           $("#undoMod").click(function()
           {
               console.log("undoMod: ", gUndoPtr);
               if (gUndoPtr <= 0)
               {
                   canvas.clear();
                   canvas.renderAll();
                   gUndoPtr = 0;
               }
               else
               {
                   var loadObj = jQuery.extend(true, {}, gSavedStates[gUndoPtr - 1]);
                   canvas.loadFromJSON(
                                         loadObj
                                        ,canvas.renderAll.bind(canvas)
                                        ,function(o, obj)
                                         {
                                           console.log("loadfromJSON:o, obj", o, obj);
                                         }
                                      );
                   gUndoPtr--;
               }
           });

           $("#redoMod").click(function()
           {
               console.log("redoMod: ", gUndoPtr);
               if (gUndoPtr <= (gSavedStates.length - 1))
               {
                   var loadObj = jQuery.extend(true, {}, gSavedStates[gUndoPtr + 1]);
                   // canvas.loadFromJSON(gSavedStates[gUndoPtr + 1]);
                   canvas.loadFromJSON(
                                         loadObj
                                        ,canvas.renderAll.bind(canvas)
                                        ,function(o, obj)
                                         {
                                           console.log("loadfromJSON:o, obj", o, obj);
                                         }
                                      );
                   gUndoPtr++;
               }
               canvas.renderAll();
           });

           // Save state
           $("#showSavedState").click(function()
           {
               console.log(gSavedStates);
           });

           function getObjectList(ctr)
           {
               var tmpObjectList = new Array(),
                   tmpObjects = gObjectList;

               for (var i = 0, len = tmpObjects.length; i < len; i++)
               {
                   if (tmpObjects[ctr][i])
                   {
                       // tmpObjectList.push(tmpObjects[ctr][i]);
                       tmpObjectList.push($.extend(true, {}, tmpObjects[ctr][i]));
                   }
               }
               return tmpObjectList;
           }
