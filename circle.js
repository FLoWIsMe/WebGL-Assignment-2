// draw a circle from three points
// parameters:
// 1) list of three points.Format: x1, y1, x2, y2, x3, y3.
// 2) drawing context
function drawCircle(points, context) {
    var imgData = context.getImageData(0, 0, 400, 400);

        // Daelyn: extract points from the array
        var [x0, y0, x1, y1, x2, y2] = points;
    
        // Daelyn: calculate the perpendicular bisector of two lines and find their intersection to get the circle's center
        let mid1 = { x: (x0 + x1) / 2, y: (y0 + y1) / 2 };
        let mid2 = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
        let dx1 = x1 - x0, dy1 = y1 - y0;
        let dx2 = x2 - x1, dy2 = y2 - y1;
    
        // Daelyn: slopes of the perpendicular bisectors
        let m1 = -dx1 / dy1;
        let m2 = -dx2 / dy2;
    
        // Daelyn: center of the circle (cx, cy)
        let cx, cy;
        if (dy1 == 0) { // First line is horizontal
            cx = mid1.x;
            cy = m2 * (cx - mid2.x) + mid2.y;
        } else if (dy2 == 0) { // Second line is horizontal
            cx = mid2.x;
            cy = m1 * (cx - mid1.x) + mid1.y;
        } else {
            cx = (m1 * mid1.x - m2 * mid2.x - mid1.y + mid2.y) / (m1 - m2);
            cy = m1 * (cx - mid1.x) + mid1.y;
        }
    
        // Daelyn: radius of the circle
        let radius = Math.sqrt(Math.pow(x0 - cx, 2) + Math.pow(y0 - cy, 2));
    
        // Daelyn: draw the circle
        context.beginPath();
        context.arc(cx, cy, radius, 0, 2 * Math.PI);
        context.stroke();
        context.putImageData(imgData, 0, 0);
    }

