const config = require(process.env.WGSCHIRM_CONFIG);
const uuid = require('uuid/v1');
const http = require('http');
const Wgschirm = require('./Wgschirm');

const CHUNK_SIZE = 10000;
const MAX_CONNECTIONS = 20;

const wgschirm = new Wgschirm();
wgschirm.loadModules(config.modules);

http.createServer((req, res) => {
  if(Object.keys(wgschirm.connections).length >= MAX_CONNECTIONS){
    res.statusCode = 204;
    res.end();
    return;
  }

  let isAlive = true;
  res.wgschirm = {
    id: uuid(),
    time: new Date().getTime(),
  };

  res.on('close', () => {
    isAlive = false;
    wgschirm.removeConnection(res.wgschirm.id);
  });

  res.writeHead(200, {
    'Connection': 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'X-Accel-Buffering': 'no',
    'Access-Control-Allow-Origin': '*',
  });

  res.sse = (type, data, id) => {
    let msg = `id:${id || 0}\nevent:${type}\ndata:${data}\n\n`;
    let tries = 2;

    // for more info https://stackoverflow.com/questions/16995184/nodejs-what-does-socket-hang-up-actually-mean
    if(res.socket.destroyed){
      res.end();
      return false;
    }

    (function write() {
      if(!isAlive){
        return false;
      }

      const ok = res.write(msg.slice(0, CHUNK_SIZE));
      while(msg.length > 0 && ok){
        msg = msg.slice(CHUNK_SIZE);
      }

      if (msg.length > 0) {
        res.once('drain', () => {
          wgschirm.observedDrainEvent();
          write();
        });
      }
    })();
  }

  wgschirm.addConnection(res);
}).listen(config.server.port);
