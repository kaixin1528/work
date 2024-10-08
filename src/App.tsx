/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactFlowProvider } from "reactflow";
import KnowledgeGraph from "./pages/KnowledgeGraph/KnowledgeGraph";
import Dashboard from "./pages/Dashboard/Dashboard";
import DetailTable from "./pages/Dashboard/DetailTable/DetailTable";
import Login from "./pages/Login/Login";
import NotFound from "./pages/Error/NotFound";
import Forbidden from "./pages/Error/Forbidden";
import InternalServer from "./pages/Error/InternalServer";
import Detection from "./pages/Detection";
import Inference from "./pages/Inference";
import Investigation from "./pages/Investigation/Investigation";
import RCA from "./pages/RCA";
import Recommendation from "./pages/Recommendation";
import Settings from "./pages/Settings/Settings";
import Simulation from "./pages/Simulation/Simulation";
import Diary from "./pages/Investigation/Diary/Diary";
import { ErrorBoundary } from "react-error-boundary";
import Regions from "./pages/Dashboard/Cloud/Regions/Regions";
import Activity from "./pages/Dashboard/Cloud/Activity/Activity";
import ResetPassword from "./pages/ResetPassword";
import { useEffect } from "react";
import Summaries from "./pages/Summaries/Summaries";
import Documentation from "./pages/Documentation/Documentation";
import Profile from "./pages/Profile/Profile";
import SessionTimeout from "./components/General/SessionTimeout";
import { decodeJWT, parseURL } from "./utils/general";
import { useIdleTimer } from "react-idle-timer";
import { excludePaths, googleClientID } from "./constants/general";
import AxiosInterceptor from "./components/General/AxiosInterceptor";
import { GoogleOAuthProvider } from "@react-oauth/google";
import BadRequest from "./pages/Error/BadRequest";
import NoInternetConnection from "./pages/Error/NoInternetConnection";
import ServerUnavailable from "./pages/Error/ServerUnavailable";
import React from "react";
import queryString from "query-string";
import GettingStarted from "./pages/GettingStarted/GettingStarted";
import AlertAnalysis from "./components/AlertAnalysis/AlertAnalysis";
import ENDetail from "./pages/Dashboard/Cloud/EffectiveNetworking/ENDetail";
import Document from "./pages/RegulationPolicy/Document/Document";
import CVEDetail from "./components/CVE/CVEDetail";
import CWEDetail from "./components/CWE/CWEDetail";
import RegularMapping from "./pages/RegulationPolicy/Document/RegularMapping/RegularMapping";
import PolicyDrift from "./pages/RegulationPolicy/Document/PolicyDrift/PolicyDrift";
import FinishGithubInstallation from "./pages/FinishGithubInstallation";
import { env } from "src/env";
import VendorAssessment from "./pages/ThirdPartyRisk/VendorAssessment/Review/Review";
import PrivacyReview from "./pages/ThirdPartyRisk/PrivacyReview/Review/Review";
import Audit from "./pages/AuditsAssessments/InternalAudit/Audit/Audit";
import ThirdPartyRisk from "./pages/ThirdPartyRisk/ThirdPartyRisk";
import BusinessContinuity from "./pages/BusinessContinuity/BusinessContinuity";
import AuditsAssessments from "./pages/AuditsAssessments/AuditsAssessments";
import RiskCompliance from "./pages/RegulationPolicy/RegulationPolicy";
import Action from "./pages/RiskIntelligence/EnforcementActions/Action/Action";
import RiskIntelligence from "./pages/RiskIntelligence/RiskIntelligence";
import RiskAssessment from "./pages/RegulationPolicy/Document/RiskAssessment/RiskAssessment";
import Procedure from "./pages/BusinessContinuity/SOP/Procedure/Procedure";
import SOPDrift from "./pages/BusinessContinuity/SOP/Procedure/ProcedureDetail/SOPDrift/SOPDrift";
import ImpactAnalysis from "./pages/BusinessContinuity/BIA/ImpactAnalysis/ImpactAnalysis";
import Vendor from "./pages/ThirdPartyRisk/VendorsAndPartners/Vendors/Vendor/Vendor";
import Livechat from "./components/General/LiveChat";
import AgreementContractReviews from "./pages/AgreementContractReviews/AgreementContractReviewList";
import AgreementContractReview from "./pages/AgreementContractReviews/AgreementContractReview/AgreementContractReview";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: 3.6e6,
      staleTime: 3.6e6,
      retry: 0,
    },
  },
});

function App() {
  const navigate = useNavigate();
  const jwt = decodeJWT();
  const { pathname } = useLocation();
  const parsed = parseURL();

  const onIdle = () => {
    // logs out user on inactivity
    if (
      !excludePaths.includes(window.location.pathname) &&
      Date.now() > jwt?.exp * 1000
    ) {
      sessionStorage.clear();
      sessionStorage.sessionTimeout = "true";
      window.location.assign("/signin");
    }
  };

  useIdleTimer({
    timeout: Number(env.REACT_APP_ACTIVITY_TIME_LIMIT),
    promptTimeout: 0,
    onIdle,
  });

  useEffect(() => {
    // if (
    //   sessionStorage.theme === "dark" ||
    //   (!("theme" in sessionStorage) &&
    //     window.matchMedia("(prefers-color-scheme: dark)").matches)
    // ) {
    //   document.documentElement.classList.add("dark");
    // } else {
    //   document.documentElement.classList.remove("dark");
    // }
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    if (
      !sessionStorage.accessToken &&
      window.location.pathname !== "/signin" &&
      !parsed.token
    ) {
      sessionStorage.previousPath = `${pathname}?${queryString.stringify(
        parsed
      )}`;
      navigate("/");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactFlowProvider>
        <AxiosInterceptor>
          <GoogleOAuthProvider clientId={googleClientID || ""}>
            <ErrorBoundary
              key={location.pathname}
              FallbackComponent={InternalServer}
            >
              <section className="relative flex flex-col flex-grow w-full h-full font-noto-sans">
                <SessionTimeout />

                {sessionStorage.accessToken && env.REACT_APP_WEBSITE_TOKEN && (
                  <Livechat />
                )}

                <Routes>
                  <Route path="/" element={<Navigate replace to="/signin" />} />
                  <Route path="/signin" element={<Login />} />
                  <Route
                    path="reset_password/:params"
                    element={<ResetPassword />}
                  />
                  <Route
                    path="/documentation/:params"
                    element={<Documentation />}
                  />
                  <Route path="/profile/:params" element={<Profile />} />

                  <Route path="/getting-started" element={<GettingStarted />} />

                  <Route path="/graph">
                    <Route path="summary" element={<KnowledgeGraph />} />
                    <Route
                      path="alert-analysis/:params"
                      element={<AlertAnalysis />}
                    />
                  </Route>

                  <Route path="/dashboard">
                    <Route path="" element={<Navigate replace to="/404" />} />
                    <Route path="summary" element={<Dashboard />} />
                    <Route path="table/:params" element={<DetailTable />} />
                    <Route path="region/:params" element={<Regions />} />
                    <Route path="en/:params" element={<ENDetail />} />
                    <Route path="activity/:params" element={<Activity />} />
                  </Route>

                  <Route path="/investigation">
                    <Route path="" element={<Navigate replace to="/404" />} />
                    <Route path="summary" element={<Investigation />} />
                    <Route path="diary/:params" element={<Diary />} />
                  </Route>

                  <Route path="/simulation/summary" element={<Simulation />} />

                  <Route path="/third-party-risk">
                    <Route path="summary" element={<ThirdPartyRisk />} />
                    <Route
                      path="vendors-partners/:params"
                      element={<Vendor />}
                    />
                    <Route
                      path="vendors-assessments/:params"
                      element={<VendorAssessment />}
                    />
                    <Route path="privacy/:params" element={<PrivacyReview />} />
                  </Route>

                  <Route path="/business-continuity">
                    <Route path="summary" element={<BusinessContinuity />} />
                    <Route path="sop/:params" element={<Procedure />} />
                    <Route path="bia/:params" element={<ImpactAnalysis />} />
                    <Route
                      path="sop/policy-drift/:params"
                      element={<SOPDrift />}
                    />
                  </Route>

                  <Route path="/regulation-policy">
                    <Route path="summary" element={<RiskCompliance />} />
                    <Route path="document/:params" element={<Document />} />
                    <Route
                      path="document/policy-drift/:params"
                      element={<PolicyDrift />}
                    />
                    <Route
                      path="document/policy-drift-risk-assessment/:params"
                      element={<RiskAssessment />}
                    />
                    <Route
                      path="document/mapping"
                      element={<RegularMapping />}
                    />
                  </Route>

                  <Route path="/risk-intelligence">
                    <Route path="summary" element={<RiskIntelligence />} />
                    <Route path="action/:params" element={<Action />} />
                  </Route>

                  <Route path="/audits-assessments">
                    <Route path="summary" element={<AuditsAssessments />} />
                    <Route path="audit/:params" element={<Audit />} />
                  </Route>

                  <Route path="/agreement-contract-review">
                    <Route
                      path="summary"
                      element={<AgreementContractReviews />}
                    />
                    <Route
                      path="agreement/:params"
                      element={<AgreementContractReview />}
                    />
                  </Route>

                  <Route path="/grc/mapping" element={<RegularMapping />} />

                  <Route path="/detection/summary" element={<Detection />} />
                  <Route path="/inference/summary" element={<Inference />} />
                  <Route path="/rca/summary" element={<RCA />} />
                  <Route
                    path="/recommendation/summary"
                    element={<Recommendation />}
                  />
                  <Route path="/summaries/:params" element={<Summaries />} />
                  <Route path="/settings/:params" element={<Settings />} />

                  <Route path="/cves/:params" element={<CVEDetail />} />
                  <Route path="/cwes/:params" element={<CWEDetail />} />

                  <Route path="*" element={<Navigate replace to="/404" />} />
                  <Route path="/400" element={<BadRequest />} />
                  <Route path="/404" element={<NotFound />} />
                  <Route path="/403" element={<Forbidden />} />
                  <Route path="/500" element={<InternalServer />} />
                  <Route path="/502" element={<NoInternetConnection />} />
                  <Route path="/503" element={<ServerUnavailable />} />
                  <Route
                    path="/finish-github-installation"
                    element={<FinishGithubInstallation />}
                  />
                </Routes>
              </section>
            </ErrorBoundary>
          </GoogleOAuthProvider>
        </AxiosInterceptor>
      </ReactFlowProvider>
    </QueryClientProvider>
  );
}

export default App;
