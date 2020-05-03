// Create Renderer
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0x000000, 1);
document.body.appendChild( renderer.domElement );

// Create Scene
const scene = new THREE.Scene();

// Create Camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100.0 * R_earth );
camera.position.z = 4.0 * R_earth;
camera.position.y = 1.0 * R_earth;
camera.lookAt(0,0,0);
scene.add(camera);

// Earth Mesh
const earth_geom = new THREE.SphereGeometry(R_earth, 32, 32);
const earth_mat = new THREE.MeshPhongMaterial( {color: 0x999999} );
const earth_mesh = new THREE.Mesh(earth_geom, earth_mat);
scene.add(earth_mesh);

// Satellite Mesh
const sat = new Satellite(2.0 * R_earth, 0.0, Math.PI/2.0, 0.0, 0.0, 0.0);
const sat_geom = new THREE.SphereGeometry(0.1 * R_earth, 32, 32);
const sat_mat = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
const sat_mesh = new THREE.Mesh(sat_geom, sat_mat);
scene.add(sat_mesh);

// Ambient Light Source
const ambient_light = new THREE.AmbientLight(0xf1f1f1, 1);
scene.add(ambient_light);

// Spot Light Source
const spot_light = new THREE.DirectionalLight(0xffffff);
spot_light.position.set(100*R_earth,100*R_earth,100*R_earth);
scene.add(spot_light);

// Render loop
var t = 0.0;
function render() {
    t += 10.0;
    requestAnimationFrame(render);
    sat_mesh.position.copy(sat.position(t));


    renderer.render(scene, camera);
}
render();
