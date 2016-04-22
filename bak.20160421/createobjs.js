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
               updateModifications();
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
               updateModifications();
           });

           function makePolyLine(coords) 
           {
               console.trace();

               var objPolyLine = new fabric.Polyline(coords, {
                   fill: null,
                   stroke: '#000022',
                   strokeWidth: 2,
                   hasControls: false,
                   hasBorders: false,
                   lockScalingX: true,
                   lockScalingY: true,
                   lockRotation: true,
                   lockMovementX: true,
                   lockMovementY: true,
                   perPixelTargetFind: true,
                   targetFindTolerance: 4,
                   selectable: true,
                   id: guid()
               });
               objPolyLine.id = guid();
               // console.log("makePolyLine: ", objPolyLine);
               return objPolyLine;
           }        

           function printStackTrace()
           {
               var e = new Error('dummy');
               var stack = e.stack.replace(/^[^\(]+?[\n$]/gm, '')
                   .replace(/^\s+at\s+/gm, '')
                   .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
                   .split('\n');
               console.log(stack);
           }