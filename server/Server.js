var app   = new Gexpress.App()

app.get( /.*/, function(req,res,next){ // default to homepage
  res.set('content-type','text/html')
  res.send( MW.render('client/index').getContent() )
  res.end()
})

// this hooks Gexpress into appscript 
function doGet(e) { return app.doGet(e)  }
function doPost(e){ return app.doPost(e) }