       $("#cut").click(function()
       {
           console.log("cut");
           copyObjects();
           deleteObjects();
           canvas.deactivateAll();
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
           if (canvas.getActiveGroup())
           {
               var ctr = 0;

               canvas.getActiveGroup().forEachObject
               (
                   function(o)
                   {
                       var cloneThis = fabric.util.object.clone(o);

                       cloneThis.set("top", cloneThis.top
                                     + canvas.getActiveGroup()._originalTop
                                     + COPY_PASTE_SHIFT);
                       cloneThis.set("left", cloneThis.left
                                     + canvas.getActiveGroup()._originalLeft
                                     + COPY_PASTE_SHIFT);
                       gClipboardObjectGroup[ctr++] = cloneThis;
                   }
               );
           }
           else
           if (canvas.getActiveObject())
           {
               var currObj = fabric.util.object.clone(canvas.getActiveObject());
               currObj.set("top", currObj.top + COPY_PASTE_SHIFT);
               currObj.set("left", currObj.left + COPY_PASTE_SHIFT);
               gClipboardObject = currObj;
           }
       }

       function deleteObjects()
       {
           if (canvas.getActiveGroup())
           {
               canvas.getActiveGroup().forEachObject
               (
                   function(o)
                   {
                       canvas.remove(o)
                   }
               );
               canvas.discardActiveGroup().renderAll();
           }
           else
           {
               canvas.remove(canvas.getActiveObject());
           }

           // gClipboardObject = null;
           // while (gClipboardObjectGroup.pop()) {}
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


