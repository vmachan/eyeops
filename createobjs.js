           ['object:modified', 'object:added'].forEach(updateModifications);

           $("#createBox").click(function()
           {
               var rect = new fabric.Rect(
                                      {
                                        top: 200,
                                        left: 200,
                                        width: 60,
                                        height: 70,
                                        fill: 'red'
                                      }
                                     );
               rect.id = guid();
               canvas.add(rect);
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
               if (gSaveHistory === true)
               {
                   console.log("Saving state");
                   myjson = JSON.stringify(canvas);
                   gSavedStates.push(myjson);
               }
           }

           $("#undoMod").click(function()
           {
               if (gNumMods < gSavedStates.length)
               {
                   canvas.clear().renderAll();
                   canvas.loadFromJSON(gSavedStates[gSavedStates.length - 1 - gNumMods - 1]);
                   canvas.renderAll();
                   //console.log("geladen " + (gSavedStates.length - 1 - gNumMods - 1));
                   //console.log("gSavedStates " + gSavedStates.length);
                   gNumMods += 1;
                   //console.log("gNumMods " + gNumMods);
               }
           });

           $("#redoMod").click(function()
           {
               if (gNumMods > 0)
               {
                   canvas.clear().renderAll();
                   canvas.loadFromJSON(gSavedStates[gSavedStates.length - 1 - gNumMods + 1]);
                   canvas.renderAll();
                   //console.log("geladen " + (gSavedStates.length - 1 - gNumMods + 1));
                   gNumMods -= 1;
                   //console.log("gSavedStates " + gSavedStates.length);
                   //console.log("gNumMods " + gNumMods);
               }
           });
