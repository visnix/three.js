import { ColorInput, SliderInput, LabelElement } from 'flow';
import { MaterialEditor } from './MaterialEditor.js';
import { MeshStandardNodeMaterial } from 'three/nodes';
export class StandardMaterialEditor extends MaterialEditor {
	constructor() {
		const material = new MeshStandardNodeMaterial();
		super( 'Standard Material', material );
		const color = new LabelElement( 'color' ).setInput( 3 );
		const opacity = new LabelElement( 'opacity' ).setInput( 1 );
		const metalness = new LabelElement( 'metalness' ).setInput( 1 );
		const roughness = new LabelElement( 'roughness' ).setInput( 1 );
		const emissive = new LabelElement( 'emissive' ).setInput( 3 );
		const normal = new LabelElement( 'normal' ).setInput( 3 );
		const position = new LabelElement( 'position' ).setInput( 3 );
		color.add( new ColorInput( material.color.getHex() ).onChange( ( input ) => {
			material.color.setHex( input.getValue() );
		} ) );
		opacity.add( new SliderInput( material.opacity, 0, 1 ).onChange( ( input ) => {
			material.opacity = input.getValue();
			this.updateTransparent();
		} ) );
		metalness.add( new SliderInput( material.metalness, 0, 1 ).onChange( ( input ) => {
			material.metalness = input.getValue();
		} ) );
		roughness.add( new SliderInput( material.roughness, 0, 1 ).onChange( ( input ) => {
			material.roughness = input.getValue();
		} ) );
		color.onConnect( () => this.update(), true );
		opacity.onConnect( () => this.update(), true );
		metalness.onConnect( () => this.update(), true );
		roughness.onConnect( () => this.update(), true );
		emissive.onConnect( () => this.update(), true );
		normal.onConnect( () => this.update(), true );
		position.onConnect( () => this.update(), true );
		this.add( color )
			.add( opacity )
			.add( metalness )
			.add( roughness )
			.add( emissive )
			.add( normal )
			.add( position );
		this.color = color;
		this.opacity = opacity;
		this.metalness = metalness;
		this.roughness = roughness;
		this.emissive = emissive;
		this.normal = normal;
		this.position = position;
		this.update();
	}
	update() {
		const { material, color, opacity, emissive, roughness, metalness, normal, position } = this;
		color.setEnabledInputs( ! color.getLinkedObject() );
		opacity.setEnabledInputs( ! opacity.getLinkedObject() );
		roughness.setEnabledInputs( ! roughness.getLinkedObject() );
		metalness.setEnabledInputs( ! metalness.getLinkedObject() );
		material.colorNode = color.getLinkedObject();
		material.opacityNode = opacity.getLinkedObject();
		material.metalnessNode = metalness.getLinkedObject();
		material.roughnessNode = roughness.getLinkedObject();
		material.emissiveNode = emissive.getLinkedObject();
		material.normalNode = normal.getLinkedObject();
		material.positionNode = position.getLinkedObject();
		material.dispose();
		this.updateTransparent();
	}
	updateTransparent() {
		const { material, opacity } = this;
		const transparent = opacity.getLinkedObject() || material.opacity < 1 ? true : false;
		const needsUpdate = transparent !== material.transparent;
		material.transparent = transparent;
		opacity.setIcon( material.transparent ? 'ti ti-layers-intersect' : 'ti ti-layers-subtract' );
		if ( needsUpdate === true ) material.dispose();
	}
}
