/* global QUnit */
import { QuadraticBezierCurve3 } from '../../../../../src/extras/curves/QuadraticBezierCurve3.js';
import { Curve } from '../../../../../src/extras/core/Curve.js';
import { Vector3 } from '../../../../../src/math/Vector3.js';
export default QUnit.module( 'Extras', () => {
	QUnit.module( 'Curves', () => {
		QUnit.module( 'QuadraticBezierCurve3', ( hooks ) => {
			let _curve = undefined;
			hooks.before( function () {
				_curve = new QuadraticBezierCurve3(
					new Vector3( - 10, 0, 2 ),
					new Vector3( 20, 15, - 5 ),
					new Vector3( 10, 0, 10 )
				);
			} );
			// INHERITANCE
			QUnit.test( 'Extending', ( assert ) => {
				const object = new QuadraticBezierCurve3();
				assert.strictEqual(
					object instanceof Curve, true,
					'QuadraticBezierCurve3 extends from Curve'
				);
			} );
			// INSTANCING
			QUnit.test( 'Instancing', ( assert ) => {
				const object = new QuadraticBezierCurve3();
				assert.ok( object, 'Can instantiate a QuadraticBezierCurve3.' );
			} );
			// PROPERTIES
			QUnit.test( 'type', ( assert ) => {
				const object = new QuadraticBezierCurve3();
				assert.ok(
					object.type === 'QuadraticBezierCurve3',
					'QuadraticBezierCurve3.type should be QuadraticBezierCurve3'
				);
			} );
			QUnit.todo( 'v0', ( assert ) => {
				// Vector3 exists
				assert.ok( false, 'everything\'s gonna be alright' );
			} );
			QUnit.todo( 'v1', ( assert ) => {
				// Vector3 exists
				assert.ok( false, 'everything\'s gonna be alright' );
			} );
			QUnit.todo( 'v2', ( assert ) => {
				// Vector3 exists
				assert.ok( false, 'everything\'s gonna be alright' );
			} );
			// PUBLIC
			QUnit.test( 'isQuadraticBezierCurve3', ( assert ) => {
				const object = new QuadraticBezierCurve3();
				assert.ok(
					object.isQuadraticBezierCurve3,
					'QuadraticBezierCurve3.isQuadraticBezierCurve3 should be true'
				);
			} );
			QUnit.todo( 'getPoint', ( assert ) => {
				assert.ok( false, 'everything\'s gonna be alright' );
			} );
			QUnit.todo( 'copy', ( assert ) => {
				assert.ok( false, 'everything\'s gonna be alright' );
			} );
			QUnit.todo( 'toJSON', ( assert ) => {
				assert.ok( false, 'everything\'s gonna be alright' );
			} );
			QUnit.todo( 'fromJSON', ( assert ) => {
				assert.ok( false, 'everything\'s gonna be alright' );
			} );
			// OTHERS
			QUnit.test( 'Simple curve', ( assert ) => {
				const curve = _curve;
				const expectedPoints = [
					new Vector3( - 10, 0, 2 ),
					new Vector3( 2.5, 5.625, - 0.125 ),
					new Vector3( 10, 7.5, 0.5 ),
					new Vector3( 12.5, 5.625, 3.875 ),
					new Vector3( 10, 0, 10 )
				];
				let points = curve.getPoints( expectedPoints.length - 1 );
				assert.strictEqual( points.length, expectedPoints.length, 'Correct number of points' );
				assert.deepEqual( points, expectedPoints, 'Correct points calculated' );
				// symmetry
				const curveRev = new QuadraticBezierCurve3(
					curve.v2, curve.v1, curve.v0
				);
				points = curveRev.getPoints( expectedPoints.length - 1 );
				assert.strictEqual( points.length, expectedPoints.length, 'Reversed: Correct number of points' );
				assert.deepEqual( points, expectedPoints.reverse(), 'Reversed: Correct points curve' );
			} );
			QUnit.test( 'getLength/getLengths', ( assert ) => {
				const curve = _curve;
				const length = curve.getLength();
				const expectedLength = 35.47294274967861;
				assert.numEqual( length, expectedLength, 'Correct length of curve' );
				const expectedLengths = [
					0,
					13.871057998581074,
					21.62710402732536,
					26.226696400568883,
					34.91037361704809
				];
				const lengths = curve.getLengths( expectedLengths.length - 1 );
				assert.strictEqual( lengths.length, expectedLengths.length, 'Correct number of segments' );
				lengths.forEach( function ( segment, i ) {
					assert.numEqual( segment, expectedLengths[ i ], 'segment[' + i + '] correct' );
				} );
			} );
			QUnit.test( 'getPointAt', ( assert ) => {
				const curve = _curve;
				const expectedPoints = [
					new Vector3( - 10, 0, 2 ),
					new Vector3( - 0.4981634504454243, 4.427089043881476, 0.19308849757196012 ),
					new Vector3( 6.149415812887238, 6.838853310980195, - 0.20278120208668637 ),
					new Vector3( 10, 0, 10 )
				];
				const points = [
					curve.getPointAt( 0, new Vector3() ),
					curve.getPointAt( 0.3, new Vector3() ),
					curve.getPointAt( 0.5, new Vector3() ),
					curve.getPointAt( 1, new Vector3() )
				];
				assert.deepEqual( points, expectedPoints, 'Correct points' );
			} );
			QUnit.test( 'getTangent/getTangentAt', ( assert ) => {
				const curve = _curve;
				let expectedTangents = [
					new Vector3( 0.8755715084258769, 0.4377711603816079, - 0.2042815331129452 ),
					new Vector3( 0.9340289249885844, 0.3502608468707904, - 0.07005216937416067 ),
					new Vector3( 0.9284766908853163, 0, 0.37139067635396156 ),
					new Vector3( - 3.669031233375946e-13, - 0.6196442885791218, 0.7848827655333463 ),
					new Vector3( - 0.4263618889888853, - 0.6396068005601663, 0.6396238584473043 )
				];
				let tangents = [
					curve.getTangent( 0, new Vector3() ),
					curve.getTangent( 0.25, new Vector3() ),
					curve.getTangent( 0.5, new Vector3() ),
					curve.getTangent( 0.75, new Vector3() ),
					curve.getTangent( 1, new Vector3() )
				];
				expectedTangents.forEach( function ( exp, i ) {
					const tangent = tangents[ i ];
					assert.numEqual( tangent.x, exp.x, 'getTangent #' + i + ': x correct' );
					assert.numEqual( tangent.y, exp.y, 'getTangent #' + i + ': y correct' );
				} );
				//
				expectedTangents = [
					new Vector3( 0.8755715084258769, 0.4377711603816079, - 0.2042815331129452 ),
					new Vector3( 0.9060725703490549, 0.3984742932857448, - 0.14230507668907377 ),
					new Vector3( 0.9621604167456882, 0.2688562845452628, 0.044312872940942424 ),
					new Vector3( 0.016586454041780826, - 0.6163270940470614, 0.7873155674098058 ),
					new Vector3( - 0.4263618889888853, - 0.6396068005601663, 0.6396238584473043 )
				];
				tangents = [
					curve.getTangentAt( 0, new Vector3() ),
					curve.getTangentAt( 0.25, new Vector3() ),
					curve.getTangentAt( 0.5, new Vector3() ),
					curve.getTangentAt( 0.75, new Vector3() ),
					curve.getTangentAt( 1, new Vector3() )
				];
				expectedTangents.forEach( function ( exp, i ) {
					const tangent = tangents[ i ];
					assert.numEqual( tangent.x, exp.x, 'getTangentAt #' + i + ': x correct' );
					assert.numEqual( tangent.y, exp.y, 'getTangentAt #' + i + ': y correct' );
				} );
			} );
			QUnit.test( 'getUtoTmapping', ( assert ) => {
				const curve = _curve;
				const start = curve.getUtoTmapping( 0, 0 );
				const end = curve.getUtoTmapping( 0, curve.getLength() );
				const somewhere = curve.getUtoTmapping( 0.5, 1 );
				const expectedSomewhere = 0.014760890927167196;
				assert.strictEqual( start, 0, 'getUtoTmapping( 0, 0 ) is the starting point' );
				assert.strictEqual( end, 1, 'getUtoTmapping( 0, length ) is the ending point' );
				assert.numEqual( somewhere, expectedSomewhere, 'getUtoTmapping( 0.5, 1 ) is correct' );
			} );
			QUnit.test( 'getSpacedPoints', ( assert ) => {
				const curve = _curve;
				const expectedPoints = [
					new Vector3( - 10, 0, 2 ),
					new Vector3( - 3.712652983516992, 3.015179001762753, 0.6957120710270492 ),
					new Vector3( 2.7830973773262975, 5.730399338061483, - 0.1452668772806931 ),
					new Vector3( 9.575825284074465, 7.48754187603603, 0.3461104039841496 ),
					new Vector3( 12.345199937734154, 4.575759904730531, 5.142117429101656 ),
					new Vector3( 10, 0, 10 )
				];
				const points = curve.getSpacedPoints();
				assert.strictEqual( points.length, expectedPoints.length, 'Correct number of points' );
				assert.deepEqual( points, expectedPoints, 'Correct points calculated' );
			} );
			QUnit.test( 'computeFrenetFrames', ( assert ) => {
				const curve = _curve;
				const expected = {
					binormals: [
						new Vector3( - 0.447201668889759, 0.8944331542056199, 0 ),
						new Vector3( - 0.2684231751110917, 0.9631753839815436, - 0.01556209353802903 ),
						new Vector3( 0.3459273556592433, 0.53807011680075, 0.7686447905324219 )
					],
					normals: [
						new Vector3( - 0.18271617600817133, - 0.09135504253146765, - 0.9789121795283909 ),
						new Vector3( 0.046865035058597876, - 0.003078628350883253, - 0.9988964863970807 ),
						new Vector3( 0.8357929194629689, - 0.5489842348221077, 0.008155102228190641 )
					],
					tangents: [
						new Vector3( 0.8755715084258767, 0.4377711603816078, - 0.20428153311294514 ),
						new Vector3( 0.9621604167456884, 0.26885628454526284, 0.04431287294094243 ),
						new Vector3( - 0.4263618889888853, - 0.6396068005601663, 0.6396238584473043 )
					]
				};
				const frames = curve.computeFrenetFrames( 2, false );
				Object.keys( expected ).forEach( function ( group, i ) {
					expected[ group ].forEach( function ( vec, j ) {
						assert.numEqual( frames[ group ][ j ].x, vec.x, 'Frenet frames [' + i + ', ' + j + '].x correct' );
						assert.numEqual( frames[ group ][ j ].y, vec.y, 'Frenet frames [' + i + ', ' + j + '].y correct' );
						assert.numEqual( frames[ group ][ j ].z, vec.z, 'Frenet frames [' + i + ', ' + j + '].z correct' );
					} );
				} );
			} );
		} );
	} );
} );
