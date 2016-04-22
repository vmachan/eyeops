fabric.CustomPolyline =
fabric.util.createClass(
    fabric.Polyline
   ,
    {
        type: 'customPolyline'
       ,
        initialize: function(element, options)
        {
            console.log("customPolyline.initialize:", element, options);
            console.trace();
            this.callSuper('initialize', element, options);
            options && this.set('addChild', options.addChild);
            options && this.set('addChildRemove', options.addChildRemove);
            options && this.set('toNode', options.toNode);
            options && this.set('fromNode', options.fromNode);
            options && this.set('id', options.id);
        }
       ,
        toObject: function() 
        {
            console.log("customPolyline.toObject:", this);
            console.trace();
            return fabric.util.object.extend(
                                              this.callSuper('toObject')
                                             ,{
                                                  addChild: this.get('addChild')
                                                 ,addChildRemove: this.get('addChildRemove')
                                                 ,toNode: this.get('toNode')
                                                 ,fromNode: this.get('fromNode')
                                                 ,id: this.get('id')
                                              }
                                            )
            ;
        }
    }
);

fabric.CustomPolyline.fromObject = function (object, callback)
{
    fabric.util.enlivenObjects(object.objects, function (enlivenedObjects)
    {
        delete object.objects;
        callback && callback(new fabric.CustomPolyline(enlivenedObjects, object));
    });
}

fabric.CustomPolyline.async = true;

