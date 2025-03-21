/* global QUnit */
import { Spherical } from '../../../../src/math/Spherical.js';
import { Vector3 } from '../../../../src/math/Vector3.js';
import {
	eps
} from '../../utils/math-constants.js';
export default QUnit.module( 'Maths', () => {
	QUnit.module( 'Spherical', () => {
		// INSTANCING
		QUnit.test( 'Instancing', ( assert ) => {
			let a = new Spherical();
			const radius = 10.0;
			const phi = Math.acos( - 0.5 );
			const theta = Math.sqrt( Math.PI ) * phi;
			assert.strictEqual( a.radius, 1.0, 'Default values: check radius' );
			assert.strictEqual( a.phi, 0, 'Default values: check phi' );
			assert.strictEqual( a.theta, 0, 'Default values: check theta' );
			a = new Spherical( radius, phi, theta );
			assert.strictEqual( a.radius, radius, 'Custom values: check radius' );
			assert.strictEqual( a.phi, phi, 'Custom values: check phi' );
			assert.strictEqual( a.theta, theta, 'Custom values: check theta' );
		} );
		// PUBLIC STUFF
		QUnit.test( 'set', ( assert ) => {
			const a = new Spherical();
			const radius = 10.0;
			const phi = Math.acos( - 0.5 );
			const theta = Math.sqrt( Math.PI ) * phi;
			a.set( radius, phi, theta );
			assert.strictEqual( a.radius, radius, 'Check radius' );
			assert.strictEqual( a.phi, phi, 'Check phi' );
			assert.strictEqual( a.theta, theta, 'Check theta' );
		} );
		QUnit.test( 'clone', ( assert ) => {
			const radius = 10.0;
			const phi = Math.acos( - 0.5 );
			const theta = Math.sqrt( Math.PI ) * phi;
			const a = new Spherical( radius, phi, theta );
			const b = a.clone();
			assert.propEqual( a, b, 'Check a and b are equal after clone()' );
			a.radius = 2.0;
			assert.notPropEqual( a, b, 'Check a and b are not equal after modification' );
		} );
		QUnit.test( 'copy', ( assert ) => {
			const radius = 10.0;
			const phi = Math.acos( - 0.5 );
			const theta = Math.sqrt( Math.PI ) * phi;
			const a = new Spherical( radius, phi, theta );
			const b = new Spherical().copy( a );
			assert.propEqual( a, b, 'Check a and b are equal after copy()' );
			a.radius = 2.0;
			assert.notPropEqual( a, b, 'Check a and b are not equal after modification' );
		} );
		QUnit.test( 'makeSafe', ( assert ) => {
			const EPS = 0.000001; // from source
			const tooLow = 0.0;
			const tooHigh = Math.PI;
			const justRight = 1.5;
			const a = new Spherical( 1, tooLow, 0 );
			a.makeSafe();
			assert.strictEqual( a.phi, EPS, 'Check if small values are set to EPS' );
			a.set( 1, tooHigh, 0 );
			a.makeSafe();
			assert.strictEqual( a.phi, Math.PI - EPS, 'Check if high values are set to (Math.PI - EPS)' );
			a.set( 1, justRight, 0 );
			a.makeSafe();
			assert.strictEqual( a.phi, justRight, 'Check that valid values don\'t get changed' );
		} );
		QUnit.test( 'setFromVector3', ( assert ) => {
			const a = new Spherical( 1, 1, 1 );
			const b = new Vector3( 0, 0, 0 );
			const c = new Vector3( Math.PI, 1, - Math.PI );
			const expected = new Spherical( 4.554032147688322, 1.3494066171539107, 2.356194490192345 );
			a.setFromVector3( b );
			assert.strictEqual( a.radius, 0, 'Zero-length vector: check radius' );
			assert.strictEqual( a.phi, 0, 'Zero-length vector: check phi' );
			assert.strictEqual( a.theta, 0, 'Zero-length vector: check theta' );
			a.setFromVector3( c );
			assert.ok( Math.abs( a.radius - expected.radius ) <= eps, 'Normal vector: check radius' );
			assert.ok( Math.abs( a.phi - expected.phi ) <= eps, 'Normal vector: check phi' );
			assert.ok( Math.abs( a.theta - expected.theta ) <= eps, 'Normal vector: check theta' );
		} );
		QUnit.test( 'setFromCartesianCoords', ( assert ) => {
			const a = new Spherical( 1, 1, 1 );
			const expected = new Spherical( 4.554032147688322, 1.3494066171539107, 2.356194490192345 );
			a.setFromCartesianCoords( 0, 0, 0 );
			assert.strictEqual( a.radius, 0, 'Zero-length vector: check radius' );
			assert.strictEqual( a.phi, 0, 'Zero-length vector: check phi' );
			assert.strictEqual( a.theta, 0, 'Zero-length vector: check theta' );
			a.setFromCartesianCoords( Math.PI, 1, - Math.PI );
			assert.ok( Math.abs( a.radius - expected.radius ) <= eps, 'Normal vector: check radius' );
			assert.ok( Math.abs( a.phi - expected.phi ) <= eps, 'Normal vector: check phi' );
			assert.ok( Math.abs( a.theta - expected.theta ) <= eps, 'Normal vector: check theta' );
		} );
	} );
} );
