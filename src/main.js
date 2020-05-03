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

// Earth Mesh
const earth_geom = new THREE.SphereGeometry(R_earth, 32, 32);
const earth_mat = new THREE.MeshNormalMaterial();
const earth_mesh = new THREE.Mesh(earth_geom, earth_mat);
scene.add(earth_mesh);

// Axes of intertial reference frame
const axesHelper = new THREE.AxesHelper(2.0 * R_earth);
scene.add( axesHelper );

// Satellite Mesh
const sat1 = new Satellite(2.0 * R_earth, 0.0, 0.0, 0.0, 0.0, 0.0, scene);
const sat2 = new Satellite(2.0 * R_earth, 0.0, 0.0, 0.0, 0.0, Math.PI, scene);

// Ambient Light Source
const ambient_light = new THREE.AmbientLight(0xf1f1f1, 1);
scene.add(ambient_light);

// Spot Light Source
//const spot_light = new THREE.DirectionalLight(0xffffff);
//spot_light.position.set(100*R_earth,100*R_earth,100*R_earth);
//scene.add(spot_light);

// Render loop
var t = 0.0;
function render() {
    t += 50.0;
    requestAnimationFrame(render);
    sat1.updatePosition(t);
    sat2.updatePosition(t);

    controls.update();
    renderer.render(scene, camera);
}
render();
