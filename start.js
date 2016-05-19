var app         = require('connect')()
var serveStatic = require('serve-static')

app.use(serveStatic('app'))

console.log(' ➜   Open: http://localhost:6660')
app.listen(6660)