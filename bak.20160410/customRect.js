fabric.CustomRect =
fabric.util.createClass(
    fabric.Rect
   ,
    {
        type: 'customRect'
       ,
        initialize: function(object, options)
        {
            // console.log("customRect.initialize options.addChild:", options.addChild);
            // console.log(object);
            // console.trace();
            options || (options = {});
            this.callSuper('initialize', object);
            options && this.set('addChild', object.addChild);
            options && this.set('id', object.id);
        }
       ,
        toObject: function() 
        {
            // console.log("customRect.toObject addChild:", this.get('addChild'));
            return fabric.util.object.extend(
                                              this.callSuper('toObject')
                                             ,{
                                                  addChild: this.get('addChild')
                                                 ,id: this.get('id')
                                              }
                                            )
            ;
        }
    }
);

fabric.CustomRect.fromObject = function (object, callback)
{
    fabric.util.enlivenObjects(object, function (enlivenedObjects)
    {
        delete object;
        // console.log("CustomRect.fromObject: object, enlivenedObjects:", object, enlivenedObjects);
        callback && callback(new fabric.CustomRect(object, enlivenedObjects));
    });
}

fabric.CustomRect.async = true;

