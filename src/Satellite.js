/*
 * Copyright (C) 2020 Maitreya Venkataswamy - All Rights Reserved
 */

// Standard gravitational parameter of Earth
const mu = 3.9860044189e5; // km^3 / s^2

// Average Radius of Earth (spherical model)
const R_earth = 6.371009e3; // km

// TODO: Add doc for class
class Satellite {
    // Constructor for Satellite class
    constructor(a, e, i, omega, Omega, nu_0, scene) {
        // Initialize semi-major-axis length
        this.a = a;

        // Initialize orbit eccentricity
        this.e = e;

        // Initialize orbit inclination
        this.i = i;

        // Initialize argument of periapsis
        this.omega = omega;

        // Initialize RAAN
        this.Omega = Omega;

        // Compute mean motion of satellite
        this.mean_motion = Math.sqrt(mu / Math.pow(a, 3));

        // Compute eccentric anomaly at start epoch
        const E_0 = 2.0 * Math.atan(Math.sqrt((1 - e)/(1 + e)) * Math.tan(nu_0 / 2.0));

        // Compute mean anomaly at start epoch
        this.M_0 = E_0 - e * Math.sin(E_0);

        // Satellite geometry in renderiing
        const geometry = new THREE.SphereGeometry(0.05 * R_earth, 32, 32);

        // Satellite material in rendering
        const material = new THREE.MeshLambertMaterial( { color: 0x999999 } );

        // Satellite mesh in rendering
        this.mesh = new THREE.Mesh(geometry, material);

        // Add the satellite mesh to the scene
        scene.add(this.mesh);

        // Plot the orbit of the satellite
        this.plotOrbit(scene);
    }

    // TODO: Add doc for function
    position(t) {
        // Compute mean anomaly at the queried time
        const M = (this.M_0 + t * this.mean_motion) % (2.0 * Math.PI);

        // Obtain the eccentricity as a local variable
        const e = this.e;

        // Define the N-R iteration function and its derivative
        function f(Ek) { return Ek - e * Math.sin(Ek) - M; }
        function fp(Ek) { return 1.0 - e * Math.cos(Ek); }

        // Initialize a initial guess for the eccentric anomaly and the previous guess
        var Ekp1 = 1.0;
        var Ek = 0.0;

        // Iterate using the N-R scheme until the tolerance criteria is met
        while (Math.abs((Ekp1 - Ek) / Ekp1) > 1e-6) {
            Ek = Ekp1;
            Ekp1 = Ek - f(Ek) / fp(Ek);
        }

        // Compute true anomaly at the queried time
        const nu = 2.0 * Math.atan(Math.sqrt((1.0 + e)/(1.0 - e)) * Math.tan(Ek / 2.0));

        // Get position vector in perfical reference frame
        const r_pqw_ = new THREE.Vector3(Math.cos(nu), Math.sin(nu), 0.0).multiplyScalar(
                        this.a * (1.0 - Math.pow(this.e, 2) / (1.0 + this.e * Math.cos(nu))) );


        // Construct inverted rotation matrices from perfical frame to earth inertial frame
        const R3_Omega_inv = new THREE.Matrix3().set(
                                Math.cos(this.Omega) , -Math.sin(this.Omega), 0.0,
                                Math.sin(this.Omega) , Math.cos(this.Omega) , 0.0,
                                0.0                  , 0.0                  , 1.0);
        const R1_i_inv = new THREE.Matrix3().set(
                                1.0                  , 0.0                  , 0.0,
                                0.0                  , Math.cos(this.i)     , -Math.sin(this.i),
                                0.0                  , Math.sin(this.i)     , Math.cos(this.i));
        const R3_omega_inv = new THREE.Matrix3().set(
                                Math.cos(this.omega) , -Math.sin(this.omega), 0.0,
                                Math.sin(this.omega) , Math.cos(this.omega) , 0.0,
                                0.0                  , 0.0                  , 1.0);

        // Convert the position from the perifocal frame to the Earth centered inertial frame
        const r_eci_ = r_pqw_.clone();
        r_eci_.applyMatrix3(R3_omega_inv).applyMatrix3(R1_i_inv).applyMatrix3(R3_Omega_inv);

        // Return the position vector in the Earth centered inertial frame
        return r_eci_;
    }

    // TODO: Add doc for function
    updatePosition(t) {
        // Update the position of the satellite in the scene
        this.mesh.position.copy(this.position(t));
    }

    // TODO: Add doc for this function
    plotOrbit(scene) {
        // Compute period of the orbit
        const T = 2.0 * Math.PI * Math.sqrt(Math.pow(this.a, 3) / mu);

        // Compute the orbit of the satellite as an array of positions
        const points = [];
        for (var t = 0; t < T; t += T / 100.0) {
            points.push(this.position(t));
        }

        // Create a curve for the orbit
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const material = new THREE.LineBasicMaterial( { color : 0xffffff } );
        const orbit = new THREE.Line( geometry, material );

        // Add the orbit to the scene
        scene.add(orbit);
    }
}
