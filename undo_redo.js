       $("#showChangeLog").click(function()
       {
           console.log(gChangeLog);
       });

       $("#undoMod").click(function()
       {
           if (gChangeCtr > 0)
           {
               canvas.clear();
               // canvas.renderOnAddRemove = false;
               gChangeCtr -= (gChangeCtr > (MIN_UNDO - 1) ? 1 : 0);
               // console.log("undoMod", gChangeCtr);
               canvas.loadFromJSON(gChangeLog[gChangeCtr]
                              ,function()
                               {
                                   makeLinesUnSelectable();
                                   canvas.renderAll();
                               }
                              );
           }
       });

       $("#redoMod").click(function()
       {
           canvas.clear();
           gChangeCtr += ( ( (gChangeCtr < (MAX_UNDO - 1)) && (gChangeCtr < (gChangeLog.length - 1))) ? 1 : 0);
           // console.log("redoMod", gChangeCtr);
           canvas.loadFromJSON(gChangeLog[gChangeCtr]
                              ,function()
                               {
                                   makeLinesUnSelectable();
                                   canvas.renderAll();
                               }
                              );
       });

       function chgUnit(op, obj)
       {
           this.op = op;
           this.obj = obj;
           this.objval = $.extend(true, {}, obj);
       }

       function updateModifications()
       {
           // console.log("updateModifications before: gChangeCtr: ", gChangeCtr);
           if (gSaveHistory == true)
           {
               if (gChangeLog.length > MAX_UNDO - 1)
               {
                   gChangeLog.shift();
               }
               else
               {
                   if ((gChangeLog.length - 1) > gChangeCtr)
                   {
                       gChangeLog.splice(gChangeCtr, (gChangeLog.length - gChangeCtr));
                   }
               }
               gChangeLog.push(JSON.stringify(canvas));
               gChangeCtr += ( ( (gChangeCtr < (MAX_UNDO - 1)) && (gChangeCtr < (gChangeLog.length - 1))) ? 1 : 0);
           }
           // console.log("updateModifications after: gChangeCtr: ", gChangeCtr);
       }


       function makeLinesUnSelectable()
       {
           for (ctr = 0; ctr < canvas._objects.length; ctr++)
           {
               if (
                       canvas._objects[ctr].points !== null
                    && canvas._objects[ctr].points !== undefined
                  )
               {
                   canvas._objects[ctr].hasControls = false;
                   canvas._objects[ctr].lockScalingX = true;
                   canvas._objects[ctr].lockScalingY = true;
                   canvas._objects[ctr].lockRotation = true;
                   canvas._objects[ctr].lockMovementX = true;
                   canvas._objects[ctr].lockMovementY = true;
                   canvas._objects[ctr].perPixelTargetFind = true;
                   canvas._objects[ctr].targetFindTolerance = 4;
                   canvas._objects[ctr].selectable = true;
               }
           }
       }
