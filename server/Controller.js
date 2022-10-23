const RENDER_OPTIONS = {
    favIcon: HELPERS.getFavIconFromLink("https://drive.google.com/file/d/112klNXnqobGTyFlADSVdHSIB7in4b-4F/view?usp=sharing"),
    metaData: [
        {
            name: "viewport",
            content: "width=device-width, initial-scale=1"
        }
    ]
}

const PROPS_CONSTANTS = {
    scriptURL: ScriptApp.getService().getUrl()
}

    ; (function (root, factory) {
        root.CONTROLLER = factory()
    })(this, function () {

        const { Toolkit } = CCLIBRARIES
        const { readFromJSON, writeToJSON, groupBy } = Toolkit



        //Top level

        const renderApp = function (req) {
            console.log("rendering app!")
            const { path, query } = req
            return MW.render('client/app', { path, query }, { ...RENDER_OPTIONS, title: "Community By CC" })
        }

        // Page level (fetched with render from App)

        // Test

        const testOut = function (req, res) {
            console.log(req)
        }

        const testIn = function (req, res) {
            console.log(req)
            const testingPath = 'client/test'
            return MW.render('client/index',
                { prerendered: false, routedPage: testingPath, props: {} })
        }

        const testVariable = function (req, res) {
            console.log(req)
        }

        const testFiltering = function (req, res) {
            const entriesId = '1q53NgdwJg68num_cp797D_5greDv4w2v'
            const entriesArray = readFromJSON(entriesId)
            const dataByStage = groupBy(entriesArray, "stage")
            const stages = ['screening', 'interview', 'panel', 'final']
            const filteringPath = 'client/pages/HumanManager/Filtering/filtering'
            return MW.render('client/index',
                { prerendered: false, routedPage: filteringPath, props: { dataByStage, stages } })
        }

        const testFiltering_dev = function (req, res) {
            const entriesId = '1q53NgdwJg68num_cp797D_5greDv4w2v'
            const entriesArray = readFromJSON(entriesId)
            const dataByStage = groupBy(entriesArray, "stage")
            const stages = ['screening', 'interview', 'panel', 'final']
            const filteringPath = 'client/pages/HumanManager/Filtering/filtering'
            return MW.render('client/devIndex',
                { ...PROPS_CONSTANTS, routedPage: filteringPath, prerendered: false, props: { dataByStage, stages } })
        }

        // TESTING  Non prerendered (Hot) (from App)

        const getActivityFilteringList_dev = function (req) {
            const { activityDivisionEventId } = req.params;
            const [divisionType, divisionId, eventId] = activityDivisionEventId.split("-");
            if (!divisionType || !divisionId || !eventId) return MW.render('client/devIndex', { routedPage: "client/notFound", props: { prerendered: false } })
            const mappedData = HUMAN_MANAGER.getAllMappedEntries({ eventId, divisionId, divisionType });
            const dataByStage = groupBy(mappedData, "stage")
            const stages = ['screening', 'interview', 'panel', 'final']
            const filteringPath = 'client/pages/HumanManager/Filtering/filtering'
            return MW.render('client/devIndex', { ...PROPS_CONSTANTS, routedPage: filteringPath, prerendered: false, props: { dataByStage, stages } })
        }

        // Non prerendered (Hot) (from App)

        const getActivityFilteringList = function (req) {
            const { activityDivisionEventId } = req.params;
            const [divisionType, divisionId, eventId] = activityDivisionEventId.split("-");
            const mappedData = HUMAN_MANAGER.getAllMappedEntries({ allEntries, eventId, divisionId, divisionType });
            const stages = ['screening', 'interview', 'panel', 'final']
            const filteringPath = 'client/pages/HumanManager/Filtering/filtering'
            return MW.render('client/index', { ...PROPS_CONSTANTS, routedPage: filteringPath, prerendered: false, props: { prerendered: false, entriesArray: mappedData, stages } })
        }

        // Prerendered (from App)

        const getPrerenderedPaths = function (req) {
            const { path } = req;
            return MW.render('client/index', { routedPage: "", props: { prerendered: true, path } }).getContent()
        }

        // API paths

        const createPrerenders = function (req, res) {
            //Coming from Outside (API)
            const { activityDivisionEventId, allEntries } = req.params;
            const [divisionType, divisionId, eventId] = activityDivisionEventId.split("-");
            const mappedData = HUMAN_MANAGER.getAllMappedEntries({ allEntries, eventId, divisionId, divisionType });
            PRERENDER.createPrerenders(path, { entriesArray: mappedData })
            res.success = true
            return res
        }

        // Sign in Pages (from App)

        const getSignInPage = function (req) {
            const { user } = req.params.session
            if (user) return MW.render('client/index', { routedPage: "home", props: { prerendered: false } }).getContent()
            return MW.render('client/index', { routedPage: "client/SignIn/signIn", props: { prerendered: false } }).getContent()
        }

        const getMagicLink = function (req) {
            const { email } = req.params
            const token = getToken();
            setLogs(email, { token });
            const magicLink = createMagicLink(token);
            EMAILS.send({ template: "magicLinks", email, magicLink })
            return MW.render('client/index', { routedPage: "client/SigningIn/checkMagicLink", props: { prerendered: false } }).getContent()
        }

        const verifyMagicLink = function (req) {
            const { email_token } = req.params
            const [email, token] = email_token.split("-");
            const foundToken = getFromLogs(email, "token");
            if (foundToken == token) {
                const user = HUMAN_MANAGER.getUserByEmail(email);
                return MW.render('client/signingIn', { user }).getContent()
            } else {
                return MW.render('client/index', { routedPage: "client/Broken/magicLinkExpired", props: { prerendered: false } }).getContent()
            }
            //check the logs
            //if yes load userId from DB
        }

        // Errors

        const renderNotFound = function (req) {
            console.log("Not Found!")
        }


        return {
            renderApp,
            renderNotFound,
            testFiltering,
            getActivityFilteringList,
            getPrerenderedPaths,
            createPrerenders,
            getSignInPage,
            getMagicLink,
            verifyMagicLink,
            testOut,
            testIn,
            testVariable,
            testFiltering_dev,
            getActivityFilteringList_dev
        }
    })

function testLodash() {
    const lodash = CCLIBRARIES.Toolkit;
    const arr = [{ a: 1, type: "a" }, { a: 33, type: "a" }, { a: 2, type: "b" }, { a: 1203, type: "b" }]
    const grouped = lodash.groupBy(arr)
    console.log(grouped)
}