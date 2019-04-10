const Path = require('path');
module.exports = {
  plugins: [
  
    require('postcss-sprites')({
      // enable/disable retina mark parser
      retina: true,
      relativeTo: 'file',
      spritePath: process.env.BOI_ENV === 'dev'?'dest/assets':'.tmp',
      spritesmith: {
        padding: 5,
      },
      groupBy: image => {
        let groupName = undefined;

        if (true) {
          groupName = Path.basename(Path.dirname(image.url));
        } else {
          groupName = 'icons';
        }
        if (true) {
          image.retina = true;
          image.ratio = 1;
          let ratio = /@(\d+)x\.(png|jpg|gif|jpeg)/i.exec(image.url);
          if (ratio) {
            ratio = ratio[1];
            while (ratio > 10) {
              ratio = ratio / 10;
            }
            image.ratio = ratio;
            image.groups = image.groups.filter((group) => {
              return ('@' + ratio + 'x') !== group;
            });
            groupName += '@' + ratio + 'x';
          }
        }
        return Promise.resolve(groupName);
      },
      filterBy: image => {
        if (!/icons/i.test(image.url)) {
          return Promise.reject();
        }
        return Promise.resolve();
      },
      hooks: {
        // rename sprites file's name
        onSaveSpritesheet: (opts, spritesheet) => {
          const FilenameChunks = spritesheet.groups.concat(spritesheet.extension);
          return Path.posix.join(opts.spritePath, FilenameChunks.join('.'));
        },
        // inject background-position/background-image/size
        onUpdateRule: (rule, token, image) => {
          ['width', 'height'].forEach(prop => {
            rule.insertAfter(rule.last, require('postcss').decl({
              prop: prop,
              value: image.coords[prop] + 'px'
            }));
          });
          require('postcss-sprites/lib/core').updateRule(rule, token, image);
        }
      }
    })
  
  ]
}
