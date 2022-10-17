; (function (root, factory) {
  root.MW = factory()
})(this, function () {

  function include(file, props = {}) {
    console.log(file)
    var template = HtmlService.createTemplateFromFile(file);
    Object.assign(template, props);
    return template.evaluate().getContent()
  }

  function render(file, props = {}, options = {}) {
    const { preventiFrameAll, favIcon, title, metaData } = options;
    const fileTemplate = HtmlService.createTemplateFromFile(file);
    Object.assign(fileTemplate, props);
    const HTMLOutput = fileTemplate.evaluate()
    if (!preventiFrameAll) HTMLOutput.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    console.log(favIcon)
    if (favIcon) HTMLOutput.setFaviconUrl(favIcon)
    if (title) HTMLOutput.setTitle(title)
    if (metaData) addMetaData(HTMLOutput, metaData)
    return HTMLOutput
  }

  function addMetaData(HTMLOutput, metaData) {
    metaData.forEach(metaTag => {
      const { name, content } = metaTag
      HTMLOutput.addMetaTag(name, content)
    })
  }

  function getGDriveImgById(id) {
    return `https://drive.google.com/uc?export=view&id=${id}`
  }

  function getGDriveImgByLink(link) {
    const [, idSide] = link.split('d/');
    const [id] = idSide.split('/')
    return getGDriveImgById(id)
  }

  return {
    include,
    render,
    getGDriveImgById,
    getGDriveImgByLink
  }
})

function inc(file, props = {}) {
  console.log(file)
  var template = HtmlService.createTemplateFromFile(file);
  Object.assign(template, props);
  return template.evaluate().getContent()
}
