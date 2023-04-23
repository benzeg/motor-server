const { SerialPortStream } = require('@serialport/stream')
const bindings = require('@serialport/bindings-cpp');
const arduinoPortPath = "/dev/ttyACM1";

const port = new SerialPortStream({path: arduinoPortPath, binding: bindings.autoDetect(), baudRate: 9600});

const control = {
  ready: false,
  write: (data) => {
    if (control.ready) {
      port.write(data);
    }
  }
};

port.on("open", () => {
  console.log("Port is open");
  control.ready = true;
})

port.on("error", (error) => {
  console.error(error);
})

module.exports = control;