; (function (root, factory) {
  root.MW = factory()
})(this, function () {

  function include(file, props = {}) {
    console.log(file)
    var template = HtmlService.createTemplateFromFile(file);
    Object.assign(template, props);
    return template.evaluate().getContent()
  }

  function render(file, props = {}) {
    const fileTemplate = HtmlService.createTemplateFromFile(file);
    Object.assign(fileTemplate, props);
    return fileTemplate.evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
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
