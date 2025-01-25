#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('./scheme');

const source = fs.readFileSync(path.join(__dirname, process.argv[2]), 'utf-8');
exec(source);
