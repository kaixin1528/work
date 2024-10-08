/* eslint-disable no-restricted-globals */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { profileTabs, showVariants } from "../../constants/general";
import EditProfile from "./EditProfile";
import Subscriptions from "./Subscriptions/Subscriptions";
import { checkIsAdmin, decodeJWT, parseURL } from "../../utils/general";
import PageLayout from "../../layouts/PageLayout";
import WatchList from "./WatchList";

const Profile = () => {
  const navigate = useNavigate();
  const parsed = parseURL();
  const jwt = decodeJWT();
  const isAdmin = checkIsAdmin();

  return (
    <PageLayout>
      <motion.main
        variants={showVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col flex-grow content-start w-full h-full z-10 shadow-2xl dark:shadow-expand overflow-auto scrollbar"
      >
        <section className="relative flex flex-grow m-4 dark:bg-card black-shadow">
          {/* profile navigation */}
          <nav className="grid gap-6 p-6 pr-10 content-start text-sm bg-gradient-to-b dark:from-tooltip dark:to-tooltip/0">
            {profileTabs.map((nav, index) => {
              if (
                nav.includes("profile") &&
                !(isAdmin && jwt?.scope.auth_scheme !== "OIDC")
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
                  onClick={() => navigate(`/profile/details?section=${nav}`)}
                >
                  {nav}
                </button>
              );
            })}
          </nav>

          {parsed.section === "subscriptions" && <Subscriptions />}

          {parsed.section?.includes("watch") && <WatchList />}

          {/* edit profile page if user is admin and is not via oidc login */}

          {isAdmin &&
            jwt?.scope.auth_scheme !== "OIDC" &&
            parsed.section?.includes("profile") && <EditProfile />}
        </section>
      </motion.main>
    </PageLayout>
  );
};

export default Profile;
