const fs = require('fs');
module.exports = function (app) {
    fs.readdirSync('./app/prototype').forEach(function (file) {
      if (file.substr(-3, 3) === '.js' && file !== 'index.js') {
        require('./' + file.replace('.js', ''));
      }
    });
  };
  