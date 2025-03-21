import { Command } from '../Command.js';
/**
 * @param editor Editor
 * @param object THREE.Object3D
 * @param script javascript object
 * @param attributeName string
 * @param newValue string, object
 * @constructor
 */
class SetScriptValueCommand extends Command {
	constructor( editor, object, script, attributeName, newValue ) {
		super( editor );
		this.type = 'SetScriptValueCommand';
		this.name = `Set Script.${attributeName}`;
		this.updatable = true;
		this.object = object;
		this.script = script;
		this.attributeName = attributeName;
		this.oldValue = ( script !== undefined ) ? script[ this.attributeName ] : undefined;
		this.newValue = newValue;
	}
	execute() {
		this.script[ this.attributeName ] = this.newValue;
		this.editor.signals.scriptChanged.dispatch();
	}
	undo() {
		this.script[ this.attributeName ] = this.oldValue;
		this.editor.signals.scriptChanged.dispatch();
	}
	update( cmd ) {
		this.newValue = cmd.newValue;
	}
	toJSON() {
		const output = super.toJSON( this );
		output.objectUuid = this.object.uuid;
		output.index = this.editor.scripts[ this.object.uuid ].indexOf( this.script );
		output.attributeName = this.attributeName;
		output.oldValue = this.oldValue;
		output.newValue = this.newValue;
		return output;
	}
	fromJSON( json ) {
		super.fromJSON( json );
		this.oldValue = json.oldValue;
		this.newValue = json.newValue;
		this.attributeName = json.attributeName;
		this.object = this.editor.objectByUuid( json.objectUuid );
		this.script = this.editor.scripts[ json.objectUuid ][ json.index ];
	}
}
export { SetScriptValueCommand };
