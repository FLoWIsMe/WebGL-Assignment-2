// Daelyn Doughty
// Assignment: 2
// Due 2/14/24 (original due date was 2/11/24 but I got an extension, see readme for more details)
// draw a circle from three points
// parameters:
// 1) list of three points.Format: x1, y1, x2, y2, x3, y3.
// 2) drawing context
function draw(points, context) {
    // Daelyn: Initialize variables to store the coordinates of the three points
    var x1 = points[0], y1 = points[1],
        x2 = points[2], y2 = points[3],
        x3 = points[4], y3 = points[5];

    // Daelyn: Call calculateCircleCenter function to find the circle's center that goes through the three points
    var center = calculateCircleCenter(x1, y1, x2, y2, x3, y3);
    if (!center) return; // Daelyn: If the points don't form a valid circle, exit the function
    var cx = center.x, cy = center.y;

    // Daelyn: Calculate the radius of the circle using the distance formula between center and one of the points
    var radius = Math.sqrt((x1 - cx) * (x1 - cx) + (y1 - cy) * (y1 - cy));

    // Daelyn: Initialize variables for the Midpoint circle drawing algorithm
    var i = 0;
    var j = Math.round(radius);
    var R2 = radius * radius;

    while (i <= j) {
        // Daelyn: Draw 8 symmetrical points around the circle for each iteration to create the circle
        setPixel(cx + i, cy + j, context); // Daelyn: Draw a pixel in the first quadrant, moving right and up from the center
        setPixel(cx - i, cy + j, context); // Daelyn: Draw a pixel in the second quadrant, moving left and up from the center
        setPixel(cx + i, cy - j, context); // Daelyn: Draw a pixel in the fourth quadrant, moving right and down from the center
        setPixel(cx - i, cy - j, context); // Daelyn: Draw a pixel in the third quadrant, moving left and down from the center
        setPixel(cx + j, cy + i, context); // Daelyn: Draw a pixel in the first quadrant, moving up and right, mirroring the first operation on the y-axis
        setPixel(cx - j, cy + i, context); // Daelyn: Draw a pixel in the second quadrant, moving up and left, mirroring the second operation on the y-axis
        setPixel(cx + j, cy - i, context); // Daelyn: Draw a pixel in the fourth quadrant, moving down and right, mirroring the third operation on the y-axis
        setPixel(cx - j, cy - i, context); // Daelyn: Draw a pixel in the third quadrant, moving down and left, mirroring the fourth operation on the y-axis


        i = i + 1;
        // Daelyn: Update decision parameter to determine when to move to inner pixel row
        var decision = R2 - i * i - (j - 0.5) * (j - 0.5);
        if (decision < 0) {
            j = j - 1;
        }
    }
}

function setPixel(x, y, context) {
    // Daelyn: Create a single pixel image data with black color and full opacity
    var imgData = context.createImageData(1, 1); // Create a single pixel image
    imgData.data[0] = 0; // red
    imgData.data[1] = 0; // green
    imgData.data[2] = 0; // blue
    imgData.data[3] = 255; // alpha
    context.putImageData(imgData, x, y); // Daelyn: Place the pixel at specified coordinates
}

function calculateCircleCenter(x1, y1, x2, y2, x3, y3) {
    // Daelyn: Calculate the center of the circle that passes through three given points
    // Daelyn: Calculate midpoints of the line segments joining the points
    var mid1 = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
    var mid2 = { x: (x2 + x3) / 2, y: (y2 + y3) / 2 };

    // Daelyn: Calculate slopes of the lines through the points and their perpendicular bisectors
    var slope1 = (y2 - y1) / (x2 - x1);
    var slope2 = (y3 - y2) / (x3 - x2);

    var perpSlope1 = -1 / slope1;
    var perpSlope2 = -1 / slope2;

    // Daelyn: Solve for the center (x, y) using the intersection of the perpendicular bisectors
    var center = {};
    center.x = (perpSlope1 * mid1.x - perpSlope2 * mid2.x + mid2.y - mid1.y) / (perpSlope1 - perpSlope2);
    center.y = perpSlope1 * (center.x - mid1.x) + mid1.y;

    return center; // Daelyn: Return the calculated center point
}
