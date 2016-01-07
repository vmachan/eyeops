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
