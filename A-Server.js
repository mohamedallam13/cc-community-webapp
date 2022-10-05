const { Toolkit } = CCLIBRARIES;

function doGet(e) {
  const indexTemplate = HtmlService.createTemplateFromFile('index');
  return indexTemplate.evaluate();
}