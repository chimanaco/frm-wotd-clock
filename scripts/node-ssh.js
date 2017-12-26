var path, node_ssh, ssh, fs

fs = require('fs')
path = require('path')
node_ssh = require('node-ssh')
const credential = require('../credential');

ssh = new node_ssh()

ssh.connect({
  host: credential.host,
  username: credential.username,
  port: credential.port,
  privateKey: credential.privateKey,
  passphrase: credential.passphrase
}).then(function() {
    // Putting entire directories
    const failed = []
    const successful = []
    ssh.putDirectory(credential.localDir, credential.remoteDir, {
      recursive: true,
      concurrency: 10,
      validate: function(itemPath) {
        const baseName = path.basename(itemPath)
        return baseName.substr(0, 1) !== '.' && // do not allow dot files
          baseName !== 'node_modules' // do not allow node_modules
      },
      tick: function(localPath, remotePath, error) {
        if (error) {
          failed.push(localPath)
          console.log(error)
        } else {
          successful.push(localPath)
          console.log('Uploaded:', localPath)
        }
      }
    }).then(function(status) {
      console.log('the directory transfer was', status ? 'successful' : 'unsuccessful')
      console.log('failed transfers', failed.join(', '))
      console.log('successful transfers', successful.join(', '))
      // close connection
      ssh.dispose();
    })
  })
