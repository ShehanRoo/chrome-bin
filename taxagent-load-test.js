// Generated flow adapted from Grafana k6 Studio (2.1.2) recording on 2026-11-04T05:54:06.107Z
// Required:
//   SESSION_TOKEN='...' k6 run taxagent-load-test.js

import { group, sleep, check } from "k6";
import http from "k6/http";
import { Counter, Trend } from "k6/metrics";

const BASE_URL = __ENV.BASE_URL || "https://taxpayer-pre-dh2.gta.gov.qa";
const SESSION_COOKIE_NAME = __ENV.SESSION_COOKIE_NAME || "session";
const SESSION_TOKEN = __ENV.SESSION_TOKEN;
const TIN = __ENV.TIN || "5000194886";
const THINK_TIME_MIN_SECONDS = Number(__ENV.THINK_TIME_MIN_SECONDS || 0.5);
const THINK_TIME_MAX_SECONDS = Number(__ENV.THINK_TIME_MAX_SECONDS || 2);

const AUTH_DOC_FILE_NAME = "pillar2-authdoc.docx";
const AUTH_DOC_CONTENT_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const AUTH_DOC = new Uint8Array(open(`./${AUTH_DOC_FILE_NAME}`, "b"));
const UPLOAD_BOUNDARY = "----WebKitFormBoundaryaB3B1CUFvj13D6ZC";

if (!SESSION_TOKEN) {
  throw new Error(
    "SESSION_TOKEN is required. Run with: SESSION_TOKEN='...' k6 run taxagent-load-test.js",
  );
}

export const options = {
  stages: [
   { target: 10, duration: "15m" },
    { target: 10, duration: "15m" },
    { target: 0, duration: "10m" },
  ],
  summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)"],
};

function endpointMetric(name) {
  return {
    timing: new Trend(`endpoint_${name}`, true),
    failures: new Counter(`endpoint_${name}_failures`),
  };
}

const endpointMetrics = {
  pageLocaleRoot: endpointMetric("page_locale_root"),
  rscLocaleRoot: endpointMetric("rsc_locale_root"),
  rscPillar2Guide: endpointMetric("rsc_pillar2_guide"),
  rscPillar2Registration: endpointMetric("rsc_pillar2_registration"),
  apiSessionKey: endpointMetric("api_session_key"),
  graphqlUnknown: endpointMetric("graphql_unknown"),
};

const graphqlEndpointMetrics = {
  WebGetMyOperableTins: endpointMetric("graphql_web_get_my_operable_tins"),
  WebGetTaxpayerPillar2Dashboard: endpointMetric(
    "graphql_web_get_taxpayer_pillar2_dashboard",
  ),
  GetTaxpayerTinDetail: endpointMetric("graphql_get_taxpayer_tin_detail"),
  WebGetPillar2InstructionUrl: endpointMetric(
    "graphql_web_get_pillar2_instruction_url",
  ),
  WebDeletePillar2Registration: endpointMetric(
    "graphql_web_delete_pillar2_registration",
  ),
  WebSavePillar2Registration: endpointMetric(
    "graphql_web_save_pillar2_registration",
  ),
  WebGetPillar2Registration: endpointMetric(
    "graphql_web_get_pillar2_registration",
  ),
  WebGetPillar2FileUrl: endpointMetric("graphql_web_get_pillar2_file_url"),
  WebGetOtherGroupsAssociatedWithEntities: endpointMetric(
    "graphql_web_get_other_groups_associated_with_entities",
  ),
  uploadFile: endpointMetric("graphql_upload_file"),
};

function getGraphqlMetric(operationName) {
  return graphqlEndpointMetrics[operationName] || endpointMetrics.graphqlUnknown;
}

function getPageMetric(url) {
  const [rawPath, query = ""] = String(url).replace(BASE_URL, "").split("?");
  const isRsc = query.includes("_rsc=");

  if (rawPath === "/en") {
    return isRsc ? endpointMetrics.rscLocaleRoot : endpointMetrics.pageLocaleRoot;
  }

  if (rawPath === "/api/session-key") {
    return endpointMetrics.apiSessionKey;
  }

  if (rawPath === `/${TIN}/services/pillar2-registration/guide`) {
    return endpointMetrics.rscPillar2Guide;
  }

  if (rawPath.startsWith(`/${TIN}/services/pillar2-registration/`)) {
    return endpointMetrics.rscPillar2Registration;
  }

  return null;
}

function timedRequest(method, url, body, params, operationName) {
  const resp = http.request(method, url, body, params);
  const endpointMetric = String(url).includes("/api/graphql")
    ? getGraphqlMetric(operationName)
    : getPageMetric(url);

  if (endpointMetric) {
    endpointMetric.timing.add(resp.timings.duration);

    if (resp.status >= 400) {
      endpointMetric.failures.add(1);
    }
  }

  return resp;
}

function checkStatus(resp, expected) {
  const label = resp.url || "request";

  console.log(`${label} -> status ${resp.status}`);

  if (resp.status !== 200) {
    console.log(`${label} -> response body:`);
    console.log(resp.body || "<empty response body>");
  }

  check(resp, {
    [`status equals ${expected}`]: (r) => r.status === expected,
  });
}

function thinkTime() {
  const min = Math.max(0, THINK_TIME_MIN_SECONDS);
  const max = Math.max(min, THINK_TIME_MAX_SECONDS);
  sleep(Math.random() * (max - min) + min);
}

const browserAccept =
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/jxl,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7";

const guideRouterStateTree = `%5B%22%22%2C%7B%22children%22%3A%5B%5B%22locale%22%2C%22en%22%2C%22d%22%2Cnull%5D%2C%7B%22children%22%3A%5B%22(authenticated)%22%2C%7B%22children%22%3A%5B%5B%22tin%22%2C%22${TIN}%22%2C%22d%22%2Cnull%5D%2C%7B%22children%22%3A%5B%22services%22%2C%7B%22children%22%3A%5B%22(pillar2)%22%2C%7B%22children%22%3A%5B%22pillar2-registration%22%2C%7B%22children%22%3A%5B%22guide%22%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2C%22refetch%22%2C0%5D%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2Cnull%2C16%5D`;

function htmlParams(refererPath) {
  const headers = { Accept: browserAccept };

  if (refererPath) {
    headers.Referer = `${BASE_URL}${refererPath}`;
  }

  return { headers };
}

function rscPrefetchParams(nextUrl, tags) {
  return {
    headers: {
      rsc: "1",
      "next-router-segment-prefetch": "/_tree",
      "next-router-prefetch": "1",
      "next-url": nextUrl,
      Accept: "*/*",
      Referer: `${BASE_URL}${nextUrl}`,
    },
    tags,
  };
}

function rscParams(nextUrl, routerStateTree) {
  return {
    headers: {
      rsc: "1",
      "next-url": nextUrl,
      "next-router-state-tree": routerStateTree,
      Accept: "*/*",
      Referer: `${BASE_URL}${nextUrl}`,
    },
  };
}

function graphqlParams(refererPath) {
  return {
    headers: {
      accept: "application/graphql-response+json, application/json",
      "content-type": "application/json",
      Origin: BASE_URL,
      Referer: `${BASE_URL}${refererPath}`,
    },
  };
}

function postGraphql(operationName, query, variables, refererPath) {
  const body = { query };

  if (variables) {
    body.variables = variables;
  }

  body.operationName = operationName;

  return timedRequest(
    "POST",
    `${BASE_URL}/api/graphql`,
    JSON.stringify(body),
    graphqlParams(refererPath),
    operationName,
  );
}

function asciiBytes(str) {
  const bytes = new Uint8Array(str.length);

  for (let i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i);
  }

  return bytes;
}

function postUploadFile(registrationId, refererPath) {
  const operations = JSON.stringify({
    query: uploadFileQuery,
    variables: {
      file: {},
      registrationId,
      documentType: "P2_AUTH_LETTER_APPT",
    },
  });
  const head = asciiBytes(
    [
      `--${UPLOAD_BOUNDARY}`,
      `Content-Disposition: form-data; name="operations"`,
      "",
      operations,
      `--${UPLOAD_BOUNDARY}`,
      `Content-Disposition: form-data; name="map"`,
      "",
      JSON.stringify({ 0: ["variables.file"] }),
      `--${UPLOAD_BOUNDARY}`,
      `Content-Disposition: form-data; name="0"; filename="${AUTH_DOC_FILE_NAME}"`,
      `Content-Type: ${AUTH_DOC_CONTENT_TYPE}`,
      "",
      "",
    ].join("\r\n"),
  );
  const tail = asciiBytes(`\r\n--${UPLOAD_BOUNDARY}--\r\n`);
  const body = new Uint8Array(head.length + AUTH_DOC.length + tail.length);

  body.set(head, 0);
  body.set(AUTH_DOC, head.length);
  body.set(tail, head.length + AUTH_DOC.length);

  return timedRequest(
    "POST",
    `${BASE_URL}/api/graphql`,
    body.buffer,
    {
      headers: {
        "content-type": `multipart/form-data; boundary=${UPLOAD_BOUNDARY}`,
        Accept: "*/*",
        Origin: BASE_URL,
        Referer: `${BASE_URL}${refererPath}`,
      },
    },
    "uploadFile",
  );
}

function graphqlData(resp) {
  try {
    return resp.json().data || null;
  } catch (error) {
    return null;
  }
}

function findDraftRegistrationId(dashboard) {
  const isDraft = (status) => /draft/i.test(String(status || ""));
  const profile = dashboard && dashboard.currentProfile;

  if (profile && profile.id && isDraft(profile.status)) {
    return profile.id;
  }

  const task = ((dashboard && dashboard.tasks) || []).find((t) =>
    isDraft(t.status),
  );

  return task ? task.applicationId : null;
}

function gqlDocument(operation, ...fragments) {
  return `\n    ${operation}\n    ${fragments.join("\n")}`;
}

const taxpayerFields = `fragment TaxpayerFields on Taxpayer {
  avatarUrl
  email
  name
  userId
}`;

const taxOfficerFields = `fragment TaxOfficerFields on TaxOfficer {
  avatarUrl
  email
  level
  name
  officerId
  taxRegime
  userId
}`;

const uploadedFileFields = `fragment UploadedFileFields on UploadedFile {
  documentId
  fileName
  url
}`;

const pillar2RegistrationBaseFields = `fragment Pillar2RegistrationBaseFields on Pillar2Registration {
  applicant {
    ...TaxpayerFields
  }
  createdAt
  expireAt
  id
  deregistrationReason
  status
  updatedAt
}`;

const pillar2RegistrationDfeFields = `fragment Pillar2RegistrationDfeFields on Dfe {
  jurisdiction {
    id
    code
    countryNameEn
    countryNameAr
    isQatar
  }
  legalNameAr
  legalNameEn
  tin
}`;

const pillar2RegistrationDleFields = `fragment Pillar2RegistrationDleFields on Dle {
  authDocs {
    ...UploadedFileFields
  }
  contactPerson
  contactPersonAddress
  emailAddress
  legalNameAr
  legalNameEn
  taxRegime
  tin
}`;

const pillar2RegistrationEntityFields = `fragment Pillar2RegistrationEntityFields on GroupEntity {
  id
  isDle
  isDfe
  isUpe
  hasIirTaxOblig
  legalNameAr
  legalNameEn
  taxRegime
  tin
}`;

const pillar2RegistrationGroupFields = `fragment Pillar2RegistrationGroupFields on Pillar2Group {
  groupType
  isDleUpe
  isUpeFileGIR
  isSbsSafeHarbor
  isDleDfe
  hasDFE
  name
  reportingFyEndDate
  reportingFyStartDate
  tin
  upe {
    ...Pillar2RegistrationUpeFields
  }
}`;

const pillar2RegistrationOtherUpeFields = `fragment Pillar2RegistrationOtherUpeFields on Pillar2RegistrationListItem {
  fiscalYear
  groupTin
  registrationId
  groupNameAr
  groupNameEn
}`;

const pillar2RegistrationReviewCommentFields = `fragment Pillar2RegistrationReviewCommentFields on Pillar2ReviewComment {
  commentId
  commentEn
  commentAr
}`;

const pillar2RegistrationReviewResultFields = `fragment Pillar2RegistrationReviewResultFields on Pillar2Review {
  comment {
    ...Pillar2RegistrationReviewCommentFields
  }
  commentDetails
  commentsOnFields {
    comment
    fieldName
  }
  decision
  order
  reassignTo {
    ...TaxOfficerFields
  }
  reviewLevel
  reviewedAt
  reviewer {
    ...TaxOfficerFields
  }
}`;

const pillar2RegistrationUpeFields = `fragment Pillar2RegistrationUpeFields on Upe {
  jurisdiction {
    id
    code
    countryNameEn
    countryNameAr
    isQatar
  }
  legalNameAr
  legalNameEn
  taxRegime
  tin
}`;

const pillar2RegistrationWebFields = `fragment Pillar2RegistrationWebFields on Pillar2Registration {
  ...Pillar2RegistrationBaseFields
  dfe {
    ...Pillar2RegistrationDfeFields
  }
  dle {
    ...Pillar2RegistrationDleFields
  }
  entities {
    ...Pillar2RegistrationEntityFields
  }
  group {
    ...Pillar2RegistrationGroupFields
  }
  reviewResult {
    ...Pillar2RegistrationReviewResultFields
  }
  otherRegistrationsOfUpe {
    ...Pillar2RegistrationOtherUpeFields
  }
}`;

const pillar2RegistrationWebFragments = [
  taxpayerFields,
  taxOfficerFields,
  uploadedFileFields,
  pillar2RegistrationBaseFields,
  pillar2RegistrationDfeFields,
  pillar2RegistrationDleFields,
  pillar2RegistrationEntityFields,
  pillar2RegistrationGroupFields,
  pillar2RegistrationOtherUpeFields,
  pillar2RegistrationReviewCommentFields,
  pillar2RegistrationReviewResultFields,
  pillar2RegistrationUpeFields,
  pillar2RegistrationWebFields,
];

const webGetMyOperableTinsQuery = gqlDocument(`query WebGetMyOperableTins {
  getMyOperableTins {
    taxAgentContext {
      actorType
      taxAgentNumber
      nameEn
      nameAr
      employeeId
      status
    }
    tins {
      tin
      bpStatus
      legalNameEn
      legalNameAr
      accessMode
    }
  }
}`);

const webGetTaxpayerPillar2DashboardQuery = gqlDocument(
  `query WebGetTaxpayerPillar2Dashboard($taxpayerTin: String!) {
  getTaxpayerPillar2Dashboard(taxpayerTin: $taxpayerTin) {
    tasks {
      applicationId
      priority
      status
      submissionTime
      tin
      taxpayer {
        ...TaxpayerFields
      }
      type
    }
    currentProfile {
      ...Pillar2RegistrationBaseFields
      requestType
      dfe {
        ...Pillar2RegistrationDfeFields
      }
      dle {
        ...Pillar2RegistrationDleFields
      }
      entities {
        ...Pillar2RegistrationEntityFields
      }
      group {
        ...Pillar2RegistrationGroupFields
      }
      amendmentChanges {
        id
        changeType
        entity {
          ...Pillar2RegistrationEntityFields
        }
      }
    }
  }
}`,
  taxpayerFields,
  uploadedFileFields,
  pillar2RegistrationBaseFields,
  pillar2RegistrationDfeFields,
  pillar2RegistrationDleFields,
  pillar2RegistrationEntityFields,
  pillar2RegistrationGroupFields,
  pillar2RegistrationUpeFields,
);

const getTaxpayerTinDetailQuery = gqlDocument(`query GetTaxpayerTinDetail($tin: String!) {
  getTaxpayerTinDetail(tin: $tin) {
    tin
    bpStatus
    legalNameEn
    legalNameAr
    taxRegime
    contactPerson
    contactPersonAddress
    emailAddress
  }
}`);

const webGetPillar2InstructionUrlQuery = gqlDocument(`query WebGetPillar2InstructionUrl {
  getPillar2InstructionPdfUrl: getPillar2FileUrl(fileType: INSTRUCTION_PDF)
  getPillar2InstructionVideoUrl: getPillar2FileUrl(fileType: INSTRUCTION_VIDEO)
}`);

const webDeletePillar2RegistrationQuery = gqlDocument(`mutation WebDeletePillar2Registration($id: ID!) {
  deletePillar2Registration(id: $id)
}`);

const webSavePillar2RegistrationQuery = gqlDocument(
  `mutation WebSavePillar2Registration($input: Pillar2RegistrationDraftInput!) {
  savePillar2Registration(input: $input) {
    ...Pillar2RegistrationWebFields
  }
}`,
  ...pillar2RegistrationWebFragments,
);

const webGetPillar2RegistrationQuery = gqlDocument(
  `query WebGetPillar2Registration($id: ID!) {
  getPillar2Registration(id: $id) {
    ...Pillar2RegistrationWebFields
  }
}`,
  ...pillar2RegistrationWebFragments,
);

const webGetPillar2FileUrlQuery = gqlDocument(`query WebGetPillar2FileUrl($fileType: Pillar2FileType!) {
  getPillar2FileUrl(fileType: $fileType)
}`);

const webGetOtherGroupsAssociatedWithEntitiesQuery = gqlDocument(`query WebGetOtherGroupsAssociatedWithEntities($entityTins: [String!]!, $currentGroupTin: String) {
  getOtherGroupsAssociatedWithEntities(
    entityTins: $entityTins
    currentGroupTin: $currentGroupTin
  ) {
    entityTin
    groupTin
    registrationId
  }
}`);

const uploadFileQuery = gqlDocument(
  `mutation uploadFile($file: File!, $registrationId: ID, $documentType: DocumentType!) {
  uploadFile(
    file: $file
    registrationId: $registrationId
    documentType: $documentType
  ) {
    ...UploadedFileFields
  }
}`,
  uploadedFileFields,
);

function groupInput(overrides) {
  return {
    groupType: "MNE",
    name: null,
    reportingFyStartDate: "2025-01-01",
    reportingFyEndDate: "2025-12-31",
    hasDFE: null,
    isDleUpe: null,
    isDleDfe: null,
    isUpeFileGIR: null,
    isSbsSafeHarbor: null,
    upe: null,
    ...overrides,
  };
}

function dleEntityInput(taxpayer, overrides) {
  return {
    isDle: true,
    isDfe: false,
    isUpe: false,
    legalNameEn: taxpayer.legalNameEn,
    legalNameAr: taxpayer.legalNameAr,
    taxRegime: taxpayer.taxRegime,
    tin: TIN,
    hasIirTaxOblig: null,
    ...overrides,
  };
}

function registrationInput(registrationId, taxpayer, authDocs, group, entity) {
  return {
    input: {
      id: registrationId,
      dle: {
        taxRegime: taxpayer.taxRegime,
        tin: TIN,
        legalNameEn: taxpayer.legalNameEn,
        legalNameAr: taxpayer.legalNameAr,
        authDocs,
      },
      group,
      dfe: null,
      entities: [entity],
    },
  };
}

export default function () {
  let resp;
  let data;

  http.cookieJar().set(BASE_URL, SESSION_COOKIE_NAME, SESSION_TOKEN);

  const tinPath = `/en/${TIN}`;
  const guidePath = `${tinPath}/services/pillar2-registration/guide`;
  const taxpayer = { legalNameEn: null, legalNameAr: null, taxRegime: "GTA" };
  let draftRegistrationId = null;

  group("Default group", function () {
    resp = timedRequest("GET", `${BASE_URL}/en`, null, htmlParams());
    checkStatus(resp, 200);
    thinkTime();

    resp = timedRequest(
      "GET",
      `${BASE_URL}/en?_rsc=wRepBYS43uoBGqDJ`,
      null,
      rscPrefetchParams("/en/login-as"),
    );

    resp = postGraphql(
      "WebGetMyOperableTins",
      webGetMyOperableTinsQuery,
      null,
      "/en/login-as",
    );
    checkStatus(resp, 200);
    thinkTime();

    resp = timedRequest(
      "GET",
      `${BASE_URL}/en?_rsc=wRepBYS43uoBGqDJ`,
      null,
      rscPrefetchParams("/en/login-as"),
    );

    resp = postGraphql(
      "WebGetTaxpayerPillar2Dashboard",
      webGetTaxpayerPillar2DashboardQuery,
      { taxpayerTin: TIN },
      tinPath,
    );
    checkStatus(resp, 200);
    data = graphqlData(resp);
    draftRegistrationId = findDraftRegistrationId(
      data && data.getTaxpayerPillar2Dashboard,
    );
    thinkTime();

    resp = timedRequest(
      "GET",
      `${BASE_URL}/${TIN}/services/pillar2-registration/guide?_rsc=WTJoignwLk9trHD9`,
      null,
      rscPrefetchParams(tinPath),
    );

    if (draftRegistrationId) {
      resp = timedRequest(
        "GET",
        `${BASE_URL}/${TIN}/services/pillar2-registration/${draftRegistrationId}?_rsc=WTJoignwLk9trHD9`,
        null,
        rscPrefetchParams(tinPath, {
          name: `${BASE_URL}/${TIN}/services/pillar2-registration/{draftRegistrationId}?_rsc=WTJoignwLk9trHD9`,
        }),
      );
    }

    resp = timedRequest(
      "GET",
      `${BASE_URL}/${TIN}/services/pillar2-registration/guide?_rsc=FxizOy3XR3RHAiZ2`,
      null,
      rscParams(tinPath, guideRouterStateTree),
    );

    resp = postGraphql(
      "WebGetTaxpayerPillar2Dashboard",
      webGetTaxpayerPillar2DashboardQuery,
      { taxpayerTin: TIN },
      guidePath,
    );
    checkStatus(resp, 200);
    data = graphqlData(resp);
    draftRegistrationId =
      findDraftRegistrationId(data && data.getTaxpayerPillar2Dashboard) ||
      draftRegistrationId;
    thinkTime();

    resp = postGraphql(
      "GetTaxpayerTinDetail",
      getTaxpayerTinDetailQuery,
      { tin: TIN },
      guidePath,
    );
    checkStatus(resp, 200);
    data = graphqlData(resp);
    if (data && data.getTaxpayerTinDetail) {
      taxpayer.legalNameEn = data.getTaxpayerTinDetail.legalNameEn;
      taxpayer.legalNameAr = data.getTaxpayerTinDetail.legalNameAr;
      taxpayer.taxRegime = data.getTaxpayerTinDetail.taxRegime || "GTA";
    }
    thinkTime();

    resp = postGraphql(
      "WebGetPillar2InstructionUrl",
      webGetPillar2InstructionUrlQuery,
      null,
      guidePath,
    );
    checkStatus(resp, 200);
    thinkTime();

    if (draftRegistrationId) {
      resp = postGraphql(
        "WebDeletePillar2Registration",
        webDeletePillar2RegistrationQuery,
        { id: draftRegistrationId },
        guidePath,
      );
      checkStatus(resp, 200);
      thinkTime();
    }

    resp = timedRequest(
      "GET",
      `${BASE_URL}/api/session-key`,
      null,
      { headers: { Accept: "*/*", Referer: `${BASE_URL}${guidePath}` } },
    );
    checkStatus(resp, 200);
    thinkTime();

    resp = postGraphql(
      "WebSavePillar2Registration",
      webSavePillar2RegistrationQuery,
      {
        input: {
          dfe: null,
          dle: {
            authDocs: null,
            legalNameAr: taxpayer.legalNameAr,
            legalNameEn: taxpayer.legalNameEn,
            taxRegime: taxpayer.taxRegime,
            tin: TIN,
          },
          entities: null,
          group: {
            groupType: null,
            name: null,
            reportingFyEndDate: "2025-12-31",
            reportingFyStartDate: "2025-01-01",
            hasDFE: null,
            isDleUpe: null,
            isDleDfe: null,
            isUpeFileGIR: null,
            isSbsSafeHarbor: null,
            upe: null,
          },
          id: null,
        },
      },
      guidePath,
    );
    checkStatus(resp, 200);
    data = graphqlData(resp);
    const registrationId =
      data && data.savePillar2Registration && data.savePillar2Registration.id;
    thinkTime();

    if (!registrationId) {
      console.log(
        `WebSavePillar2Registration did not return a registration id, skipping remaining steps. Body: ${resp.body}`,
      );
      return;
    }

    const registrationPath = `${tinPath}/services/pillar2-registration/${registrationId}`;
    const step1Path = `${registrationPath}/step1`;
    const step2Path = `${registrationPath}/step2`;
    const step4Path = `${registrationPath}/step4`;
    const summaryPath = `${registrationPath}/summary`;

    resp = postGraphql(
      "WebGetPillar2Registration",
      webGetPillar2RegistrationQuery,
      { id: registrationId },
      step1Path,
    );
    checkStatus(resp, 200);
    thinkTime();

    resp = postGraphql(
      "GetTaxpayerTinDetail",
      getTaxpayerTinDetailQuery,
      { tin: TIN },
      step1Path,
    );
    checkStatus(resp, 200);
    thinkTime();

    resp = postGraphql(
      "WebGetPillar2FileUrl",
      webGetPillar2FileUrlQuery,
      { fileType: "DLE_AUTH_DOC_TEMPLATE" },
      step1Path,
    );
    checkStatus(resp, 200);
    thinkTime();

    resp = postGraphql(
      "WebGetOtherGroupsAssociatedWithEntities",
      webGetOtherGroupsAssociatedWithEntitiesQuery,
      { entityTins: [TIN], currentGroupTin: null },
      step1Path,
    );
    checkStatus(resp, 200);
    thinkTime();

    resp = postUploadFile(registrationId, step1Path);
    checkStatus(resp, 200);
    data = graphqlData(resp);
    const authDocId = data && data.uploadFile && data.uploadFile.documentId;
    const authDocs = authDocId ? [authDocId] : null;
    if (!authDocId) {
      console.log(`uploadFile did not return a documentId. Body: ${resp.body}`);
    }
    thinkTime();

    resp = postGraphql(
      "WebSavePillar2Registration",
      webSavePillar2RegistrationQuery,
      registrationInput(
        registrationId,
        taxpayer,
        authDocs,
        groupInput(),
        dleEntityInput(taxpayer),
      ),
      step1Path,
    );
    checkStatus(resp, 200);
    thinkTime();

    const step2Group = groupInput({
      name: "Test",
      isDleUpe: true,
      isUpeFileGIR: true,
      isSbsSafeHarbor: true,
    });

    resp = postGraphql(
      "WebSavePillar2Registration",
      webSavePillar2RegistrationQuery,
      registrationInput(
        registrationId,
        taxpayer,
        authDocs,
        step2Group,
        dleEntityInput(taxpayer),
      ),
      step2Path,
    );
    checkStatus(resp, 200);
    thinkTime();

    resp = postGraphql(
      "WebGetPillar2FileUrl",
      webGetPillar2FileUrlQuery,
      { fileType: "IN_SCOPE_ENTITY_TEMPLATE" },
      step4Path,
    );
    checkStatus(resp, 200);
    thinkTime();

    for (let i = 0; i < 2; i++) {
      resp = postGraphql(
        "WebGetOtherGroupsAssociatedWithEntities",
        webGetOtherGroupsAssociatedWithEntitiesQuery,
        { entityTins: [TIN], currentGroupTin: null },
        step4Path,
      );
      checkStatus(resp, 200);
      thinkTime();
    }

    resp = postGraphql(
      "WebSavePillar2Registration",
      webSavePillar2RegistrationQuery,
      registrationInput(
        registrationId,
        taxpayer,
        authDocs,
        step2Group,
        dleEntityInput(taxpayer, { isUpe: true, hasIirTaxOblig: true }),
      ),
      step4Path,
    );
    checkStatus(resp, 200);
    thinkTime();

    resp = postGraphql(
      "GetTaxpayerTinDetail",
      getTaxpayerTinDetailQuery,
      { tin: TIN },
      summaryPath,
    );
    checkStatus(resp, 200);
    thinkTime();

    resp = postGraphql(
      "WebGetOtherGroupsAssociatedWithEntities",
      webGetOtherGroupsAssociatedWithEntitiesQuery,
      { entityTins: [TIN], currentGroupTin: null },
      summaryPath,
    );
    checkStatus(resp, 200);
    thinkTime();
  });
}
