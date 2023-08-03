import MagicString from 'magic-string';
import fs from 'fs';
import { EOL } from 'os';
function removeEmptyLines() {
	return {
		name: 'remove-empty-lines',
		writeBundle() {
			const file = './build/three.module.js';
			let content = fs.readFileSync(file, 'utf-8');
			// 删除空行
			const lines = content.split(EOL);
			const nonEmptyLines = lines.filter(line => line.trim() !== '');
			content = nonEmptyLines.join(EOL);
			// 重新写入文件
			fs.writeFileSync(file, content, 'utf-8');
		}
	};
}
function addons() {
	return {
		transform(code, id) {
			if (/\/examples\/jsm\//.test(id) === false) return;
			code = code.replace('build/three.module.js', 'src/Three.js');
			return {
				code: code,
				map: null
			};
		}
	};
}
export function glsl() {
	return {
		transform(code, id) {
			if (/\.glsl.js$/.test(id) === false) return;
			code.replace(/\/\* glsl \*\/\`(.*?)\`/sg, function (match, p1) {
				return JSON.stringify(
					p1
						.trim()
						.replace(/\r/g, '')
						.replace(/[ \t]*\/\/.*\n/g, '') // remove //
						.replace(/[ \t]*\/\*[\s\S]*?\*\//g, '') // remove /* */
						.replace(/\n{2,}/g, '\n') // # \n+ to \n
				);
			});
			return {
				code: code.toString(),
				map: null
			};
		}
	};
}
function header() {
	return {
		renderChunk(code) {
			code = new MagicString(code);
			code.prepend(`/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */\n` );
			return {
				code: code.toString(),
				map: null
			};
		}
	};
}
const builds = [
	{
		input: 'src/Three.js',
		plugins: [
			addons(),
			glsl(),
			header(),
			removeEmptyLines()
		],
		output: [
			{
				format: 'esm',
				file: 'build/three.module.js'
			}
		]
	},
];
export default (args) => args.configOnlyModule ? builds[0] : builds;
