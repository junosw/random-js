const sharp = require('sharp')

sharp('/Users/joeteibel/tmp/tiny.png')
  .background({r: 206, g: 206, b: 206, alpha: 1})
  .extend({top: 1, bottom: 1, left: 1, right: 1})
  .toFile('/Users/joeteibel/tmp/woot.png', function(err, data) {
    if (err) {
      console.error(err) 
    } else {
      console.log(data)
    }
  })