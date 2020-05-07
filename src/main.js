// Create Renderer
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0x000000, 1);
document.body.appendChild( renderer.domElement );

// Create Scene
const scene = new THREE.Scene();

// Create Camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100.0 * R_earth );
camera.up.set(0,0,1);
scene.add(camera);

// Orbit controls
const controls = new THREE.OrbitControls( camera, renderer.domElement );
camera.position.y = 4.0 * R_earth;
camera.position.z = 1.0 * R_earth;
camera.lookAt(0,0,0);
controls.update();

// Earth
const earth_geom = new THREE.SphereGeometry(R_earth, 32, 32);
const earth_mat = new THREE.MeshPhongMaterial( { color: 0x999999 } );
const earth_mesh = new THREE.Mesh(earth_geom, earth_mat);
scene.add(earth_mesh);

// Ground Station
const ground_station = new GroundStation(30.0 * Math.PI / 180.0, 0.0);

// Axes of intertial reference frame
const axesHelper = new THREE.AxesHelper(2.0 * R_earth);
scene.add( axesHelper );

// Satellite Constellation
const walker_con = new WalkerConstellation(60.0 * Math.PI / 180.0, 60, 12, 2, 2.0 * R_earth, scene);

// Ambient Light Source
const ambient_light = new THREE.AmbientLight(0xf1f1f1, 1);
scene.add(ambient_light);

// Render loop
var t = 0.0;
function render() {
    t += 10.0;
    requestAnimationFrame(render);
    walker_con.updatePositions(t);
    ground_station.updatePosition(t);

    controls.update();
    renderer.render(scene, camera);
}
render();
