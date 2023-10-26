// Initialize Three.js scene
//const SOLID = "custom" //"cube" "pentagon" "pyramid" "cylinder" "custom"
let vertices = []
let edges = []

let turn_left = false
let turn_right = false
let turn_up = false
let turn_down = false
const rotation_velocity = 0.01
const view_angle = 0.4

let custom_vertices = []
let custom_edges = []
const multiplyer = 1.7

const camera_distance = 20

function getQueryVariable() {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) === "myVar") {
        return decodeURIComponent(pair[1]);
      } else if (decodeURIComponent(pair[0]) === "mySolid") {
        let custom_pair = pair[1].split('-')
        custom_vertices = custom_pair[0].split("[").toString().split("]")[0].split(",")
        custom_vertices.shift()
        custom_edges = custom_pair[1].split("[").toString().split("]")[0].split(",")
        custom_edges.shift()
        console.log(custom_vertices, custom_edges)

        return "custom"

      }
    }
    return undefined; // Return undefined if the variable is not found
  }

  // Get the value of myVar
var SOLID = getQueryVariable();
if (SOLID == undefined) {
    SOLID = "custom"
}
const scene = new THREE.Scene();



// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = camera_distance;

document.body.onkeydown = (e) => {
    // if (e.key == " " || 
    //     e.code == "Space" ||
    //     e.keyCode == 32
    // ) {
    //     block = !block
    //     console.log(lines.rotation.x, lines.rotation.y, lines.rotation.z)

    // } else 
    if (e.key.toUpperCase() === 'R') {
        reset()
    } else if (e.key.toUpperCase() == "A") {
        turn_left = true
    } else if (e.key.toUpperCase() == "D") {
        turn_right = true
    } else if (e.key.toUpperCase() == "W") {
        turn_up = true
    } else if (e.key.toUpperCase() == "S") {
        turn_down = true
    }
}

document.body.onkeyup = (e) => {
    if (e.key.toUpperCase() == "A") {
        turn_left = false
    } else if (e.key.toUpperCase() == "D") {
        turn_right = false
    } else if (e.key.toUpperCase() == "W") {
        turn_up = false
    } else if (e.key.toUpperCase() == "S") {
        turn_down = false
    }
}

// ========================================================================================================
// ========================================================================================================

function display() {

}
const xLineGeometry = new THREE.BufferGeometry();
const yLineGeometry = new THREE.BufferGeometry();
const zLineGeometry = new THREE.BufferGeometry();

const xLineVertices = new Float32Array([
    0, 0, 0,  // Start point
    10, 0, 0    // End point
]);
const yLineVertices = new Float32Array([
    0, 0, 0,  // Start point
    0, 10, 0    // End point
]);
const zLineVertices = new Float32Array([
    0, 0, 0,  // Start point
    0, 0, 10    // End point
]);
xLineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(xLineVertices, 3));
yLineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(yLineVertices, 3));
zLineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(zLineVertices, 3));


// Create a material for the green line (green color)
const xLineMaterial = new THREE.LineBasicMaterial({ color: 0x13e800, linewidth: 4 });
const yLineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 4 });
const zLineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 4 });


// Create a Line object for the green line
const xLine = new THREE.Line(xLineGeometry, xLineMaterial);
const yLine = new THREE.Line(yLineGeometry, yLineMaterial);
const zLine = new THREE.Line(zLineGeometry, zLineMaterial);

// Add the green line to the scene
scene.add(xLine, yLine, zLine);

// ========================================================================================================
// ========================================================================================================

//////grdiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiid
        const gridSize = 10; // Number of cells in each direction
        const cellSize = 1; // Size of each cell
        const gridMaterial = new THREE.LineBasicMaterial({ color: 0xCCCCCC });

        const xGridGeometry = new THREE.Geometry();
        const yGridGeometry = new THREE.Geometry();
        const zGridGeometry = new THREE.Geometry();

        draw_grid_lines()
        

        const xGrid = new THREE.LineSegments(xGridGeometry, gridMaterial);
        const yGrid = new THREE.LineSegments(yGridGeometry, gridMaterial);
        const zGrid = new THREE.LineSegments(yGridGeometry, gridMaterial);


        scene.add(xGrid);
        scene.add(yGrid);
        scene.add(zGrid);



// ========================================================================================================
// ========================================================================================================

// Create a WebGL renderer
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffffff); // Set background color to white
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Define the vertices and edges for the solids
if (SOLID == "cube") {
    cube();
} else if (SOLID == "pentagon") {
    pentagon();
} else if (SOLID == "pyramid") {
    pyramid();
} else if (SOLID == "cylinder") {
    cylinder();
} else if (SOLID == "custom") {
    custom()
}

function cube() {
    vertices = [
        2, 6, 6,  // Front top left
        6, 6, 6,   // Front top right
        6, 2, 6,  // Front bottom right
        2, 2, 6, // Front bottom left
        2, 6, 2, // Back top left
        6, 6, 2,  // Back top right
        6, 2, 2, // Back bottom right
        2, 2, 2 // Back bottom left
    ];

    // Define the edges (pairs of vertices) of the cube
    edges = [
        0, 1, 1, 2, 2, 3, 3, 0, // Front face
        4, 5, 5, 6, 6, 7, 7, 4, // Back face
        0, 4, 1, 5, 2, 6, 3, 7  // Connect front and back faces
    ];
}

function custom() {
    vertices = correct_axes(array_multiplyer(custom_vertices, multiplyer))
    edges = custom_edges
}

function pentagon() {
    vertices = [
        5.,    6.,    3,    
        2.147, 3.927, 3,    
        7.853, 3.927, 3,    
        3.236, 0.573, 3,
        6.764, 0.573, 3,    
        5. ,   6. ,   6, 
        2.147 ,3.927 ,6,  
        7.853, 3.927 ,6,
        3.236 ,0.573, 6,  
        6.764, 0.573, 6,]

    // Define the edges (pairs of vertices) of the cube
    edges = [
        0, 1, 1, 3, 3, 4, 4, 2, 2, 0,    // Front face
        5, 6, 6, 8, 8, 9, 9, 7, 7, 5,    // Back face
        0, 5, 1, 6, 2, 7, 3, 8, 4, 9,    // Face connections
    ];
}

function pyramid() {
    vertices = [
        4, 6.5, 4,                   // Top vertex
        2, 2, 2,          // Bottom left vertex
        6, 2, 2,           // Bottom right vertex
        2, 2, 6,         // Bottom left corner vertex
        6, 2, 6,           // Bottom right corner vertex
    ];

    // Define the edges (pairs of vertices) of the pyramid
    edges = [
        0, 1, 0, 2, 0, 3, 0, 4, // From top to bottom
        1, 2, 2, 4, 1, 3, 3, 4  // Front face
    ];
}

function cylinder() {
    const radius = 2;
    const height = 4;
    const segments = 20;

    // Define the vertices for the cylinder's side
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const x = radius * Math.cos(theta);
        const y = (height / 2)
        const z = radius * Math.sin(theta);

        vertices.push( x + 5, -y + 5, z + 5); // Bottom vertex
        vertices.push( x + 5, y + 5, z + 5);  // Top vertex

        // Define the edge connecting the top and bottom vertices
        if (i < segments) {
            edges.push(i * 2, i * 2 + 1);
        }
    }

    // Define the edges (pairs of vertices) for the top and bottom faces
    for (let i = 0; i < segments; i++) {
        edges.push(i * 2, (i + 1) * 2);
        edges.push(i * 2 + 1, (i + 1) * 2 + 1);
    }
}


// Create a geometry for the solid
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
geometry.setIndex(edges);

// Create a material for the lines
const material = new THREE.LineBasicMaterial({ color: 0x000000 });

// Create a LineSegments object to display the lines
const lines = new THREE.LineSegments(geometry, material);

// Add the lines to the scene
scene.add(lines);

//let block = false
  

// Animation loop
angulation(view_angle)
const animate = () => {
    requestAnimationFrame(animate);
    if (turn_left) {
        ruotate(-rotation_velocity, "x")
    } else if (turn_right) {
        ruotate(rotation_velocity, "x")
    } else if (turn_up) {
        ruotate(-rotation_velocity, "y")            
    } else if (turn_down) {
        ruotate(rotation_velocity, "y")            
    } 

    // Rotate the solid
    

    renderer.render(scene, camera);
};

// Handle window resize
window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
});

// Start the animation loop
animate();

function correct_axes(vertices) {
    let vertices_trio = []
    let output_array = []
    let trio = []
    for (let i = 0; i < vertices.length; i++) {
        if ((i + 1) % 3 == 0) {
            trio.push(vertices[i])
        } else if (((i + 1) % 3 == 2)) {
            trio.push(vertices[i])
        } else {
            trio.push(vertices[i])
        }

        if (trio.length == 3) {
            vertices_trio.push([trio[1],trio[2],trio[0]])
            trio = []
        }
        
    }

    for (let i = 0; i < vertices_trio.length; i++) {
        output_array.push(vertices_trio[i][0],vertices_trio[i][1],vertices_trio[i][2])
    }
    return output_array
}
function angulation(angle) {
        lines.rotation.x = angle;
        xLine.rotation.x = angle
        yLine.rotation.x = angle
        zLine.rotation.x = angle
        xGrid.rotation.x = angle
        yGrid.rotation.x = angle
        zGrid.rotation.x = angle

}
function ruotate(velocity, axes) {
    if (axes == "x") {
        lines.rotation.y += velocity
        xLine.rotation.y += velocity
        yLine.rotation.y += velocity
        zLine.rotation.y += velocity
        xGrid.rotation.y += velocity
        yGrid.rotation.y += velocity
        zGrid.rotation.y += velocity
    } else if (axes == "y") {
        lines.rotation.x += velocity
        xLine.rotation.x += velocity
        yLine.rotation.x += velocity
        zLine.rotation.x += velocity
        xGrid.rotation.x += velocity
        yGrid.rotation.x += velocity
        zGrid.rotation.x += velocity
    }
        

}
function draw_grid_lines() {
    //=============X===================
    // Create horizontal grid lines
    for (let i = 1; i <= gridSize; i++) {
        xGridGeometry.vertices.push(new THREE.Vector3(0, 0, i * cellSize));
        xGridGeometry.vertices.push(new THREE.Vector3(cellSize * gridSize, 0,  i * cellSize));
    }

    // Create vertical grid lines
    for (let i = 1; i <= gridSize; i++) {
        xGridGeometry.vertices.push(new THREE.Vector3(i * cellSize, 0, 0));
        xGridGeometry.vertices.push(new THREE.Vector3(i * cellSize, 0, gridSize * cellSize));
    }
    //=============Y===================
    // Create horizontal grid lines
    for (let i = 1; i <= gridSize; i++) {
        yGridGeometry.vertices.push(new THREE.Vector3(0, i * cellSize, 0));
        yGridGeometry.vertices.push(new THREE.Vector3(cellSize * gridSize, i * cellSize, 0));
    }

    // Create vertical grid lines
    for (let i = 1; i <= gridSize; i++) {
        yGridGeometry.vertices.push(new THREE.Vector3(i * cellSize, 0, 0));
        yGridGeometry.vertices.push(new THREE.Vector3(i * cellSize, gridSize * cellSize, 0));
    }
    //=============Z===================
    // Create horizontal grid lines
    for (let i = 1; i <= gridSize; i++) {
        yGridGeometry.vertices.push(new THREE.Vector3(0, i * cellSize, 0));
        yGridGeometry.vertices.push(new THREE.Vector3(0, i * cellSize, cellSize * gridSize));
    }

    // Create vertical grid lines
    for (let i = 1; i <= gridSize; i++) {
        yGridGeometry.vertices.push(new THREE.Vector3(0, 0, i * cellSize));
        yGridGeometry.vertices.push(new THREE.Vector3(0, gridSize * cellSize, i * cellSize));
    }
}
function array_multiplyer(array, n) {
    let Marray = []
    for (let i = 0; i < array.length; i++) {
        Marray.push(array[i] * n)
    }
    return Marray
}
function reset() {
    lines.rotation.y = 0
    xLine.rotation.y = 0
    zLine.rotation.y = 0
    yLine.rotation.y = 0
    yGrid.rotation.y = 0
    xGrid.rotation.y = 0
    zGrid.rotation.y = 0
    lines.rotation.x = view_angle
    xLine.rotation.x = view_angle
    zLine.rotation.x = view_angle
    yLine.rotation.x = view_angle
    yGrid.rotation.x = view_angle
    xGrid.rotation.x = view_angle
    zGrid.rotation.x = view_angle
}