/*
 * Copyright (C) 2020 Maitreya Venkataswamy - All Rights Reserved
 */

// Standard gravitational parameter of Earth
const mu = 3.9860044189e14; // m^3 / s^2

// Average Radius of Earth (spherical model)
const R_earth = 6.371009e6; // m

// TODO: Add doc for class
class Satellite {
    // Constructor for Satellite class
    constructor(a, e, i, omega, Omega, nu_0) {
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
        var E_0 = 2.0 * Math.atan(Math.sqrt((1 - e)/(1 + e)) * Math.tan(nu_0 / 2.0));

        // Compute mean anomaly at start epoch
        this.M_0 = E_0 - e * Math.sin(E_0);
    }

    position(t) {
        // Compute mean anomaly at the queried time
        var M = (this.M_0 + t * this.mean_motion) % (2.0 * Math.PI);

        // Obtain the eccentricity as a local variable
        var e = this.e;

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
        var nu = 2.0 * Math.atan(Math.sqrt((1.0 + e)/(1.0 - e)) * Math.tan(Ek / 2.0));

        // Get position vector in perfical reference frame
        var r_pqw_ = math.multiply(
                        this.a * (1.0 - Math.pow(this.e, 2) / (1.0 + this.e * Math.cos(nu))),
                        math.matrix([[Math.cos(nu)], [Math.sin(nu)], [0.0]])
                    );

        // Construct inverted rotation matrices from perfical frame to earth inertial frame
        var R3_Omega_inv = math.matrix([[Math.cos(this.Omega), -Math.sin(this.Omega), 0.0],
                                        [Math.sin(this.Omega), Math.cos(this.Omega), 0.0],
                                        [0.0, 0.0, 1.0]]);
        var R1_i_inv = math.matrix([[1.0, 0.0, 0.0],
                                    [0.0, Math.cos(this.i), -Math.sin(this.i)],
                                    [0.0, Math.sin(this.i), Math.cos(this.i)]]);
        var R3_omega_inv = math.matrix([[Math.cos(this.omega), -Math.sin(this.omega), 0.0],
                                        [Math.sin(this.omega), Math.cos(this.omega), 0.0],
                                        [0.0, 0.0, 1.0]]);

        // Convert the position from the perifocal frame to the earth centered inertial frame
        var r_eci_ = math.multiply(R3_Omega_inv,
                                   math.multiply(R1_i_inv,
                                                 math.multiply(R3_omega_inv,
                                                               r_pqw_)
                                                )
                                  );

        return r_eci_;
    }
}
