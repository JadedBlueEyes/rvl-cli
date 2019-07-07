#!/usr/bin/env node

var program = require('commander');
program
  .version('0.1.0')
  .usage('[options] <file>')
  .option("-w, --watch", "Watch the files for changes.")
  .option("-o, --out [file]", "Output file.")
  .option('-v, --verbose', 'What the program logs.\n'
    + '0 - error, 1 - warning, 2 - info, 3 - debug', function increaseVerbosity (v, total) {
      return total + 1;
    }, 0)
  .parse(process.argv);

const log = require('fancy-log-levels');

const verbosity = program.verbose;
log(verbosity);
log.info("Parsed args.")
log.debug("verbosity is: " + verbosity)
const watch = !!program.watch;
const file = program.args[0];
const out = program.out || file.substr(0, file.lastIndexOf(".")) + ".html";;
log.debug("Watch: " + watch)
log.debug("File: " + file)
log.debug("Out: " + out)
if (!file) {
  log.error("File was not passed! You must pass a file!")
  log.info("Exiting program...")
  process.exit()
}
let opts = {
  watch,
  out
}
if (!watch) {
  log.info("Starting generation...")
  require("./rvl")(file, opts, log, !watch)
  log.info("Done generation!")
} else {
  // livereload
  var livereload = require('livereload');
  var fs = require('fs');
  const rvl = require("./rvl")
  rvl(file, opts, log, !watch, "<script>document.write('<script src=\"http://' + (location.host || 'localhost').split(':')[0] +':35729/livereload.js?snipver=1\"></' + 'script>')</script>")
  fs.watch(file.toString(), (eventType) => {
    if (eventType === "change") rvl(file, opts, log, !watch, "<script>document.write('<script src=\"http://' + (location.host || 'localhost').split(':')[0] +':35729/livereload.js?snipver=1\"></' + 'script>')</script>")
  })

  var server = livereload.createServer({
  });
  server.watch(opts.out);
}
