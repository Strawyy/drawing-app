    // VARIABLES and CONTS 
    solids_link = document.getElementById('solids_link')
    white_bg = document.getElementById('white_bg')
    red_bg = document.getElementById('red_bg')
    resize_error = document.getElementById('resize_error')
    drawing_error = document.getElementById('drawing_error')
    downsize_btn = document.getElementById('downsize-btn')
    text_value = document.getElementById('text_value')
    b1 = document.getElementById('b1')
    b2 = document.getElementById('b2')

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let canvasSize = 2
    let centerX
    let centerY

    let isDrawPoints = true
    let points = []             //array where are stored the points coordinates
    let pointsTrio = []        //same as points array but with subarray with 3 values (x,y,z)
    let pointDrawn = 1         //point drawn on the quadrant (1-3)
    let xPoint, yPoint, zPoint  //coordinates of the point just drawn
    let isAltPressed = false    //bool to know if alt is pressed
    let isCtrlPressed = false   //bool to know if control is pressed
    let isDrawEdges = false     //bool to know if it is drawing the edges

    let edges = []              //sequence of point to connect
    let edgesCoordinates = []
    let edgeSegment = []
    let edgePoints = []

    let edgesPointsDrawn = 1
    
    let mValue = ""
    

    let errorDuration = 1500

    //display the canvas
    window.addEventListener('resize', () => { resize_canvas(canvasSize) })
    canvasDisplay(canvasSize)

    //functions
    drawGrid()
    drawAxes()
    keyPressedActions()

    // Event listener for mouse clicks
    canvas.addEventListener('click', (event) => {
        if (canvasSize == 2) {
            error("drawing")
        }


        if (isDrawPoints && canvasSize == 1) {
            let x = event.clientX //- 224;
            let y = event.clientY //- 94;
            // First quadrant
            if (x <= centerX && y >= centerY && pointDrawn == 1) {
                first_quadrant(x,y, "points")
            }

            //second quadrant
            if (x <= centerX && y <= centerY && pointDrawn == 2 &&
                points[points.length - 2] + 10 >= Math.abs(x - centerX) && points[points.length - 2] - 10 <= Math.abs(x - centerX)) {
                second_qudrant(x,y, "points") 
            }

            //third quadrant point
            if (x >= centerX && y <= centerY && pointDrawn == 3 && 
                points[points.length - 1] + 10 >= Math.abs(y - centerY) && Math.abs(y - centerY) >= points[points.length - 1] - 10 &&
                points[points.length - 2] + 10 >= Math.abs(x - centerX) && Math.abs(x - centerX) >= points[points.length - 2] - 10) {
                third_quadrant(x,y, "points")
            }
        } else if (isDrawEdges && canvasSize == 1) {
            let x = event.clientX //- 224;
            let y = event.clientY //- 94;
            // First quadrant
            if (x <= centerX && y >= centerY && (edgesPointsDrawn == 1 || edgesPointsDrawn == 2)) {
                first_quadrant(x,y, "edges")
                
            }

            //second quadrant
            if (x <= centerX && y <= centerY && (edgesPointsDrawn == 3 || edgesPointsDrawn == 4) 
                // && edgePoints[edgePoints.length - 1][0] + 10 >= Math.abs(x - centerX) && Math.abs(x - centerX) >= edgePoints[edgePoints.length - 1][0] -10 &&
                // edgePoints[edgePoints.length - 1][1] + 10 >= Math.abs(y - centerY) && Math.abs(y - centerY) >= edgePoints[edgePoints.length - 1][1] -10
                ) { 
                console.log(edgesPointsDrawn)
                second_qudrant(x,y, "edges") 

            }

            //third quadrant point
            if (x >= centerX && y <= centerY && pointDrawn == 3) {
                third_quadrant(x,y, "edges")
                edgesPointsDrawn++
            }
        }
    });

    function canvasDisplay( n ) {
        if (n == 2) {
            canvas.width = window.innerWidth / 1.4;
            canvas.height = window.innerHeight / 1.3;
            centerX = (canvas.width / 2);
            centerY = (canvas.height / 2);
            white_bg.style.height = "0vh"
            white_bg.style.width = "0vw"
        } else {
            
            canvas.width = window.innerWidth / n;
            canvas.height = window.innerHeight / (n);
            centerX = (canvas.width / 2);
            centerY = (canvas.height / 2);
            white_bg.style.height = "100vh"
            white_bg.style.width = "100vw"
        }
        
        
    }
    function resize_canvas(size) {
        canvasSize = size
        
        if (size == 1) {
            downsize_btn.style.display = "flex"
            canvas.style.top = 0
            canvas.style.left = 0
            white_bg.style.height = "100vh"
            white_bg.style.width = "100vw"
            //document.body.style.overflowY = "hidden"
            
        } else if (size == 2) {
            downsize_btn.style.display = "none"
            canvas.style.top = "auto"
            canvas.style.left = "auto"
            white_bg.style.height = "0vh"
            white_bg.style.width = "0vw"
            //document.body.style.overflowY = "visible"

        }
        canvasDisplay(size)
        drawGrid()
        drawAxes()
        redraw_points(pointsTrio)
        
        
    }
    function clear_error() {
        isDrawPoints = true
        red_bg.style.width = 0
        red_bg.style.height = 0
        red_bg.style.top = "auto"
        red_bg.style.left = "auto"
        resize_error.style.display = "none"
        drawing_error.style.display = "none"
    }
    function error(text) {
        isDrawPoints = false
        //red_bg.style.width = canvas.width + "px"
        //red_bg.style.height = canvas.height + "px"
        if (canvasSize == 1) {
            red_bg.style.top = 0
            red_bg.style.left = 0
        } else {
            red_bg.style.top = "auto"
            red_bg.style.left = "auto"
        }

        if (text == "drawing") {
            drawing_error.style.display = "flex"
            //alert("OPEN FULL SCREEN")

        } else if (text == "resize") {
            resize_error.style.display = "flex"
        }
        setTimeout(clear_error, errorDuration)

    }
    function drawGrid() {
        // Draw the grid with gray lines starting from the center
        const gridSize = 50;
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;

        // Vertical grid lines
        for (let x = centerX; x <= canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let x = centerX; x >= 0; x -= gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        // Horizontal grid lines console.log
        for (let y = centerY; y <= canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        for (let y = centerY; y >= 0; y -= gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }
    function drawAxes() {
        // Draw the axes
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5;

        // X-axis
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(canvas.width, centerY);
        ctx.stroke();

        // Y-axis
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, canvas.height);
        ctx.stroke();
    }
    function keyPressedActions() {

        // Event listener for the 'keydown' event
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Alt') {
                isAltPressed = true
            } else if (e.key === 'Control') {
                isCtrlPressed = true
            }
        });
    
        // Event listener for the 'keyup' event
        document.addEventListener('keyup', (e) => {
            if (e.key === 'Alt') {
                isAltPressed = false
            } else if (e.key === 'Control') {
                isCtrlPressed = false
            }
        });
        
        // Event listener for the print event
        document.addEventListener('keypress', (e) => {
            if (e.key.toUpperCase() === 'P') {
                print(create_points, "vertices")

                // Create a new array with pairs of every point with every other point
                create_edges()
                if (edges.length != 0) print(edges, "edges")
            }
        });

        // Event listener for the 'keypress' event
        document.addEventListener('keypress', (e) => {
            if (e.key.toUpperCase() === 'E') {
                isDrawEdges = !isDrawEdges
                console.log(isDrawEdges)
            } else if (e.key.toUpperCase() === '1') {
                canvasSize = 1
                resize_canvas(1)
            } else if (e.key.toUpperCase() === 'Q') {
                downsize()
            } else if (e.key.toUpperCase() === 'R') {
                clear_canvas()
                edgePoints = []
                edgeSegment = []
                edgesCoordinates = []
                edgesPointsDrawn = 1
            }
        })
    }
    function print(array, name_array) {
        let string = ""
        for (let i = 0; i < array.length; i++) {
            string = string + array[i] + ", "
        }
        string = string.slice(0, -1).slice(0, -1) + ""
        console.log(name_array, ":", string);
    }
    function first_quadrant(x,y, type) {
            xPoint = Math.abs(x - centerX)
            yPoint = Math.abs(y - centerY)

            //align x or y coordinates points

            if (isAltPressed) {
                yPoint = pointsTrio[pointsTrio.length-1][1]
                y = (centerY + yPoint)
            }
            if (isCtrlPressed) {
                xPoint = pointsTrio[pointsTrio.length-1][0]
                x = (centerX - xPoint)
            }
            if (type == "points") {
                points.push(Math.abs(x - centerX), Math.abs(y - centerY))
                //draw the projections to the axes
                //draw the black point where you click
                point_projections(pointDrawn,x,y, centerX, centerY)
                pointDrawn++
            } else if (type == "edges") {
                if (edgesPointsDrawn == 1) {
                    edgePoints = []
                    edgeSegment = []
                    edgesCoordinates = []
                }
                for (let i = 0; i < pointsTrio.length; i++) {
                    if (pointsTrio[i][0] + 10 >= xPoint && xPoint >= pointsTrio[i][0] - 10 &&
                        pointsTrio[i][1] + 10 >= yPoint && yPoint >= pointsTrio[i][1] - 10 ) {
                            
                            xM = Math.abs(pointsTrio[i][0] - centerX)
                            yM = Math.abs(pointsTrio[i][1] + centerY)

                            edgeSegment.push([xM, yM]) // [70,90] ... [30,50]
                            console.log(edgeSegment)
                            draw_point(xM,yM)

                            if (edgesPointsDrawn == 2) {
                                edgesCoordinates.push([edgeSegment[0], edgeSegment[1]]) // [[70,90],[30,50]]
                            }
                            
                            //edge_draw(edgesPointsDrawn, edgePoints, xM, yM)
                            edgesPointsDrawn++
                        }
                }
                console.log(edgesCoordinates)
                
            }
             
    }
    function second_qudrant(x,y, type) {
        zPoint = Math.abs(y - centerY)

        if (edgesPointsDrawn == 3) {
            edgePoints = []
            edgeSegment = []
        }

        //align y coordinates points
        if (isAltPressed) {
            zPoint = pointsTrio[pointsTrio.length-1][2]
            y = (centerY - zPoint)
        }

        if (type == "points") {
            points.push(Math.abs(y - centerY))
            x = (centerX - xPoint)
            y = y
            //draw the projections to the axes
            //draw the black point where you click
            point_projections(pointDrawn,x,y, centerX, centerY)
            pointDrawn++

        } else if (type == "edges") {
            console.log(type)
            for (let i = 0; i < pointsTrio.length; i++) {
                if (pointsTrio[i][0] + 10 >= xPoint && xPoint >= pointsTrio[i][0] - 10 &&
                    pointsTrio[i][2] + 10 >= yPoint && yPoint >= pointsTrio[i][2] - 10 ) {
                        xM = Math.abs(pointsTrio[i][0] - centerX)
                        yM = Math.abs(pointsTrio[i][1] - centerY)
                        edgePoints[edgePoints.length - 1][edgePoints[edgePoints.length - 1].length - 1].push([xM, yM])

                        edgeSegment.push([xM, yM]) // [70,90] ... [30,50]
                        console.log(edgeSegment)

                        if (edgesPointsDrawn == 4) {
                            edgesCoordinates.push([edgeSegment[0], edgeSegment[1]]) // [[70,90],[30,50]]
                        }
                        console.log(edgesCoordinates)
                        //edge_draw(edgesPointsDrawn, edgePoints, xM, yM)
                        edgesPointsDrawn++
                    }
                }
                
        }

            
    }
    function third_quadrant(x,y, type) {
        x = (centerX + yPoint)
            y = (centerY - zPoint)
            pointsTrio.push([xPoint, yPoint, zPoint])

            //draw the projections to the axes
            //draw the black point where you click
            point_projections(pointDrawn,x,y, centerX, centerY)

            pointDrawn = 1
    }
    function point_projections(point, x, y, centerX, centerY) {
        // Draw projection lines to each axis
        if (point == 1) {
            ctx.strokeStyle = '#6495ed';

            // Draw line to X-axis
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, centerY);
            ctx.stroke();

            // Draw line to Y-axis
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(centerX, y);
            ctx.stroke();

            // Draw 45° line to x axis
            ctx.beginPath();
            ctx.moveTo(centerX, y);
            ctx.lineTo(centerX + (y - centerY), centerY);
            ctx.stroke();

            // Draw the help lines on the 2 quadrant
            ctx.beginPath();
            ctx.moveTo(x, centerY);
            ctx.lineTo(x, -1000);
            ctx.stroke();

            // Draw the help lines on the 3 quadrant
            ctx.beginPath();
            ctx.moveTo(centerX + (y - centerY), centerY);
            ctx.lineTo(centerX + (y - centerY), -1000);
            ctx.stroke();

            // Draw a black point at the clicked location
            ctx.fillStyle = 'black';
            ctx.fillRect(x - 3, y - 3, 6, 6);

            // Display the coordinates
            // ctx.fillStyle = '#6495ed';
            // ctx.font = 'bold 16px Arial';
            // ctx.fillText(`1X: ${Math.abs(x - centerX)}, Y: ${Math.abs(y - centerY)}`, x + 10, y - 10);
            // console.log("Point1: X: ", Math.abs(x - centerX), "Y: ", Math.abs(y - centerY))
        } else if (point == 2) {
            // Draw projection lines to each axis
            ctx.strokeStyle = '#6495ed';

            // Draw line to X-axis
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, centerY);
            ctx.stroke();

            // Draw line to Y-axis
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(centerX, y);
            ctx.stroke();

            // Draw line to the third quadrant
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.moveTo(centerX, y);
            ctx.lineTo((centerX + 1000), y);
            ctx.stroke();

            // Draw a black point at the clicked location
            ctx.fillStyle = 'black';
            ctx.fillRect(x - 3, y - 3, 6, 6);

            //Display the coordinates
            // ctx.fillStyle = '#6495ed';
            // ctx.font = 'bold 16px Arial';
            // ctx.fillText(`2X: ${Math.abs(x - centerX)}, Y: ${Math.abs(y - centerY)}`, x + 10, y - 10);
            // console.log("Point2: X: ", Math.abs(x - centerX), "Y: ", Math.abs(y - centerY)) 
        } else if (point == 3) {
            // Draw projection lines to each axis
            ctx.strokeStyle = '#6495ed';

            // Draw line to X-axis
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, centerY);
            ctx.stroke();

            // Draw line to Y-axis
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(centerX, y);
            ctx.stroke();

            // Draw a black point at the clicked location
            ctx.fillStyle = 'black';
            ctx.fillRect(x - 3, y - 3, 6, 6);

            // Display the coordinates
            // ctx.fillStyle = '#6495ed';
            // ctx.font = 'bold 16px Arial';
            // ctx.fillText(`3X: ${Math.abs(x - centerX)}, Y: ${Math.abs(y - centerY)}`, x + 10, y - 10);
            // console.log("Points3: X: ", Math.abs(x - centerX), "Y: ", Math.abs(y - centerY))
        }
    }
    function edge_draw(pointz, pointss, x, y) {
        if (pointz == 2 || pointz == 4 || pointz == 6) {
            ctx.strokeStyle = 'black';

            // Draw line to X-axis
            // ctx.beginPath();
            // ctx.moveTo(pointss[(edgePoints.length / 2 )- 1][0], pointss[(edgePoints.length / 2 )- 1][1]);
            // ctx.lineTo(pointss[edgePoints.length / 2][0], pointss[edgePoints.length / 2][1]);
            // ctx.stroke();
        }
        ctx.fillStyle = 'black';
        ctx.fillRect(x - 5, y - 5, 10, 10);
        edgesPointsDrawn++
    }
    function draw_point(x,y) {
        ctx.fillStyle = 'black';
        ctx.fillRect(x - 5, y - 5, 10, 10);
    }
    function redraw_points(points) {
        let point = 1
        for (let i = 0; i < points.length; i++) {
            for (let j = 0; j < 3; j++) {
                if (j == 0) {
                    point++
                    let xM = Math.abs(points[i][0] - centerX)
                    let yM = Math.abs(points[i][1] + centerY)
    
                    point_projections(1,xM, yM, centerX, centerY)
                } else if (j == 1) {
                    point ++
                    let xM = Math.abs(points[i][0] - centerX)
                    let yM = Math.abs(points[i][2] - centerY)
                    point_projections(2, xM, yM,centerX, centerY)
                } else {
                    point = 1
                    let xM = Math.abs(points[i][1] + centerX)
                    let yM = Math.abs(points[i][2] - centerY)
                    point_projections(3,xM, yM,centerX, centerY)
                }
            }
            //point_projections(point,points[i][0], points[i][1], centerX, centerY)
            
            
        }
    }
    function clear_canvas() {
        points = []
        pointsTrio = []
        edges = []
        pointDrawn = 1
        drawGrid()
        drawAxes()
        resize_canvas(canvasSize)
    }
    function change_href() {
        create_edges()
        let Mpoints = create_points()
        console.log(JSON.stringify(Mpoints)+"-"+JSON.stringify(edges))
        solids_link.href = `./solids.html?mySolid=${JSON.stringify(Mpoints)+"-"+JSON.stringify(edges)}`;
    }
    function create_edges() {
        edges = []
        let n_points = []
        for (let i = 0; i < pointsTrio.length; i++) {
            n_points.push(i)
        }
        if (edges.length == 0) {
            for (var i = 0; i < n_points.length; i++) {
                for (var j = 0; j < n_points.length; j++) {
                    // Avoid pairing a point with itself
                    if (i !== j) {
                            edges.push(n_points[i], n_points[j]);
                    }
                }
            }
        }
    }
    function create_points() {
        let pointsToPrint = []
                let x_first_point_difference = 0
                let y_first_point_difference = 0
                let z_first_point_difference = 0
                
                for (let i = 0; i < points.length; i++) {
                    if ((i + 1) % 3 == 0) {
                        pointsToPrint.push(Math.round(((points[i] / 100) - z_first_point_difference) * 1000) / 1000)
                    } else if ((i + 1) % 3 == 2) {
                        pointsToPrint.push(Math.round(((points[i] / 100) - y_first_point_difference) * 1000) / 1000)
                    } else {
                        pointsToPrint.push(Math.round(((points[i] / 100) - x_first_point_difference) * 1000) / 1000)
                    }
                }
        return pointsToPrint
    }
    function downsize() {
        if (pointDrawn == 1) {
            canvas_size = 2
            resize_canvas(2)
        } else {
            error("resize")
        }
    }
    function drawPoints() {
        isDrawEdges = false
        isDrawPoints = true
        b1.style.backgroundColor = "#aaa"
        b2.style.backgroundColor = "#fefefe"

    }
    function drawEdges() {
        isDrawEdges = true
        isDrawPoints = false
        b1.style.backgroundColor = "#fefefe"
        b2.style.backgroundColor = "#aaa"
    }

    function changeText(){
        var element = document.getElementById("text_value");
        create_edges()
        let Mpoints = create_points()
        mValue = JSON.stringify(Mpoints)+"-"+JSON.stringify(edges)
        element.innerHTML = mValue;
    }