#!/usr/bin/env node

/**
 * Done
 * Track your achievements throughout the day.
 *
 * @author Philip John <https://philipjohn.me.uk>
 */
import fs from 'fs'
import path from 'node:path'
import makeDir from 'make-dir'
import chalk from 'chalk'
import ordinal from 'ordinal-number-suffix'

// Database
const dbThings = path.join(process.cwd(), '/.things/things.json')
import { Low, JSONFile } from 'lowdb'

import init from './utils/init.js'
import cli from './utils/cli.js'
import log from './utils/log.js'

const input = cli.input
const flags = cli.flags
const { clear, debug } = flags;

(async () => {
	init({ clear })
	input.includes(`help`) && cli.showHelp(0)

	if ( ! fs.existsSync( dbThings ) ) {
		await makeDir( '.things' )
		process.chdir( '.things' )
		fs.writeFileSync( 'things.json', '{}' )
	}

	// Today.
	let yourDate = new Date()

	// Check for yesterday flag.
	if (flags.yesterday) {
		yourDate.setDate( yourDate.getDate() -1 )
	}

	// Check for a specific date.
	if (flags.date) {
		yourDate.setTime( Date.parse( flags.date ) )
	}

	const today = yourDate.toISOString().split('T')[0]

	// Set up the JSON DB.
	const adapter = new JSONFile(dbThings)
	const db = new Low(adapter)

	// Read data from JSON file, this will set db.data content
	await db.read()

	// Make sure we have an entry for today.
	if (!db.data.hasOwnProperty(today)) db.data[ today ] = [];

	// How many things have we done today?
	const done_count = db.data[ today ].length

	// Write db.data content to db.json
	await db.write()

	// No done items yet today.
	if ( input.length === 0 && db.data[ today ].length === 0 ) {
		console.log('Nothing done so far today.')
	}

	// Done some stuff!
	if ( input.length === 0 && db.data[ today ].length > 0 ) {
		console.log(chalk.bold.green(`Wow, look at what you've achieved today!\n`))
		console.log(`A total of ${chalk.bold.inverse(` ${done_count} `)} things. That's great work, well done.\n`)
		db.data[ today ].map( thing => console.log(`${chalk.green(' ✔ ')} ${thing}`) )
	}

	if (input.length !== 0) {
		db.data[ today ].push(input[ 0 ])
		db.write()
		console.log(`${ chalk.yellow(' + ') } Added "${ chalk.italic(input[ 0 ]) }" to the done list.\n`)
		console.log(`This is the ${ordinal(done_count+1)} thing you've done today, well done!`)
	}

	debug && log(flags)
})()
