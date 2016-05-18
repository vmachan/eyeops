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

           $("#createTriangle").click(function()
           {
               var objTriangle = new fabric.Triangle(
                                      {
                                        left: 300
                                       ,top: 200
                                       ,pointType: 'arrow_start'
                                       ,angle: -45
                                       ,width: 100
                                       ,height: 100
                                       ,fill: 'blue'
                                      }
                                     );
               objTriangle.id = guid();
               canvas.add(objTriangle);
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

           $("#createText").click(function()
           {
               var thisText = window.prompt("Enter text", "");
               var objText = new fabric.Text(
                                       thisText
                                      ,{
                                         fontSize: 20
                                        ,left: 400
                                        ,top: 200
                                        ,height: 60
                                        ,width: 120
                                       }
                                     );
               objText.id = guid();
               canvas.add(objText);
               updateModifications();
           });

