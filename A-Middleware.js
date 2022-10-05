function include(file, props) {
  console.log(props = {}, "Loading: " + file)
  var template = HtmlService.createTemplateFromFile(file);
  Object.assign(template, props);
  return template.evaluate().getContent()
}