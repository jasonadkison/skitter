var Docker = require('dockerode');
var docker = new Docker({ socketPath: '/var/run/docker.sock' });

module.exports.runScraper = async () => {
  docker.run('skitter/worker', ['bash', '-c', 'uname -a'], process.stdout).then(function(data) {
    var output = data[0];
    var container = data[1];
    console.log(output.StatusCode);
    return container.remove();
  }).then(function(data) {
    console.log('container removed');
  }).catch(function(err) {
    console.log(err);
  });
};
