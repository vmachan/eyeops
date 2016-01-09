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
               objectList.push(rect);
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
               objectList.push(objCircle);
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

