import meowHelp from 'cli-meow-help'
import meow from 'meow'

const flags = {
	yesterday: {
		type: 'boolean',
		default: false,
		desc: 'Add an item to yesterday'
	},
	date: {
		type: 'string',
		default: '',
		desc: 'Specify a particular date to show/add to.'
	},
	clear: {
		type: `boolean`,
		default: false,
		alias: `c`,
		desc: `Clear the console`
	},
	noClear: {
		type: `boolean`,
		default: true,
		desc: `Don't clear the console`
	},
	debug: {
		type: `boolean`,
		default: false,
		alias: `d`,
		desc: `Print debug info`
	},
	version: {
		type: `boolean`,
		alias: `v`,
		desc: `Print CLI version`
	}
};

const commands = {
	help: { desc: `Print help info` },
	add: { desc: `Adds a new achievement` }
};

const helpText = meowHelp({
	name: `done`,
	flags,
	commands
});

const options = {
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

export default meow(helpText, options)
