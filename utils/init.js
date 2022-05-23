import welcome from 'cli-welcome'
import unhandled from 'cli-handle-unhandled'

import { createRequire } from "module"
const require = createRequire(import.meta.url)
const pkg = require("../package.json")

export default ({ clear = false }) => {
	unhandled();
	welcome({
		title: `Done`,
		tagLine: `by Philip John`,
		description: pkg.description,
		version: pkg.version,
		bgColor: '#36BB09',
		color: '#000000',
		bold: true,
		clear
	});
};
