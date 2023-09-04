#!/usr/bin/env node
'use strict'
const Ace = require('@adonisjs/ace')

// add commands as ES2015 classes
Ace.addCommand(require('../commands/create-mfe'))
Ace.addCommand(require('../commands/run-system-commands'))

// Boot ace to execute commands
Ace.wireUpWithCommander()
Ace.invoke()