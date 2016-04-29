       $("#cut").click(function()
       {
           console.log("cut");
           copyObjects();
           deleteObjects();
           canvas.renderAll();
           updateModifications();
       });

       $("#copy").click(function()
       {
           console.log("copy");
           copyObjects();
           canvas.renderAll();
       });

       function copyObjects()
       {
           gFabricObjectGroup =  canvas.getActiveGroup();
           if (gFabricObjectGroup != null)
           {
               var ctr = 0;
               var items = new Array();
               items = gFabricObjectGroup._objects;

               for (ctr = 0; ctr < items.length; ctr++)
               {
                   // canvas.add(items[ctr]);
                   var obj = items[ctr];

                   var cloneThis = fabric.util.object.clone(obj);

                   cloneThis.set("top", cloneThis.top
                                     + gFabricObjectGroup._originalTop
                                     + COPY_PASTE_SHIFT);
                   cloneThis.set("left", cloneThis.left
                                     + gFabricObjectGroup._originalLeft
                                     + COPY_PASTE_SHIFT);
                   gClipboardObjectGroup[ctr] = cloneThis;
               }
               // gFabricObjectGroup._restoreObjectsState();
               // canvas.remove(gFabricObjectGroup);
               canvas.deactivateAll();
           }
           else
           if (canvas.getActiveObject())
           {
               var currObj = fabric.util.object.clone(canvas.getActiveObject());
               currObj.set("top", currObj.top + COPY_PASTE_SHIFT);
               currObj.set("left", currObj.left + COPY_PASTE_SHIFT);
               gClipboardObject = currObj;
           }
           canvas.renderAll();
       }

       function deleteObjects()
       {
           if (canvas.getActiveGroup())
           {
               var ctr = 0;
               for (ctr = 0; ctr < canvas.getActiveGroup().objects.length; ctr++)
               {
                   canvas.getActiveGroup().objects[ctr].remove();
                   canvas.remove(canvas.getActiveGroup().objects[ctr]);
               }                    
           }
           else
           if (canvas.getActiveObject())
           {
               canvas.getActiveObject().remove();
               canvas.remove(canvas.getActiveObject());
           }
       }

       $("#paste").click(function()
       {
           // console.log("paste");
           if (gClipboardObjectGroup.length > 0)
           {
               canvas.deactivateAll();

               var ctr = 0;
               gFabricObjectGroup = new fabric.Group();
               for (ctr = 0; ctr < gClipboardObjectGroup.length; ctr++)
               {
                   var cloneThis = gClipboardObjectGroup[ctr];
                   // console.log("paste cloneThis:", cloneThis);
                   canvas.add(cloneThis);
                   cloneThis.setCoords();
                   gFabricObjectGroup.add(cloneThis);
               }
               // canvas.add(gFabricObjectGroup);
               canvas.setActiveGroup(gFabricObjectGroup);
           }
           else
           if (gClipboardObject)
           {
               gClipboardObject.setCoords();
               canvas.add(gClipboardObject);
           }
           canvas.renderAll();
           updateModifications();
       });


