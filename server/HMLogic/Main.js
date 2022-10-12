; (function (root, factory) {
    root.HUMAN_MANAGER = factory()
})(this, function () {

    const { Toolkit, _, modulesRequire, REFERENCES_MANAGER } = CCLIBRARIES
    const { readFromJSON, writeToJSON } = Toolkit
    const REQUIRED_REFERENCES = ["divisionsProperties"];

    let CCAPPLICATIONSBACKEND

    let referencesObj
    let configs

    const getReferences = function () {
        getRequiredIndexes();
        getRequiredScripts();
    }

    function getRequiredIndexes({ divisionId, divisionType }) {
        referencesObj = REFERENCES_MANAGER.defaultReferences.requireFiles(REQUIRED_REFERENCES).requiredFiles;
        configs = referencesObj.divisionsProperties.fileContent[divisionType][divisionId];
    }

    function getRequiredScripts() {
        const ccApplicationsBackend = referencesObj.deployedScripts.fileContent.CCAPPLICATIONSBACKEND;
        CCAPPLICATIONSBACKEND = modulesRequire(ccApplicationsBackend);
    }

    function getAllEntries({ eventId, divisionId, divisionType }) {
        getReferences({ eventId, divisionId, divisionType });
        const response = getEntries({ eventId, divisionId, divisionType });
        if (!response) return []
        const { data } = response;
        const mappedData = getMappedData(data);
        return mappedData;
    }

    function getEntries(request) {
        const response = CCAPPLICATIONSBACKEND.post({ ...request, path: "getFullApplications" })
        if (response.sourceError) {
            console.log(response.sourceError);
            return
        }
        return response
    }

    function getMappedData(data) {
        const { filteringMap } = configs;
        const mappedData = data.map(entry => {
            const mappedDataObj = {}
            return replaceValue(filteringMap, entry, mappedDataObj)
        })
        return mappedData
    }

    function replaceValue(obj, entry, mappedDataObj) {
        if (Array.isArray(obj)) {
            return obj.map(element => {
                return replaceValue(element, entry)
            })
        } else if (typeof obj == 'object') {
            if (obj.hasOwnProperty("value")) {
                let { value } = obj;
                value = getValueFromEntry(value, entry)
                return { ...obj, value }
            } else {
                Object.entries(obj).forEach(([key, subObj]) => {
                    mappedDataObj[key] = replaceValue(subObj, entry)

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
            if (Array.isArray(entry[param])) {
                returnValue = entry[param][0]
            } else {
                returnValue = returnValue ? returnValue[param] : entry[param]
            }
        })
        return returnValue || ""
    }



    return {
        getAllEntries
    }
})