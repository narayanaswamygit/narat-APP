const dotenv = require('dotenv');
dotenv.config();
const config = {
    defaultResultSize: Number(process.env.tapp_result_size) || 50,
    confidenceThreshold: Number(process.env.tapp_confidence_threshold) || 70,
    downloadAllThreshold: process.env.downloadAllThreshold || 500,
    autoPreprocessing: process.env.tapp_auto_processing || "true",
    autoExtraction: process.env.tapp_auto_extraction || "false",
    preProcessorAPIHost: process.env.tapp_preprocessor_api_host || "http://127.0.0.1:9005",
    extractionAPIHost: process.env.tapp_extraction_api_host || "http://127.0.0.1:7173",
    storageProvider: process.env.tapp_storage_provider || "localblob",
    storageAccessKey: process.env.tapp_storage_access_key || "tapp2data",
    storageAccessSecret: process.env.tapp_storage_access_secret || "C38zpM1CfufDmqcelnI/VvjIUpB6Fyoj8QUtsKrFs4f7pAKCpzMFRClSOhJW1thKSOdZB7Jm3OWughlSKEsuxg==",
    storageContainer: process.env.tapp_storage_container || "import",
    storageContainerAssets: process.env.tapp_storage_asset_container || "assets",
    storageSampleInvoicesContainer: process.env.tapp_storage_sampleInvoices_container || "sampleinvoices",
    storageRegion: process.env.tapp_storage_region || "",
    authorizationKey: process.env.authorizationKey || "Basic cGFpZ2VzdDpQaHB0ZXN0QDEwOQ==",
    initialDocsExtracted: process.env.initialDocsExtracted || 0,

    //mongodb database name and host
    mongoDBHost: process.env.tapp_mongodb_host || "mongodb://127.0.0.1:27017",
    mongoDBName: process.env.tapp_mongodb_db_name || "pAIges_v2_db",
    tappUIAPIHost: process.env.tapp_api_host || "http://127.0.0.1:8888",

    //mysql database settings
    sqlDBHost: process.env.sql_db_host || "swginstapaiges.postgres.database.azure.com",
    sqlDBName: process.env.sql_db_name || "swginsta_pAIges",
    sqlDBPort: process.env.sql_db_port || "5432",
    sqlDBUsername: process.env.sql_db_username || "swginsta_admin@swginstapaiges",
    sqlDBPassword: process.env.sql_db_password || "jQ0y]QcA0Qv.p]D",

    //mysql consumption_database settings
    consumptionSqlDBHost: process.env.consumption_sql_db_host || "swginstapaiges.postgres.database.azure.com",
    consumptionSqlDBName: process.env.consumption_sql_db_name || "swginsta_pAIges",
    consumptionSqlDBPort: process.env.consumption_sql_db_port || "5432",
    consumptionSqlDBUsername: process.env.consumption_sql_db_username || "swginsta_admin@swginstapaiges",
    consumptionSqlDBPassword: process.env.consumption_sql_db_password || "jQ0y]QcA0Qv.p]D",
    consumptionSqlDBTable: process.env.consumption_sql_db_table || "paiges_usage",
    consumptionSubscriptionId: process.env.consumption_subscription_id || "b41a7071-3661-4a38-83cb-aebe43baab35",

    //reports-service
    reportsDataPath: process.env.reportsDataPath || "http://106.51.73.100:8194/collect_metadata",

    //postgreSQL tableNames
    metaDataTable: process.env.metaDataTable || 'tao_sandboxv2_document_metadata',
    resultDataTable: process.env.resultDataTable || 'tao_sandboxv2_document_result',
    rpaMetaDataTable: process.env.rpaMetaDataTable || 'tao_sandboxv2_rpa_metadata',

    //storeDataInPostgreSQL
    storeDataInPostgreSQL: process.env.storeDataInPostgreSQL || 1,

    //rpa starts here
    rpaIntegrationMode: process.env.rpa_integration_mode || "cloud", // Possible values are 'cloud', 'on-premise'
    rpaAuthenticationDomain: process.env.rpa_authentication_domain || "https://account.uipath.com/",
    rpaOrchestratorDomain: process.env.rpa_orchestrator_domain || "https://platform.uipath.com/",
    rpaJobIds: process.env.rpa_job_ids, // RPA job ids to listen for in webhooks. Leave this blank to listen for all jobs

    // RPA Cloud integration configuration keys
    rpaAccountLogicalName: process.env.rpa_account_logical_name || "taosmyhlxp",
    rpaTenantLogicalName: process.env.rpa_tenant_logical_name || "TAODefaulta1n6222679",
    rpaTenantOrganizationID: process.env.rpa_tenant_organization_id || 100469,
    rpaRefreshToken: process.env.rpa_refresh_token || "lkVBXp5KOVt-AbUfEDqUFRCdo0DfgAwdnLDWMqIm057Bl",
    rpaClientId: process.env.rpa_client_id || "8DEv1AMNXczW3y4U15LL3jYf62jK93n5",

    // RPA On-Premise integration configuration keys
    rpaTenantName: process.env.rpa_tenant_name || "",
    rpaUserName: process.env.rpa_user_name || "",
    rpaPassword: process.env.rpa_password || "",
    reviewSubmitURL: process.env.tapp_review_submit_url || "",

    //Network paths - Root location
    localBlobStorage: process.env.tapp_localBlobStorage || "/home/pAIges_home/pAIges_UI/sandbox_paigesv2_UI/app",

    //static files url
    localStaticPath: process.env.tapp_images_static_url || "/static",

    //download results
    downloadResultsAPI: process.env.tapp_download_results_api || "http://127.0.0.1:9005/download/results",
    downloadResultPath: process.env.downloadResultPath || "/downloads/",
    downloadOriginalFileAPI: process.env.download_originalFile_api || "http://127.0.0.1:9005/download/pdf",
    downloadListViewFilesAPI: process.env.download_ListViewFiles_api || "http://106.51.73.100:8194/ui_downloads/list_view",

    getInvoiceTiffURL: process.env.tapp_invoice_tiff_url || "http://127.0.0.1:8081",
    queryAddWorkflowAPIURL: process.env.query_add_workflow_API_URL || "http://180.151.86.53:90/api/TAPP/SaveTappData",
    queryDeleteWorkflowAPIURL: process.env.query_delete_workflow_API_URL || "http://180.151.86.53:90/api/DeleteTAPP/DeleteQueryData",

    // mongo atlas
    //databaseUrl: 'mongodb+srv://kanak:kanak_optimal@cluster0.shybo.mongodb.net/paiges_kgs?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true',
    databaseUrl: process.env.mongo_Atlas_Host_Url || 'mongodb+srv://pAIges_DB:r1JliLnVh37DzRux@cluster0.fbbiy.mongodb.net/demo_db?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true',

    //others
    clientAddress: process.env.clientAddress || "http://106.51.73.100:8888",
    emailServiceProvider: process.env.emailServiceProvider || 'gmail',
    senderEmailId: process.env.senderEmailId || "yourgamil@gmail.com",
    senderPassword: process.env.senderPassword || "password",

    //for send email
    emailEndPoint: process.env.emailEndPoint || 'https://paigessendemail.centralindia-1.eventgrid.azure.net/api/events',
    aegsaskey: process.env.mailSendKey || 'iVEOjpKIERR9gvo4psYRGpOMD3wRbEucerYHGdYxbSU=',

    //encryption/decryption
    secret_key: process.env.encryptionKey || 'PAIGESISPOWEREDBYTAOAUTOMATION2022',
    tokenId: process.env.decryptionTokenId || 'vtucupWt0pZBVYcPVgzQ/A==',

    //extraction-assist
    formatIdentifierRootPath: process.env.formatIdentifierRootPath || 'http://127.0.0.1:8194/format_identifier/',
    pathFinderRootPath: process.env.pathFinderRootPath || 'http://127.0.0.1:8194/path_finder/',
    pathFinderCorrectionsPath: process.env.pathFinderCorrectionsPath || 'http://127.0.0.1:8194/corrections/',
    RAISE_TICKET_EMAIL: process.env.RAISE_TICKET_EMAIL || 'amit.rajan@taoautomation.com',

    // common
    ALERT_TIMEOUT: process.env.ALERT_TIMEOUT || 5000, // 5sec
    AUTO_REFRESH_IN: process.env.AUTO_REFRESH_IN || 5000, // 5sec
    HOW_IT_WORKS_URL: process.env.HOW_IT_WORKS_URL || 'https://www.taoautomation.com/what-we-do/productized-solutions/tao-paiges/',
    MaximumAllowedPages: process.env.maximumAllowedPages || 10,
    MaximumFileSizeLimit: process.env.maximumFileSizeLimit || 5,
    AdminEmailId: process.env.adminEmailId || 'pAIges.admin@taoautomation.com',
    DEFAULT_EA_TIMEGAP: process.env.DEFAULT_EA_TIMEGAP || 90, // 3months

    //reviewer
    ACTIVITY_TIME_REVIEWER: process.env.ACTIVITY_TIME_REVIEWER || 300, //300 seconds
    ALERT_DISSMISS_REVIEWER: process.env.ALERT_DISSMISS_REVIEWER || 60,//60 seconds
    AUTO_UNLOCK_DOCUMENT_IN: process.env.AUTO_UNLOCK_DOCUMENT_IN || 30, // 30 mins

    //client-specific
    SIGNUP_PAGE_VISIBILITY: process.env.SIGNUP_PAGE_VISIBILITY || 0,
    DASHBOARD_VISIBILITY: process.env.DASHBOARD_VISIBILITY || 1,
    PROCESSING_VISIBILITY: process.env.PROCESSING_VISIBILITY || 1,
    SETTINGS_VISIBILITY: process.env.SETTINGS_VISIBILITY || 1,
    ACTIONS_VISIBILITY: process.env.ACTIONS_VISIBILITY || 1,
    POINT_AND_SHOOT_VISIBILITY: process.env.POINT_AND_SHOOT_VISIBILITY || 1,
    EXTRACTION_ASSIST_VISIBILITY: process.env.EXTRACTION_ASSIST_VISIBILITY || 0,
    EXTERNAL_LOGS_VISIBILITY: process.env.EXTERNAL_LOGS_VISIBILITY || 1,
    DETAILED_LOGS: process.env.DETAILED_LOGS || 1,
    LOGS_LENGTH: process.env.LOGS_LENGTH || 2000,
    DAILY_CONSUMPTION_LIMIT_VISIBILITY: process.env.DAILY_CONSUMPTION_LIMIT_VISIBILITY || 0,
    FAQ_PAGE_VISIBILITY: process.env.FAQ_PAGE_VISIBILITY || 0,
    CARDVIEW_VISIBILITY: process.env.CARDVIEW_VISIBILITY || 1,
    VIEWER_ROLE_VISIBILITY: process.env.VIEWER_ROLE_VISIBILITY || 0,
    TIPS_VISIBILITY: process.env.TIPS_VISIBILITY || 1,
    LINE_ITEMS_VISIBILITY: process.env.LINE_ITEMS_VISIBILITY || 1,
    ADMIN_UPLOAD_VISIBILITY: process.env.ADMIN_UPLOAD_VISIBILITY || 0,
    TAPP_CHANGES_VISIBILITY: process.env.TAPP_CHANGES_VISIBILITY || 1,
    LOGO_VISIBILITY: process.env.LOGO_VISIBILITY || 0,
    UPLOAD_BUTTON_VISIBILITY: process.env.UPLOAD_BUTTON_VISIBILITY || 0,
    STP_AND_ACE_VISIBILITY: process.env.STP_AND_ACE_VISIBILITY || 0,
    REASSIGN_BUTTON_VISIBILITY: process.env.REASSIGN_BUTTON_VISIBILITY || 1,
    DROPDOWN_VISIBILITY: process.env.DROPDOWN_VISIBILITY || 0,


    //LIMITS
    CONSUMPTION_LIMIT: process.env.CONSUMPTION_LIMIT || 50,
    //either set it to "documents" or "pages" only.
    CONSUMPTION_UNIT: process.env.CONSUMPTION_UNIT || 'pages',
    COMPARING_VALUES_IN_METADATA: process.env.COMPARING_VALUES_IN_METADATA || ["postingStatus", "statusMsg", "approverEmail", "approvalStatus", "approverComment"],

    //for swiggy it should be 0 and for KGS it should be 1
    DOCTYPES_VISIBILITY: process.env.DOCTYPES_VISIBILITY || 1,
    DOCUMENT_TYPES_LIST: process.env.DOCUMENT_TYPES_LIST || [{ "name": "Freight", "checked": "true" }, { "name": "Non-PO", "checked": "true" }],
    DOCTYPE_CHECK_FOR_ROLES: process.env.DOCTYPE_CHECK_FOR_ROLES || ["clientadmin", "reviewer", "approver"],

    //Admin Role Limitation
    ALL_ROLES_VISIBILITY_FOR_ADMIN: process.env.ALL_ROLES_VISIBILITY_FOR_ADMIN || 0,

    //default functionality on review page - value can be either 'pointAndShoot' or 'zoom'
    DEFAULT_FUNCTIONALITY: process.env.DEFAULT_FUNCTIONALITY || "pointAndShoot",

    //session
    SESSION_EXPIRE_TIME: process.env.SESSION_EXPIRE_TIME || 2,
    SESSION_EXPIRE_TIME_UNIT: process.env.SESSION_EXPIRE_TIME_UNIT || 'hours',

    //mergeTometadata
    mergeFieldsResultAndMetadata: process.env.tapp_merge_result_metadata || "invoiceNumber,invoiceDate,totalAmount,vendorName",

    //business Rule Validation
    businessRuleValidationAPIRootPath: process.env.businessRuleValidation_APIRootPath || "http://127.0.0.1:8194/",
    callbackUrlForValidationAPI: process.env.callbackUrlForValidationAPI || 'http://106.51.73.100:8888',
    BUZ_RULE_API_VISIBILITY: process.env.BUZ_RULE_API_VISIBILITY || 1,

    //VAPT
    INVALID_FORM_TAGS: process.env.INVALID_FORM_TAGS || ['<script', '/script', 'script>', '<title', '/title', 'title>', '<import', '/import', 'import>', '<link', '/link', 'link>'],

    //upload-related
    orgTypeOptions: process.env.tapp_orgtype_options || '[{"orgTypeId":"ORG_001", "orgType":"ACC PAYABLE"}, {"orgTypeId":"ORG_002", "orgType":"KYC"}]',
    docTypeOptions: process.env.tapp_doctype_options || '[{"docTypeId":"DOC_001", "docType":"Freight"},{"docTypeId":"DOC_002", "docType":"Non-PO"}]',

    // Sub folders - list all sub folders in the above directory. Also include preprocessor directory in this list.
    localFileTypesAllowed: process.env.tapp_localFileTypesAllowed || '{"pdf":"application/pdf","tiff":"image/tiff"}',
    localSubFoldersAllowed: process.env.tapp_localSubFolders_allowed || '{"import":"/import/","assets":"/assets/","sampleinvoices":"/sampleinvoices/","preprocessor":"/preprocessor/","downloads":"/downloads/"}',

    //dashboard
    organizationConfig: process.env.organizationConfig || '{"orgName":"KGS", "orgID":"19012", "expiry":"June 10 2022", "pageQuota":10}',
    chartsAPIRootPath: process.env.chartsAPIRootPath || "http://127.0.0.1:8194/",
    postingTabInDashboard: process.env.postingTabInDashboard || 1,
    dashboardOptions: process.env.dashboardOptions || [{ "name": "Configure", "visibility": 1 }, { "name": "Other Graphs", "visibility": 1 }],
    dashboardCalenderPrevMonthValue: process.env.dashboardCalenderPrevMonthValue || 0,

    //black-listed domains
    BLACKLISTED_DOMAINS: process.env.BLACKLISTED_DOMAINS || ['gmail', 'outlook', 'prontonmail', 'aol', 'zoho', 'iCloud', 'yahoo', 'gmx'],

    //not-extracted fields list
    unExtractedfields: process.env.unExtractedfields || ['invoiceNumber', 'poNumber', 'invoiceDate', 'totalAmount', 'subTotal', 'SGSTAmount', 'CGSTAmount', 'vendorAddress', 'vendorGSTIN', 'vendorName', 'vendorEmail', 'totalGSTAmount'],

    //delete-reasons
    deleteReasonOptions: process.env.deleteReasonOptions || [{ "id": "1", "name": "Not an Invoice" }, { "id": "2", "name": "Already Processed" }, { "id": "3", "name": "Multiple Invoices in file" }, { "id": "4", "name": "Do not need anymore" }, { "id": "5", "name": "Others" }],
    
    //reassign-reasons
    reassignReasonOptions: process.env.reassignReasonOptions || '[{"id": "1", "name": "These are Reassign Options" },  { "id": "2", "name": "Others" }]',

    //purge document
    KeysToBeDeletedFromDocColl: process.env.KeysToBeDeletedFromDocColl || { invoiceNumber: 1, totalAmount: 1, vendorId: 1, invoiceDate: 1, currency: 1, bar_qr_data: 1 },
    KeysToBeDeletedFromResultColl: process.env.KeysToBeDeletedFromResultColl || { documentInfo: 1, documentLineItems: 1, vendorId: 1 },

    //statusChangeEventConfig for Microsoft Eventgrid 
    statusChangeEventConfig: process.env.statusChangeEventConfig || {
        rootPath: 'https://swiggyinstastatuschange.centralindia-1.eventgrid.azure.net/api/events',
        aegSasKey: 'NUXVmhvNpzoYXFBfb/LW/rJTy9w+gKw2Xbxsjyl1GWk=',
        topic: '/subscriptions/3d34cc1f-baa0-4d2e-80b3-95a1834afe2f/resourceGroups/TAPP/providers/Microsoft.EventGrid/topics/swiggyInstaStatusChange',
        subject: 'Microsoft.EventGrid/topics/swiggyInstaStatusChange',
        eventType: 'Microsoft.EventGrid',
        eventTrigger: 0
    },

    //client-specific project configs
    projectConfigurations: process.env.projectConfigurations || {
        projectName: 'pAIges', //TAPP,
        logoName: 'pAIgesLogoHeader.svg', // tappLogoHeader.svg
        appVersion: '1.0.0',
        clientLogo: 'bcp-logo.PNG', // swiggy-logo.png
        clientLogoStyle: 'logo-style-bcp' // logo-style-swiggy
    },

    dashboardFilters: process.env.dashboardFilters || {
        extraction: [
            { name: 'sla_flag', type: 'radio', visibility: 0 },
            { name: 'documentType', type: 'checkBox', visibility: 1 },
            { name: 'vendor name', type: 'searchAndSelect', visibility: 1 },
            { name: 'billing state', type: 'searchAndSelect1', visibility: 0 }
        ],
        posting: [
            { name: 'posting status', type: 'radio', visibility: 1, values: ["Success", "BUSINESS EXCEPTION", "SYSTEM EXCEPTION"] },
            { name: 'documentType', type: 'checkBox', visibility: 1 },
            { name: 'vendor name', type: 'searchAndSelect', visibility: 1 }
        ]
    }
};

module.exports = config;