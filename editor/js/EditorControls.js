import * as THREE from 'three';
class EditorControls extends THREE.EventDispatcher {
	constructor( object, domElement ) {
		super();
		// API
		this.enabled = true;
		this.center = new THREE.Vector3();
		this.panSpeed = 0.002;
		this.zoomSpeed = 0.1;
		this.rotationSpeed = 0.005;
		// internals
		var scope = this;
		var vector = new THREE.Vector3();
		var delta = new THREE.Vector3();
		var box = new THREE.Box3();
		var STATE = { NONE: - 1, ROTATE: 0, ZOOM: 1, PAN: 2 };
		var state = STATE.NONE;
		var center = this.center;
		var normalMatrix = new THREE.Matrix3();
		var pointer = new THREE.Vector2();
		var pointerOld = new THREE.Vector2();
		var spherical = new THREE.Spherical();
		var sphere = new THREE.Sphere();
		// events
		var changeEvent = { type: 'change' };
		this.focus = function ( target ) {
			var distance;
			box.setFromObject( target );
			if ( box.isEmpty() === false ) {
				box.getCenter( center );
				distance = box.getBoundingSphere( sphere ).radius;
			} else {
				// Focusing on an Group, AmbientLight, etc
				center.setFromMatrixPosition( target.matrixWorld );
				distance = 0.1;
			}
			delta.set( 0, 0, 1 );
			delta.applyQuaternion( object.quaternion );
			delta.multiplyScalar( distance * 4 );
			object.position.copy( center ).add( delta );
			scope.dispatchEvent( changeEvent );
		};
		this.pan = function ( delta ) {
			var distance = object.position.distanceTo( center );
			delta.multiplyScalar( distance * scope.panSpeed );
			delta.applyMatrix3( normalMatrix.getNormalMatrix( object.matrix ) );
			object.position.add( delta );
			center.add( delta );
			scope.dispatchEvent( changeEvent );
		};
		this.zoom = function ( delta ) {
			var distance = object.position.distanceTo( center );
			delta.multiplyScalar( distance * scope.zoomSpeed );
			if ( delta.length() > distance ) return;
			delta.applyMatrix3( normalMatrix.getNormalMatrix( object.matrix ) );
			object.position.add( delta );
			scope.dispatchEvent( changeEvent );
		};
		this.rotate = function ( delta ) {
			vector.copy( object.position ).sub( center );
			spherical.setFromVector3( vector );
			spherical.theta += delta.x * scope.rotationSpeed;
			spherical.phi += delta.y * scope.rotationSpeed;
			spherical.makeSafe();
			vector.setFromSpherical( spherical );
			object.position.copy( center ).add( vector );
			object.lookAt( center );
			scope.dispatchEvent( changeEvent );
		};
		//
		function onPointerDown( event ) {
			if ( scope.enabled === false ) return;
			switch ( event.pointerType ) {
				case 'mouse':
				case 'pen':
					onMouseDown( event );
					break;
				// TODO touch
			}
			domElement.ownerDocument.addEventListener( 'pointermove', onPointerMove );
			domElement.ownerDocument.addEventListener( 'pointerup', onPointerUp );
		}
		function onPointerMove( event ) {
			if ( scope.enabled === false ) return;
			switch ( event.pointerType ) {
				case 'mouse':
				case 'pen':
					onMouseMove( event );
					break;
				// TODO touch
			}
		}
		function onPointerUp( event ) {
			switch ( event.pointerType ) {
				case 'mouse':
				case 'pen':
					onMouseUp();
					break;
				// TODO touch
			}
			domElement.ownerDocument.removeEventListener( 'pointermove', onPointerMove );
			domElement.ownerDocument.removeEventListener( 'pointerup', onPointerUp );
		}
		// mouse
		function onMouseDown( event ) {
			if ( event.button === 0 ) {
				state = STATE.ROTATE;
			} else if ( event.button === 1 ) {
				state = STATE.ZOOM;
			} else if ( event.button === 2 ) {
				state = STATE.PAN;
			}
			pointerOld.set( event.clientX, event.clientY );
		}
		function onMouseMove( event ) {
			pointer.set( event.clientX, event.clientY );
			var movementX = pointer.x - pointerOld.x;
			var movementY = pointer.y - pointerOld.y;
			if ( state === STATE.ROTATE ) {
				scope.rotate( delta.set( - movementX, - movementY, 0 ) );
			} else if ( state === STATE.ZOOM ) {
				scope.zoom( delta.set( 0, 0, movementY ) );
			} else if ( state === STATE.PAN ) {
				scope.pan( delta.set( - movementX, movementY, 0 ) );
			}
			pointerOld.set( event.clientX, event.clientY );
		}
		function onMouseUp() {
			state = STATE.NONE;
		}
		function onMouseWheel( event ) {
			if ( scope.enabled === false ) return;
			event.preventDefault();
			// Normalize deltaY due to https://bugzilla.mozilla.org/show_bug.cgi?id=1392460
			scope.zoom( delta.set( 0, 0, event.deltaY > 0 ? 1 : - 1 ) );
		}
		function contextmenu( event ) {
			event.preventDefault();
		}
		this.dispose = function () {
			domElement.removeEventListener( 'contextmenu', contextmenu );
			domElement.removeEventListener( 'dblclick', onMouseUp );
			domElement.removeEventListener( 'wheel', onMouseWheel );
			domElement.removeEventListener( 'pointerdown', onPointerDown );
			domElement.removeEventListener( 'touchstart', touchStart );
			domElement.removeEventListener( 'touchmove', touchMove );
		};
		domElement.addEventListener( 'contextmenu', contextmenu );
		domElement.addEventListener( 'dblclick', onMouseUp );
		domElement.addEventListener( 'wheel', onMouseWheel, { passive: false } );
		domElement.addEventListener( 'pointerdown', onPointerDown );
		// touch
		var touches = [ new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3() ];
		var prevTouches = [ new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3() ];
		var prevDistance = null;
		function touchStart( event ) {
			if ( scope.enabled === false ) return;
			switch ( event.touches.length ) {
				case 1:
					touches[ 0 ].set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, 0 ).divideScalar( window.devicePixelRatio );
					touches[ 1 ].set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, 0 ).divideScalar( window.devicePixelRatio );
					break;
				case 2:
					touches[ 0 ].set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, 0 ).divideScalar( window.devicePixelRatio );
					touches[ 1 ].set( event.touches[ 1 ].pageX, event.touches[ 1 ].pageY, 0 ).divideScalar( window.devicePixelRatio );
					prevDistance = touches[ 0 ].distanceTo( touches[ 1 ] );
					break;
			}
			prevTouches[ 0 ].copy( touches[ 0 ] );
			prevTouches[ 1 ].copy( touches[ 1 ] );
		}
		function touchMove( event ) {
			if ( scope.enabled === false ) return;
			event.preventDefault();
			event.stopPropagation();
			function getClosest( touch, touches ) {
				var closest = touches[ 0 ];
				for ( var touch2 of touches ) {
					if ( closest.distanceTo( touch ) > touch2.distanceTo( touch ) ) closest = touch2;
				}
				return closest;
			}
			switch ( event.touches.length ) {
				case 1:
					touches[ 0 ].set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, 0 ).divideScalar( window.devicePixelRatio );
					touches[ 1 ].set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, 0 ).divideScalar( window.devicePixelRatio );
					scope.rotate( touches[ 0 ].sub( getClosest( touches[ 0 ], prevTouches ) ).multiplyScalar( - 1 ) );
					break;
				case 2:
					touches[ 0 ].set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, 0 ).divideScalar( window.devicePixelRatio );
					touches[ 1 ].set( event.touches[ 1 ].pageX, event.touches[ 1 ].pageY, 0 ).divideScalar( window.devicePixelRatio );
					var distance = touches[ 0 ].distanceTo( touches[ 1 ] );
					scope.zoom( delta.set( 0, 0, prevDistance - distance ) );
					prevDistance = distance;
					var offset0 = touches[ 0 ].clone().sub( getClosest( touches[ 0 ], prevTouches ) );
					var offset1 = touches[ 1 ].clone().sub( getClosest( touches[ 1 ], prevTouches ) );
					offset0.x = - offset0.x;
					offset1.x = - offset1.x;
					scope.pan( offset0.add( offset1 ) );
					break;
			}
			prevTouches[ 0 ].copy( touches[ 0 ] );
			prevTouches[ 1 ].copy( touches[ 1 ] );
		}
		domElement.addEventListener( 'touchstart', touchStart, { passive: false } );
		domElement.addEventListener( 'touchmove', touchMove, { passive: false } );
	}
}
export { EditorControls };
