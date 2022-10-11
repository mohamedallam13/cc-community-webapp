; (function (root, factory) {
    root.HELPERS = factory()
})(this, function () {

    function getWhatsappLink(number) {
        return `https://wa.me/${number}`
    }

    function getEmailLink(email) {
        return `mailto:${email}`
    }

    return {
        getWhatsappLink,
        getEmailLink
    }
})