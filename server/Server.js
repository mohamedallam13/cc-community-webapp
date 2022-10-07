const { Toolkit } = CCLIBRARIES
const { readFromJSON, writeToJSON } = Toolkit

var app = new Gexpress.App()

// app.get(/.*/, function (req, res, next) { // default to homepage
//   res.set('content-type', 'text/html')
//   res.send(MW.render('client/index', { routedPage: "client/test", props: { name: "Mohamed" } }).getContent())
//   res.end()
// })

app.get(/.*/, function (req, res, next) { // should be routed to filtering page
  const entriesId = '1q53NgdwJg68num_cp797D_5greDv4w2v'
  const entriesArray = readFromJSON(entriesId)
  const filteringPath = 'client/pages/HumanManager/Filtering/filtering'
  console.log(entriesArray)
  res.set('content-type', 'text/html')
  res.send(MW.render('client/index', { routedPage: filteringPath, props: { entriesArray } }).getContent())
  res.end()
})

// this hooks Gexpress into appscript 
function doGet(e) { return app.doGet(e) }
function doPost(e) { return app.doPost(e) }