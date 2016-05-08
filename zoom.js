function zoomIn()
{
    // TODO limit the max canvas zoom in
    
    gCanvasScale = gCanvasScale * SCALE_FACTOR;
    
    canvas.setHeight(canvas.getHeight() * SCALE_FACTOR);
    canvas.setWidth(canvas.getWidth() * SCALE_FACTOR);
    
    var objects = canvas.getObjects();
    for (var i in objects) {
        var scaleX = objects[i].scaleX;
        var scaleY = objects[i].scaleY;
        var left = objects[i].left;
        var top = objects[i].top;
        
        var tempScaleX = scaleX * SCALE_FACTOR;
        var tempScaleY = scaleY * SCALE_FACTOR;
        var tempLeft = left * SCALE_FACTOR;
        var tempTop = top * SCALE_FACTOR;
        
        objects[i].scaleX = tempScaleX;
        objects[i].scaleY = tempScaleY;
        objects[i].left = tempLeft;
        objects[i].top = tempTop;
        
        objects[i].setCoords();
    }
        
    canvas.renderAll();
}

// Zoom Out
function zoomOut()
{
    // TODO limit max cavas zoom out
    
    gCanvasScale = gCanvasScale / SCALE_FACTOR;
    
    canvas.setHeight(canvas.getHeight() * (1 / SCALE_FACTOR));
    canvas.setWidth(canvas.getWidth() * (1 / SCALE_FACTOR));
    
    var objects = canvas.getObjects();
    for (var i in objects) {
        var scaleX = objects[i].scaleX;
        var scaleY = objects[i].scaleY;
        var left = objects[i].left;
        var top = objects[i].top;
    
        var tempScaleX = scaleX * (1 / SCALE_FACTOR);
        var tempScaleY = scaleY * (1 / SCALE_FACTOR);
        var tempLeft = left * (1 / SCALE_FACTOR);
        var tempTop = top * (1 / SCALE_FACTOR);

        objects[i].scaleX = tempScaleX;
        objects[i].scaleY = tempScaleY;
        objects[i].left = tempLeft;
        objects[i].top = tempTop;

        objects[i].setCoords();
    }
    
    canvas.renderAll();        
}

// Reset Zoom
function resetZoom()
{
    canvas.setHeight(canvas.getHeight() * (1 / gCanvasScale));
    canvas.setWidth(canvas.getWidth() * (1 / gCanvasScale));
    
    var objects = canvas.getObjects();
    for (var i in objects)
    {
        var scaleX = objects[i].scaleX;
        var scaleY = objects[i].scaleY;
        var left = objects[i].left;
        var top = objects[i].top;
    
        var tempScaleX = scaleX * (1 / gCanvasScale);
        var tempScaleY = scaleY * (1 / gCanvasScale);
        var tempLeft = left * (1 / gCanvasScale);
        var tempTop = top * (1 / gCanvasScale);

        objects[i].scaleX = tempScaleX;
        objects[i].scaleY = tempScaleY;
        objects[i].left = tempLeft;
        objects[i].top = tempTop;

        objects[i].setCoords();
    }
        
    canvas.renderAll();
    
    gCanvasScale = 1;
}

function mouseWheel(event, delta)
{
    // console.log($(this), zMovePosX, zMovePosY, currZoom);

    // Offset canvas to corner
    $(this).scrollTop($(this).scrollTop() + zMovePosY);
    $(this).scrollLeft($(this).scrollLeft() + zMovePosX);

    // Zoom
    var zoomFactor = delta * 0.1;
    currZoom += zoomFactor;
    mapZoom = currZoom;
    $('#zoomby').html(Math.round(currZoom) + '%');

    // Move back to the original position
    $(this).scrollTop($(this).scrollTop() - zMovePosY);
    $(this).scrollLeft($(this).scrollLeft() - zMovePosX);

    // updateMap($('.canvas'), $('.map_overlay'), 0.1, false); // Update Map
}

function updateMap(
                     basedFromElement
                   , mapElement
                   , mapSizePercentage
                   , firstRun
                   , isMousewheel
                  )
{
    var elementWidth = basedFromElement.find(">:first-child").width();
    var elementHeight = basedFromElement.find(">:first-child").height();
    var viewportWidth = basedFromElement.width();
    var viewportHeight = basedFromElement.height();

    if (firstRun)
    {
        // console.log(elementWidth, elementHeight, viewportWidth, viewportHeight);
        mapElement.width(elementWidth * mapSizePercentage);
        mapElement.height(elementHeight * mapSizePercentage);
        
        mapElement.find(">:first-child")
                  .width(viewportWidth * mapSizePercentage * canvas.getZoom());
        mapElement.find(">:first-child")
                  .height(viewportHeight * mapSizePercentage * canvas.getZoom());
    }
    else
    {
        var mapViewportWidth = mapElement.find(">:first-child").width();
        var mapViewportHeight = mapElement.find(">:first-child").height();
        var mapBaseWidth = mapElement.width();
        var mapBaseHeight = mapElement.height();

        // console.log(elementWidth, elementHeight, mapViewportWidth, mapViewportHeight, canvas.getZoom(), basedFromElement.scrollTop(), basedFromElement.scrollLeft(), basedFromElement);

        if (isMousewheel)
        {
            mapElement.find(">:first-child")
                  .width(mapBaseWidth * (1 - (canvas.getZoom() - 1)));
            mapElement.find(">:first-child")
                  .height(mapBaseHeight * (1 - (canvas.getZoom() - 1))); 
        }
        mapElement.find(">:first-child")
                  .css('top', basedFromElement.scrollTop() * mapSizePercentage);
        mapElement.find(">:first-child")
                  .css('left', basedFromElement.scrollLeft() * mapSizePercentage);
    }
}

function setDims(scaleFactor)
{
    // console.log(scaleFactor, canvas.wrapperEl.style.width);

    $('.canvas').css('transform', 'scale(' + scaleFactor +')');
    $('.canvas').css('transform-origin', '0 0');

}
