const interval = 1000; // 200ms
const { EventEmitter } = require('node:events');
const util = require('util');
const fs = require('fs');
const unlink = util.promisify(fs.unlink);
const today = new Date();
const imagePath = `./images/${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${(today.getDate()).toString().padStart(2, '0')}`;

function Stream () {
  this.eventEmitter = new EventEmitter(); 

  this.run_state = false; 
  let loopFn;

  loopFn = async () => {
    const startTime = performance.now();
    try {
      const files = fs.readdirSync(imagePath);
      
      if (files.length) {
        files.sort((a,b) => {
          return fs.statSync(`${imagePath}/${a}`).mtimeMs - fs.statSync(`${imagePath}/${b}`).mtimeMs;
        });
        await new Promise(resolve => setTimeout(resolve, 400));
        const imageFile = fs.readFileSync(`${imagePath}/${files[0]}`);
        await Promise.all(files.map(filename => unlink(`${imagePath}/${filename}`)));
        this.eventEmitter.emit(
          "event",
          imageFile
        );
      }

    } catch (err) {
      console.error(err);
    }

    if (!this.run_state) {
      return;
    }
    const elapsed = performance.now() - startTime;

    if (elapsed >= interval) {
      return loopFn();
    }

    const timeout = Math.floor(interval - elapsed);
    console.log(timeout)
    setTimeout(loopFn, timeout);
  }

  this.cleanup = function() {
    this.run_state = false;
  }

  this.start = function() {
    if (this.run_state) return;

    this.run_state = true;

    if (!fs.existsSync(imagePath)){
      fs.mkdirSync(imagePath);
    }

    loopFn();
  }
}

module.exports = Stream;