import { Camera } from './Camera.js';
class OrthographicCamera extends Camera {
	constructor( left = - 1, right = 1, top = 1, bottom = - 1, near = 0.1, far = 2000 ) {
		super();
		this.isOrthographicCamera = true;
		this.type = 'OrthographicCamera';
		this.zoom = 1;
		this.view = null;
		this.left = left;
		this.right = right;
		this.top = top;
		this.bottom = bottom;
		this.near = near;
		this.far = far;
		this.updateProjectionMatrix();
	}
	copy( source, recursive ) {
		super.copy( source, recursive );
		this.left = source.left;
		this.right = source.right;
		this.top = source.top;
		this.bottom = source.bottom;
		this.near = source.near;
		this.far = source.far;
		this.zoom = source.zoom;
		this.view = source.view === null ? null : Object.assign( {}, source.view );
		return this;
	}
	setViewOffset( fullWidth, fullHeight, x, y, width, height ) {
		if ( this.view === null ) {
			this.view = {
				enabled: true,
				fullWidth: 1,
				fullHeight: 1,
				offsetX: 0,
				offsetY: 0,
				width: 1,
				height: 1
			};
		}
		this.view.enabled = true;
		this.view.fullWidth = fullWidth;
		this.view.fullHeight = fullHeight;
		this.view.offsetX = x;
		this.view.offsetY = y;
		this.view.width = width;
		this.view.height = height;
		this.updateProjectionMatrix();
	}
	clearViewOffset() {
		if ( this.view !== null ) {
			this.view.enabled = false;
		}
		this.updateProjectionMatrix();
	}
	updateProjectionMatrix() {
		const dx = ( this.right - this.left ) / ( 2 * this.zoom );
		const dy = ( this.top - this.bottom ) / ( 2 * this.zoom );
		const cx = ( this.right + this.left ) / 2;
		const cy = ( this.top + this.bottom ) / 2;
		let left = cx - dx;
		let right = cx + dx;
		let top = cy + dy;
		let bottom = cy - dy;
		if ( this.view !== null && this.view.enabled ) {
			const scaleW = ( this.right - this.left ) / this.view.fullWidth / this.zoom;
			const scaleH = ( this.top - this.bottom ) / this.view.fullHeight / this.zoom;
			left += scaleW * this.view.offsetX;
			right = left + scaleW * this.view.width;
			top -= scaleH * this.view.offsetY;
			bottom = top - scaleH * this.view.height;
		}
		this.projectionMatrix.makeOrthographic( left, right, top, bottom, this.near, this.far, this.coordinateSystem );
		this.projectionMatrixInverse.copy( this.projectionMatrix ).invert();
	}
	toJSON( meta ) {
		const data = super.toJSON( meta );
		data.object.zoom = this.zoom;
		data.object.left = this.left;
		data.object.right = this.right;
		data.object.top = this.top;
		data.object.bottom = this.bottom;
		data.object.near = this.near;
		data.object.far = this.far;
		if ( this.view !== null ) data.object.view = Object.assign( {}, this.view );
		return data;
	}
}
export { OrthographicCamera };
