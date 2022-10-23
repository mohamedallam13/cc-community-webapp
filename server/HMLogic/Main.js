; (function (root, factory) {
    root.HUMAN_MANAGER = factory()
})(this, function () {

    const { Toolkit, _, REFERENCES_MANAGER } = CCLIBRARIES
    const { readFromJSON, writeToJSON, keyBy } = Toolkit
    const REQUIRED_REFERENCES = ["divisionsProperties", "deployedScripts"];
    const MASTER_FILE_INDEX = "1ohC9kPnMxyptp8SadRBGAofibGiYTTev"

    // let CCAPPLICATIONSBACKEND

    let referencesObj
    let configs

    const getReferences = function () {
        getRequiredIndexes();
        // getRequiredScripts();
    }

    function getRequiredIndexes() {
        referencesObj = REFERENCES_MANAGER.init(MASTER_FILE_INDEX).requireFiles(REQUIRED_REFERENCES).requiredFiles;
    }

    // function getRequiredScripts() {
    //     const ccApplicationsBackend = referencesObj.deployedScripts.fileContent.CCAPPLICATIONSBACKEND;
    //     CCAPPLICATIONSBACKEND = modulesRequire(ccApplicationsBackend);
    // }

    function getConfigs({ divisionId, divisionType }) {
        configs = referencesObj.divisionsProperties.fileContent[divisionType][divisionId];
    }

    function getAllMappedEntries({ allEntries, eventId, divisionId, divisionType }) {
        getReferences();
        getConfigs({ divisionId, divisionType })
        if (!allEntries) allEntries = getAllEntries({ eventId, divisionId })
        const mappedData = getMappedData(allEntries);
        return mappedData;
    }

    function getAllEntries({ eventId, divisionId }) {
        const response = APPLICATIONSBACKEND.handleRequest({ path: "getAllFullApplications", eventId, divisionId })
        if (!response) return []
        const { data } = response;
        return data;
    }

    function getEntry(request) {
        getReferences();
        const response = APPLICATIONSBACKEND.handleRequest(request)
        console.log(response.data)
        // const response = GSCRIPT_ROUTER.route(request)
        if (response.sourceError || response.fetchError) {
            console.log(response.sourceError);
            console.log(response.fetchError);
            return
        }
        return response
    }

    function getMappedData(data) {
        const { filteringMap } = configs;
        const mappedData = data.map(entry => {
            const mappedDataObj = {}
            replaceValue(filteringMap, entry, mappedDataObj)
            augmnentData(mappedDataObj, entry)
            return mappedDataObj
        })
        return mappedData
    }

    function augmnentData(mappedDataObj, entry) {
        mappedDataObj.userId = entry.ccer.id;
        mappedDataObj.comments = entry.applicationComments;
        mappedDataObj.stage = entry.currentStage;
    }

    function replaceValue(obj, entry, mappedDataObj) {
        if (Array.isArray(obj)) {
            return obj.map(element => {
                return replaceValue(element, entry, {})
            })
        } else if (typeof obj == 'object') {
            if (obj.hasOwnProperty("value")) {
                let { value } = obj;
                value = getValueFromEntry(value, entry)
                return { ...obj, value }
            } else {
                Object.entries(obj).forEach(([key, subObj]) => {
                    mappedDataObj[key] = replaceValue(subObj, entry, {})

                })
                return mappedDataObj;
            }
        } else {
            return obj
        }

    }

    function getValueFromEntry(value, entry) {
        const path = value.split(".");
        let returnValue
        path.forEach(param => {
            returnValue = returnValue ? returnValue[param] : entry[param]
            if (Array.isArray(returnValue)) {
                returnValue = returnValue[0]
            }
        })
        return returnValue || ""
    }

    function addComment({ userId, comment }) {
        const commentPath = 'client/components/Comment/Comment'
        const timestamp = new Date();
        addToDB({ userId, commentObj: { comment, timestamp } })
        const commentHTML = _I(commentPath, { userId, comment, timestamp })
        return commentHTML
    }


    //TEMP
    function addToDB({userId, commentObj}) {
        const entriesId = '1q53NgdwJg68num_cp797D_5greDv4w2v';
        const entriesArray = readFromJSON(entriesId);
        entriesArray.forEach(entry => { if (entry.userId == userId) entry.comments.push(commentObj) })
        writeToJSON(entriesId, entriesArray)
    }

    return {
        getAllMappedEntries,
        getEntry,
        addComment
    }
})

function getAllEntries() {
    const allEntriesToWrite = HUMAN_MANAGER.getAllEntries({ divisionType: "Activities", divisionId: "CCG", eventId: "SIR3" });
    console.log(allEntriesToWrite)
}

function getEntry() {
    HUMAN_MANAGER.getEntry({ path: "getFullApplicationByEmail", divisionType: "Activities", divisionId: "CCG", eventId: "SIR2", email: "mahmoud.salama77@gmail.com" })
}

function addComment({ userId, comment } = {}) {
    userId = userId || "abc-1"
    comment = comment || "Nope"
    return HUMAN_MANAGER.addComment({ userId, comment })
}