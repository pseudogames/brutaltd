var app         = require('connect')()
var serveStatic = require('serve-static')

app.use(serveStatic('app'))

console.log(' ➜   Open: http://localhost:8080')
app.listen(8080)