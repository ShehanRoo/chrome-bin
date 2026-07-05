// Generated flow adapted from Grafana k6 Studio recording.
// Required:
//   SESSION_TOKEN='...' k6 run taxofficer-load-test.js

import { group, sleep, check } from "k6";
import http from "k6/http";
import { Counter, Trend } from "k6/metrics";

const BASE_URL = __ENV.BASE_URL || "https://taxofficer-pre-dh2.gta.gov.qa";
const SESSION_COOKIE_NAME = __ENV.SESSION_COOKIE_NAME || "session";
const SESSION_TOKEN = __ENV.SESSION_TOKEN;
const REGISTRATION_ID =
  __ENV.REGISTRATION_ID || "2F5D63D4-F176-F111-AC9A-7C1E5239240F";
const TIN = __ENV.TIN || "5001945716";
const THINK_TIME_MIN_SECONDS = Number(__ENV.THINK_TIME_MIN_SECONDS || 0.5);
const THINK_TIME_MAX_SECONDS = Number(__ENV.THINK_TIME_MAX_SECONDS || 2);

export const options = {
  stages: [
    { target: 4, duration: "15m" },
    { target: 4, duration: "15m" },
    { target: 0, duration: "10m" },
  ],
  summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)"],
};

const endpointTimings = {
  dashboardRedirect: new Trend("endpoint_dashboard_redirect", true),
  dashboardPage: new Trend("endpoint_dashboard_page", true),
  graphqlGetUserProfile: new Trend("endpoint_graphql_get_user_profile", true),
  graphqlGetPillar2RegistrationReport: new Trend(
    "endpoint_graphql_get_pillar2_registration_report",
    true,
  ),
  rscRegistrationRedirect: new Trend("endpoint_rsc_registration_redirect", true),
  graphqlAdminGetPillar2Registration: new Trend(
    "endpoint_graphql_admin_get_pillar2_registration",
    true,
  ),
  graphqlGetTaxpayerTinDetail: new Trend(
    "endpoint_graphql_get_taxpayer_tin_detail",
    true,
  ),
  rscDashboardRedirect: new Trend("endpoint_rsc_dashboard_redirect", true),
  graphqlUnknown: new Trend("endpoint_graphql_unknown", true),
};

const endpointFailures = {
  dashboardRedirect: new Counter("endpoint_dashboard_redirect_failures"),
  dashboardPage: new Counter("endpoint_dashboard_page_failures"),
  graphqlGetUserProfile: new Counter(
    "endpoint_graphql_get_user_profile_failures",
  ),
  graphqlGetPillar2RegistrationReport: new Counter(
    "endpoint_graphql_get_pillar2_registration_report_failures",
  ),
  rscRegistrationRedirect: new Counter(
    "endpoint_rsc_registration_redirect_failures",
  ),
  graphqlAdminGetPillar2Registration: new Counter(
    "endpoint_graphql_admin_get_pillar2_registration_failures",
  ),
  graphqlGetTaxpayerTinDetail: new Counter(
    "endpoint_graphql_get_taxpayer_tin_detail_failures",
  ),
  rscDashboardRedirect: new Counter("endpoint_rsc_dashboard_redirect_failures"),
  graphqlUnknown: new Counter("endpoint_graphql_unknown_failures"),
};

const graphqlEndpointTimings = {
  GetUserProfile: endpointTimings.graphqlGetUserProfile,
  GetPillar2RegistrationReport:
    endpointTimings.graphqlGetPillar2RegistrationReport,
  AdminGetPillar2Registration:
    endpointTimings.graphqlAdminGetPillar2Registration,
  GetTaxpayerTinDetail: endpointTimings.graphqlGetTaxpayerTinDetail,
};

const graphqlEndpointFailures = {
  GetUserProfile: endpointFailures.graphqlGetUserProfile,
  GetPillar2RegistrationReport:
    endpointFailures.graphqlGetPillar2RegistrationReport,
  AdminGetPillar2Registration:
    endpointFailures.graphqlAdminGetPillar2Registration,
  GetTaxpayerTinDetail: endpointFailures.graphqlGetTaxpayerTinDetail,
};

const browserAccept =
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7";

const dashboardRouterStateTree =
  "%5B%22%22%2C%7B%22children%22%3A%5B%5B%22locale%22%2C%22en%22%2C%22d%22%2Cnull%5D%2C%7B%22children%22%3A%5B%22(authenticated)%22%2C%7B%22children%22%3A%5B%22dashboard%22%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2Cnull%2C16%5D";

const registrationRouterStateTree =
  "%5B%22%22%2C%7B%22children%22%3A%5B%5B%22locale%22%2C%22en%22%2C%22d%22%2Cnull%5D%2C%7B%22children%22%3A%5B%22(authenticated)%22%2C%7B%22children%22%3A%5B%22(pillar2)%22%2C%7B%22children%22%3A%5B%22pillar2-registration%22%2C%7B%22children%22%3A%5B%5B%22id%22%2C%222F5D63D4-F176-F111-AC9A-7C1E5239240F%22%2C%22d%22%2Cnull%5D%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2Cnull%2C16%5D";

function htmlParams() {
  return {
    headers: {
      Accept: browserAccept,
    },
  };
}

function graphqlParams(refererPath) {
  return {
    headers: {
      accept: "application/graphql-response+json, application/json",
      "content-type": "application/json",
      Referer: `${BASE_URL}${refererPath}`,
    },
  };
}

function rscParams(nextUrl, routerStateTree, refererPath) {
  return {
    headers: {
      rsc: "1",
      "next-url": nextUrl,
      "next-router-state-tree": routerStateTree,
      Accept: "*/*",
      Referer: `${BASE_URL}${refererPath}`,
    },
  };
}

function postGraphql(body, refererPath) {
  const resp = http.post(
    `${BASE_URL}/api/graphql`,
    JSON.stringify(body),
    graphqlParams(refererPath),
  );
  const metric =
    graphqlEndpointTimings[body.operationName] || endpointTimings.graphqlUnknown;
  const failures =
    graphqlEndpointFailures[body.operationName] ||
    endpointFailures.graphqlUnknown;
  metric.add(resp.timings.duration);

  if (resp.status >= 400) {
    failures.add(1);
  }

  return resp;
}

function getEndpoint(metric, failures, url, params) {
  const resp = http.get(url, params);
  metric.add(resp.timings.duration);

  if (resp.status >= 400) {
    failures.add(1);
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

const getUserProfileQuery = `
    query GetUserProfile {
  getUserProfile {
    asTaxOfficers {
      approverId
      level
      taxRegime
    }
    email
    name
    role
    userId
  }
}
    `;

const getPillar2RegistrationReportQuery = `
    query GetPillar2RegistrationReport {
  getPillar2RegistrationReport {
    registrationId
    registrationStatus
    registrationTaxRegime
    registrationDate
    groupType
    groupNameEn
    groupNameAr
    groupTin
    groupStatus
    dleNameEn
    dleNameAr
  }
}
    `;

const adminGetPillar2RegistrationQuery = `
    query AdminGetPillar2Registration($id: ID!) {
  getPillar2Registration(id: $id) {
    ...Pillar2RegistrationWebFields
    ...Pillar2RegistrationReviewFields
  }
}
    fragment TaxpayerFields on Taxpayer {
  avatarUrl
  email
  name
  userId
}
fragment TaxOfficerFields on TaxOfficer {
  avatarUrl
  email
  level
  name
  officerId
  taxRegime
  userId
}
fragment UploadedFileFields on UploadedFile {
  documentId
  fileName
  url
}
fragment Pillar2RegistrationBaseFields on Pillar2Registration {
  applicant {
    ...TaxpayerFields
  }
  createdAt
  expireAt
  id
  status
  updatedAt
}
fragment Pillar2RegistrationDfeFields on Dfe {
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
}
fragment Pillar2RegistrationDleFields on Dle {
  authDocs {
    ...UploadedFileFields
  }
  legalNameAr
  legalNameEn
  taxRegime
  tin
}
fragment Pillar2RegistrationEntityFields on GroupEntity {
  isDle
  isDfe
  isUpe
  hasIirTaxOblig
  legalNameAr
  legalNameEn
  taxRegime
  tin
}
fragment Pillar2RegistrationGroupFields on Pillar2Group {
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
}
fragment Pillar2RegistrationOtherUpeFields on Pillar2RegistrationListItem {
  fiscalYear
  groupTin
  registrationId
  groupNameAr
  groupNameEn
}
fragment Pillar2RegistrationReviewFields on Pillar2Registration {
  l1Reviewer {
    ...TaxOfficerFields
  }
  l2Reviewer {
    ...TaxOfficerFields
  }
  reviewHistory {
    ...Pillar2RegistrationReviewResultFields
  }
  reviewResult {
    ...Pillar2RegistrationReviewResultFields
  }
}
fragment Pillar2RegistrationReviewCommentFields on Pillar2ReviewComment {
  commentId
  commentEn
  commentAr
}
fragment Pillar2RegistrationReviewResultFields on Pillar2Review {
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
}
fragment Pillar2RegistrationUpeFields on Upe {
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
}
fragment Pillar2RegistrationWebFields on Pillar2Registration {
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

const getTaxpayerTinDetailQuery = `
    query GetTaxpayerTinDetail($tin: String!) {
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
}
    `;

export default function () {
  if (!SESSION_TOKEN) {
    throw new Error(
      "SESSION_TOKEN is required. Run with: SESSION_TOKEN='...' k6 run taxofficer-load-test.js",
    );
  }

  http.cookieJar().set(BASE_URL, SESSION_COOKIE_NAME, SESSION_TOKEN);

  group("Default group", function () {
    let resp = getEndpoint(
      endpointTimings.dashboardRedirect,
      endpointFailures.dashboardRedirect,
      `${BASE_URL}/en/dashboard`,
      htmlParams(),
    );

    resp = getEndpoint(
      endpointTimings.dashboardPage,
      endpointFailures.dashboardPage,
      `${BASE_URL}/en/dashboard`,
      htmlParams(),
    );
    checkStatus(resp, 200);
    thinkTime();

    resp = postGraphql(
      {
        query: getUserProfileQuery,
        operationName: "GetUserProfile",
      },
      "/en/dashboard",
    );
    checkStatus(resp, 200);
    thinkTime();

    resp = postGraphql(
      {
        query: getPillar2RegistrationReportQuery,
        variables: {},
        operationName: "GetPillar2RegistrationReport",
      },
      "/en/dashboard",
    );
    checkStatus(resp, 200);
    thinkTime();

    resp = postGraphql(
      {
        query: getUserProfileQuery,
        operationName: "GetUserProfile",
      },
      "/en/dashboard",
    );
    checkStatus(resp, 200);
    thinkTime();

    resp = postGraphql(
      {
        query: getPillar2RegistrationReportQuery,
        variables: {},
        operationName: "GetPillar2RegistrationReport",
      },
      "/en/dashboard",
    );
    checkStatus(resp, 200);
    thinkTime();

    resp = getEndpoint(
      endpointTimings.rscRegistrationRedirect,
      endpointFailures.rscRegistrationRedirect,
      `${BASE_URL}/pillar2-registration/${REGISTRATION_ID}?_rsc=YwipAjYCJ4h8fwJj`,
      rscParams("/en/dashboard", dashboardRouterStateTree, "/en/dashboard"),
    );

    resp = postGraphql(
      {
        query: adminGetPillar2RegistrationQuery,
        variables: { id: REGISTRATION_ID },
        operationName: "AdminGetPillar2Registration",
      },
      `/en/pillar2-registration/${REGISTRATION_ID}`,
    );
    checkStatus(resp, 200);
    thinkTime();

    resp = postGraphql(
      {
        query: getTaxpayerTinDetailQuery,
        variables: { tin: TIN },
        operationName: "GetTaxpayerTinDetail",
      },
      `/en/pillar2-registration/${REGISTRATION_ID}`,
    );
    checkStatus(resp, 200);
    thinkTime();

    resp = getEndpoint(
      endpointTimings.rscDashboardRedirect,
      endpointFailures.rscDashboardRedirect,
      `${BASE_URL}/dashboard?_rsc=GYqENcPqZgQESlxA`,
      rscParams(
        `/en/pillar2-registration/${REGISTRATION_ID}`,
        registrationRouterStateTree,
        `/en/pillar2-registration/${REGISTRATION_ID}`,
      ),
    );

    resp = postGraphql(
      {
        query: getPillar2RegistrationReportQuery,
        variables: {},
        operationName: "GetPillar2RegistrationReport",
      },
      "/en/dashboard",
    );
    checkStatus(resp, 200);
    thinkTime();
  });
}
