#!/usr/bin/env node
'use strict'
const Ace = require('@adonisjs/ace')

// add commands as ES2015 classes
Ace.addCommand(require('../commands/create-mfe'))
Ace.addCommand(require('../commands/run-system-commands'))
//Ace.addCommand(require('../commands/run-tasks-parallel'))

// Boot ace to execute commands
Ace.wireUpWithCommander()
Ace.invoke()