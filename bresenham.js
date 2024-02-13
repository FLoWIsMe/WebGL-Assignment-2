// draw a line from the first to the second point
// parameters:
// 1) list of two points.Format: x1, y1, x2, y2
// 2) drawing context
function drawLine(points, context) {
    // Daelyn: Get the current image data from the canvas to manipulate pixels directly.
    var imgData = context.getImageData(0, 0, 400, 400);

    // Daelyn: Extract the start (x1, y1) and end (x2, y2) points from the input array.
    var x1 = points[0];
    var y1 = points[1];
    var x2 = points[2];
    var y2 = points[3];

    // Daelyn: Adjust Y coordinates because the canvas' (0,0) is at the top left corner, not the bottom left.
    y1 = imgData.height - y1;
    y2 = imgData.height - y2;

    // Daelyn: Calculate the differences in x and y to determine the slope and direction of the line.
    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);
    // Daelyn: Determine the step direction for x and y (positive or negative).
    var sx = (x1 < x2) ? 1 : -1;
    var sy = (y1 < y2) ? 1 : -1;
    // Daelyn: Initialize the error term to decide when to move in y-direction as well.
    var err = dx - dy;

    // Daelyn: Loop to draw pixels from the start point to the end point.
    while (true) {
        // Daelyn: Calculate the position in the imgData array to set the pixel color.
        let pos = 4 * ((imgData.height - y1) * imgData.width + x1);
        imgData.data[pos] = 255; // Red
        imgData.data[pos + 1] = 0; // Green
        imgData.data[pos + 2] = 0; // Blue
        imgData.data[pos + 3] = 255; // Opacity

        // Daelyn: Break the loop if the current pixel is the end point.
        if (x1 === x2 && y1 === y2) break;

        // Daelyn: Double the error term to check if it's time to increment x or y or both.
        var e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x1 += sx; // Daelyn: Move in x-direction.
        }
        if (e2 < dx) {
            err += dx;
            y1 += sy; // Daelyn: Move in y-direction.
        }
    }

    // Daelyn: Update the canvas with the modified image data to display the drawn line.
    context.putImageData(imgData, 0, 0);
}
