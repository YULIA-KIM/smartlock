var SSH = require('simple-ssh');

var ssh = new SSH({
   host: '211.253.11.159',
   user: 'root',
   pass: 'emforhsc'
});

ssh.on('error', function(err) {
    console.log('Oops, something went wrong.');
    console.log(err);
    ssh.end();
}).exec('cd /root/share/SmartLock && git pull origin master && npm install && npm build', {
   out: function(stdout) {
       console.log(stdout);
   }
}).start();