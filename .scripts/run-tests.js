'use strict';

const spawn = require('child_process').spawn;
const path = require('path');

let demoAppProcesses = [];
let testProcesses = [];
let demoAppProcessesOutput = '';

const DEMO_DIR = path.join(__dirname, '../demo');
const PROJECT_DIR = path.join(__dirname, './../');
const PROJECT_PARENT_DIR = path.join(__dirname, './../../');    // for METEOR_PACAKGE_DIRS to find our package in the demo app
const FIRST_DEMO_APP_PORT = 3005;
const SECOND_DEMO_APP_PORT = 3007;
const TIMEOUT = (1000 * 60) * 5;

start();

function log(msg) {
  console.log(`--------- ${msg} ---------`);
}

function startProcess (cmd, args, opts, processCollector) {
  args = args || [];
  opts = opts || {};
  opts.env = opts.env || {};
  for(var thisKey in process.env) {
    opts.env[thisKey] = process.env[thisKey];
  }
  opts.env.METEOR_PACKAGE_DIRS = PROJECT_PARENT_DIR;
  opts.env.NODE_ENV = 'test';
  let fullCommandString = cmd;
  args.forEach((a) => {
    fullCommandString += ' ' + a;
  });
  console.log(`(running: ${fullCommandString})`);
  const newProcess = spawn(cmd, args, opts);
  processCollector.push(newProcess);

  function handleProcessOutput (data) {
    const output = data.toString();
    if (processCollector === demoAppProcesses) {
      handleDemoAppProcessOutput(output);
    } else {
      if (output.length > 1) {
        console.log(output);
      }
    }
  }

  newProcess.stdout.on('data', function(data) {
    handleProcessOutput(data);
  });
  newProcess.stderr.on('data', function(data) {
    handleProcessOutput(data);
  });

  return newProcess;
}

function start () {
  log(`Starting demo apps on localhost:${FIRST_DEMO_APP_PORT}, localhost:${SECOND_DEMO_APP_PORT}`);
  startFirstDemoApp();
}

function startDemoApp (port, opts) {
  opts = opts || {};
  opts.cwd = DEMO_DIR;
  startProcess('meteor',['--port', port], opts, demoAppProcesses);
}

function startFirstDemoApp () {
  startDemoApp(FIRST_DEMO_APP_PORT);
}
function startSecondDemoApp () {
  startDemoApp(SECOND_DEMO_APP_PORT, { env: { 'MONGO_URL': 'mongodb://localhost:3006/meteor' }});
  log('Demo apps started');
  setTimeout(() => {
    startChimpTests();
  }, 5000);
}

function handleDemoAppProcessOutput (output) {
  demoAppProcessesOutput += output;

  // only log demo app server output until both apps are started
  if (demoAppProcesses.length === 1) {
    console.log(output);
    if (demoAppProcessesOutput.indexOf('ProseMeteor server started.') !== -1) {
      startSecondDemoApp();
    }
  }
}

function startChimpTests () {
  const chimpBin = path.join(__dirname, './../node_modules/chimp/bin/chimp.js') ;
  const chimpProcess = startProcess(chimpBin,
   ['--ddp', `http://localhost:${FIRST_DEMO_APP_PORT}`, '--ddp', `http://localhost:${SECOND_DEMO_APP_PORT}`,'--mocha','--path', 'tests'],
   {
     cwd: PROJECT_DIR,
     env: { CUCUMBER_BROWSERS: 2 }
   },
   testProcesses
  );
  log('Starting Chimp tests');
  chimpProcess.on('exit', (code) => {
    killDemoApps();
    console.log('Exiting ', code);
    process.exit(code);
  })
}

function killDemoApps () {
  log('Tests complete, killing demo apps');
  demoAppProcesses.forEach(function(thisProcess, i) {
    thisProcess.stdin.pause();
    thisProcess.kill();
  });
}

setTimeout(function() {
  killDemoApps();
}, TIMEOUT);