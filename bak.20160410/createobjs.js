           $("#createBox").click(function()
           {
               var rect = new fabric.CustomRect(
                                      {
                                        top: 200,
                                        left: 200,
                                        width: 60,
                                        height: 70,
                                        fill: 'red',
                                        id: guid()
                                      }
                                     ,
                                      {
                                        addChild: new Object()
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
               // updateModifications();
           });

           function makePolyLine(coords) 
           {
               // console.log("in makePolyLine");

               var objPolyLine = new fabric.Polyline(coords, {
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
                   id: guid()
               });
               objPolyLine.id = guid();
               return objPolyLine;
           }        

           // Undo and redo 
           function updateModifications()
           {
               // console.log("updateModifications");
               if (gSaveHistory == true)
               {
                   myjson = JSON.stringify(canvas);
                   gSavedStates.push(myjson);

                   var tmpObjectList = [],
                       tmpObjects = canvas.getObjects();

                   for (var i = 0, len = tmpObjects.length; i < len; i++)
                   {
                       tmpObjectList.push($.extend(true, {}, tmpObjects[i]));
                   }
                   gObjectList.push(tmpObjectList);
                   $("#undoMod").prop("disabled",false);
                   $("#redoMod").prop("disabled",false);
               }
           }

           $("#undoMod").click(function()
           {
               var undoLength = gObjectList.length;

               console.log("undoMod", gUndoPtr, undoLength, (undoLength - 1 - gUndoPtr - 1), gObjectList);

               if (undoLength > MIN_UNDO)
               {
                   if (gUndoPtr < MAX_UNDO && gUndoPtr < undoLength)
                   {
                       console.log("undoing.. ");
                       canvas.clear().renderAll();
                       
                       canvas._objects = getObjectList(undoLength - 1 - gUndoPtr - 1);
                       gUndoPtr += 1;
                       canvas.renderAll();
                   }
               }
               if (gUndoPtr >= MAX_UNDO || (undoLength - gUndoPtr) <= MIN_UNDO) 
               {
                   console.log("disable undo");
                   $(this).prop("disabled",true);
                   $("#redoMod").prop("disabled",false);
               }
               else
               {
                   $(this).prop("disabled",false);
               }
           });

           $("#redoMod").click(function()
           {
               var undoLength = gObjectList.length;

               console.log("redoMod", gUndoPtr, undoLength, (undoLength - 1 - gUndoPtr + 1), gObjectList);

               if (undoLength > MIN_UNDO)
               {
                   if (gUndoPtr <= MAX_UNDO && gUndoPtr >= MIN_UNDO && gUndoPtr < undoLength)
                   {
                       console.log("redoing.. ");
                       canvas.clear().renderAll();
                       
                       canvas._objects = getObjectList(undoLength - 1 - gUndoPtr + 1);
                       gUndoPtr -= 1;
                       canvas.renderAll();
                   }
               }
               if (gUndoPtr < MIN_UNDO || (undoLength - gUndoPtr) <= MIN_UNDO) 
               {
                   console.log("disable redo");
                   $(this).prop("disabled",true);
                   $("#undoMod").prop("disabled",false);
               }
               else
               {
                   $(this).prop("disabled",false);
               }
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

           function saveState()
           {
             // Get the current canvas json into an JSON object
             var myjson = jQuery.extend(true, {}, canvas.toJSON());

             // If the current undo pointer is less than saved states array len
             if (gUndoPtr < (gSavedStates.length - 1))
             {
               // Remove all the saved states after current undo pointer
               gSavedStates.splice(gUndoPtr, (gSavedStates.length - 1 - gUndoPtr));
             }

             // Add current state to saved states array at end
             gSavedStates.push(myjson);

             // Update the undo pointer to the last of the saved states array
             gUndoPtr = gSavedStates.length - 1;
           }

