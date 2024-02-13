// draw a line from the first to the second point
// parameters:
// 1) list of two points.Format: x1, y1, x2, y2
// 2) drawing context
function drawLine(points, context){

    var imgData = context.getImageData(0, 0, 400, 400);

    var x1 = points[0];
    var y1 = points[1];
    var x2 = points[2];
    var y2 = points[3];

    y1 = imgData.height - y1
    var y_fordrawing = imgData.height - y1;
    var x_fordrawing = x1;
    imgData.data[4*(y_fordrawing*imgData.width+ x_fordrawing)] = 255; //red
    imgData.data[4*(y_fordrawing*imgData.width+ x_fordrawing) + 1] = 0; //green
    imgData.data[4*(y_fordrawing*imgData.width+ x_fordrawing) + 2] = 0; //blue
    imgData.data[4*(y_fordrawing*imgData.width+ x_fordrawing) + 3] = 255; //opacity

    y2 = imgData.height - y2;
    y_fordrawing = imgData.height - y2;
    x_fordrawing = x2;
    imgData.data[4*(y_fordrawing*imgData.width+ x_fordrawing)] = 255; //red
    imgData.data[4*(y_fordrawing*imgData.width+ x_fordrawing) + 1] = 0; //green
    imgData.data[4*(y_fordrawing*imgData.width+ x_fordrawing) + 2] = 0; //blue
    imgData.data[4*(y_fordrawing*imgData.width+ x_fordrawing) + 3] = 255; //opacity
    if(x2>x1 && y2>y1 && (Math.abs((y2-y1)) <= Math.abs((x2-x1)))){
        y2 = imgData.height - points[3];
        y1 = imgData.height - points[1];

        var x = points[0];
        var y = points[1];
        y = imgData.height - y;


        var dy = Math.abs(y2-y1);
        var dx = Math.abs(x2-x1);

        var F = 2 * dy * x + 2 * (x2 * y1 - x1 * y2) - 2 * dx * y - dx;

        while(x <= x2){
            y_fordrawing = imgData.height - y;
            x_fordrawing = x;
            imgData.data[4*(y_fordrawing*imgData.width+ x_fordrawing)] = 255; //red
            imgData.data[4*(y_fordrawing*imgData.width+ x_fordrawing) + 1] = 0; //green
            imgData.data[4*(y_fordrawing*imgData.width+ x_fordrawing) + 2] = 0; //blue
            imgData.data[4*(y_fordrawing*imgData.width+ x_fordrawing) + 3] = 255; //opacity

            x = x + 1;
            console.log(F)
            if(F <= 0){
                F = F + (2 * dy);
            } else {
                F = F + (2 * dy) - (2 * dx);
                y = y + 1;
            }

        }
    }
        // else if(x2<x1 && y2<y1 && (Math.abs((y1-y2))<= 0*(Math.abs(x1-x2)))){
        //     y2 = imgData.height - points[3];
        //     y1 = imgData.height - points[1];
    
        //     var x = points[0];
        //     var y = points[1];
        //     y = imgData.height - y;
    
    
        //     var dy = Math.abs(y2-y1);
        //     var dx = Math.abs(x2-x1);
    
        //     var F = 2 * dy * x + 2 * (x2 * y1 - x1 * y2) - 2 * dx * y - dx;
    
        //     while(x <= x2){
        //         y_fordrawing = imgData.height - y;
        //         x_fordrawing = x;
        //         imgData.data[4*(y_fordrawing*imgData.width+ x_fordrawing)] = 0; //red
        //         imgData.data[4*(y_fordrawing*imgData.width+ x_fordrawing) + 1] = 0; //green
        //         imgData.data[4*(y_fordrawing*imgData.width+ x_fordrawing) + 2] = 0; //blue
        //         imgData.data[4*(y_fordrawing*imgData.width+ x_fordrawing) + 3] = 255; //opacity
    
        //         x = x + 1;
        //         console.log(F)
        //         if(F <= 0){
        //             F = F + (2 * dy);
        //         } else {
        //             F = F + (2 * dy) - (2 * dx);
        //             y = y + 1;
        //         }
    
        //     }
    context.putImageData(imgData,0,0);
}