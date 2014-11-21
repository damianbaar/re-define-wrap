var through = require('through2')
  , _ = require('lodash')
  , path = require('path')
  , acorn = require('acorn')
  , walk = require('acorn/util/walk')
  , resolve = _.partial(path.resolve, process.cwd())

module.exports = function(files) {
  var wrappers = _.values(files)

  files = _(files)
            .keys()
            .compact()
            .map(function(d) { return resolve(d) })
            .value()

  var stream = function(globalConfig, writer) {
    return through.obj(function(file, enc, next){
      if(!file.isAST()) {
        this.push(file)
        return next()
      }

      var idx = files.indexOf(file.path)

      if(idx > -1) {
        var wrapper = acorn.parse(wrappers[idx])

        walk.simple(wrapper, {
            FunctionExpression: function(node) {
              node.body.body = file.contents.body.concat(node.body.body)
            },
            FunctionDeclaration: function(node) {
              node.body.body = file.contents.body.concat(node.body.body)
            }
          })

        file.contents = wrapper
      }

      this.push(file)
      next()
    })
  }

  stream.order = 'after'

  return stream
}

