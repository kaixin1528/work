/* eslint-disable no-restricted-globals */
import Integrations from "./Integrations/Integrations";
import Organization from "./Organization/Organization";
import { useNavigate } from "react-router-dom";
import Groups from "./Groups/Groups";
import { motion } from "framer-motion";
import { showVariants } from "../../constants/general";
import Users from "./Users/Users";
import Roles from "./Roles/Roles";
import Environments from "./Environments/Environments";
import { checkSuperOrSiteAdmin, parseURL } from "../../utils/general";
import PageLayout from "../../layouts/PageLayout";
import { GetEnabledModules } from "src/services/general/general";
import PrivacyReview from "./PrivacyReview/PrivacyReview";
import BCM from "./BCM";

const Settings = () => {
  const navigate = useNavigate();
  const parsed = parseURL();
  const isSuperOrSiteAdmin = checkSuperOrSiteAdmin();

  const navItems = isSuperOrSiteAdmin
    ? ["organization", "users", "roles"]
    : [
        "organization",
        "integrations",
        "environments",
        "groups",
        "users",
        "roles",
        "privacy review",
        "bcm",
      ];

  const { data: enabledModules } = GetEnabledModules();

  return (
    <PageLayout>
      <motion.main
        variants={showVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col flex-grow content-start w-full h-full z-10 shadow-2xl dark:shadow-expand overflow-auto scrollbar"
      >
        <section className="relative flex flex-grow m-4 dark:bg-card black-shadow overflow-auto scrollbar">
          {/* settings navigation */}
          <nav className="grid gap-6 p-6 pr-10 content-start text-sm bg-gradient-to-b dark:from-tooltip dark:to-tooltip/0">
            {navItems.map((nav, index) => {
              if (
                !enabledModules?.includes("EXTRA") &&
                ["environments"].includes(nav)
              )
                return null;
              return (
                <button
                  key={index}
                  className={`text-left tracking-wide uppercase ${
                    parsed.section === nav
                      ? "w-max dark:text-white border-b-2 dark:border-signin"
                      : "dark:text-settings-nav"
                  }`}
                  onClick={() =>
                    navigate(
                      `/settings/details?section=${nav.replace("&", "%26")}`
                    )
                  }
                >
                  {nav}
                </button>
              );
            })}
          </nav>

          {/* organization page */}
          {parsed.section === "organization" && <Organization />}

          {/* integrations page */}
          {parsed.section === "integrations" && (
            <section className="grid w-full overflow-auto scrollbar">
              <Integrations />
            </section>
          )}

          {parsed.section === "environments" && <Environments />}

          {/* groups page */}
          {parsed.section === "groups" && (
            <section className="grid w-full">
              <Groups />
            </section>
          )}

          {/* users page */}
          {parsed.section === "users" && <Users />}

          {/* roles page */}
          {parsed.section === "roles" && <Roles />}

          {parsed.section === "privacy review" && <PrivacyReview />}

          {parsed.section === "bcm" && <BCM />}
        </section>
      </motion.main>
    </PageLayout>
  );
};

export default Settings;
