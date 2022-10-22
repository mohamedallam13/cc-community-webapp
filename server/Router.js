; (function (root, factory) {
    root.ROUTER = factory()
})(this, function () {

    const PATHS = {
        children: {
            app: {
                children: {
                    admin: {
                        protected: true,
                        protectionReroute: CONTROLLER.getSignInPage,
                        children: {
                            filtering: {
                                children: {
                                    _activityDivisionEventId: {
                                        protected: true,
                                        params: null,
                                        controller: CONTROLLER.getActivityFilteringList
                                    }
                                },

                            },
                            prerendered: {
                                children: {
                                    _path: {
                                        controller: CONTROLLER.getPrerenderedPaths
                                    }
                                }
                            }
                        }
                    },
                    magicLink: {
                        children: {
                            getLink: {
                                controller: CONTROLLER.getMagicLink
                            },
                            verfiyLink: {
                                controller: CONTROLLER.verifyMagicLink
                            }
                        }
                    }
                },
                defaultPath: {
                    controller: CONTROLLER.renderNotFound
                }
            },
            api: {
                children: {
                    prerenders: {
                        children: {
                            create: {
                                controller: CONTROLLER.createPrerenders
                            }
                        }
                    }
                },
                defaultPath: {
                    controller: null
                }
            },
            test:{
                
            },
            defaultPath: {
                controller: CONTROLLER.renderApp
            }
        }
    }

    const route = function (path = "", query, params) {
        const pathArr = path.split("/") || [];
        const pathObj = getPathObj(pathArr, query, params)
        return executePath(pathObj);
    }

    const getPathObj = function (pathArr, query, params, currentNode = PATHS) {
        if (pathArr.length == 0) return { query, params, pathObj: currentNode.children.defaultPath };
        let protected = false;
        for (const node of pathArr) {
            nextNode = currentNode.children?.[node];
            protected = currentNode.protected
            if (protected) {
                params.protected = currentNode.protectionReroute;
            }
            if (!nextNode) {
                const pathVariable = findPathVariable(currentNode);
                if (!pathVariable) return { query, params, pathObj: currentNode.children.defaultPath };
                else {
                    params = { ...params, [pathVariable]: node }
                    currentNode = nextNode;
                }
            } else {
                currentNode = nextNode;
            }
        }
        return { query, params, pathObj: currentNode.children.defaultPath };
    }

    const findPathVariable = function (currentNode) {
        const firstVariable = Object.keys(currentNode.children).find(value => /^_/.test(value));
        return firstVariable;
    }

    const executePath = function (query, params, pathObj) {
        const req = { query, params }
        const res = { code: 400, success: false }
        let callBack;
        if (!pathObj.controller) callBack = CONTROLLER.getHome
        else if (params.protected && !params.session.user) callBack = params.protected;
        else callBack = pathObj.controller;
        return callBack(req, res);
    }

    return {
        route
    }
})