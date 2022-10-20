; (function (root, factory) {
    root.ROUTER = factory()
})(this, function () {

    const PATHS = {
        prendered: {
            filtering: {
                _activityDivisionEventId: {
                    protected: true,
                    controller: CONTROLLER.getActivityFilteringList
                }
            }
        }
    }

    const route = function (path, user) {
        const pathObj = getPathObj()
        if (!user && pathObj.protected) return CONTROLLER.getSignInPage()
        return pathObj.controller()
    }

    const getPathObj = function () {

    }

    return {
        route
    }
})