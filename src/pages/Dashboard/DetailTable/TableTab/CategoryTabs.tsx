/* eslint-disable no-restricted-globals */
import { useNavigate } from "react-router-dom";
import { Inventory } from "../../../../types/dashboard";
import { parseURL } from "../../../../utils/general";
import { useGeneralStore } from "src/stores/general";
import { GetInfraSummary } from "src/services/dashboard/infra";

const CategoryTabs = ({
  setSelectedCategory,
}: {
  setSelectedCategory: (selectedCategory: string) => void;
}) => {
  const navigate = useNavigate();
  const parsed = parseURL();

  const { env } = useGeneralStore();

  const { data } = GetInfraSummary(env, parsed.integration);

  return (
    <article className="flex items-center gap-5 sm:gap-10 dark:text-white">
      <header className="flex items-center gap-5">
        <img
          src={`/general/integrations/${parsed.integration}.svg`}
          alt={String(parsed.clloud)}
          className="hidden sm:block w-10 h-10"
        />
        <h1 className="w-max text-center text-lg">Cloud Infrastructure</h1>
      </header>
      <nav className="flex text-[0.8rem] dark:text-secondary">
        {["Services", "Compute", "Data", "Networking"].map(
          (category: string) => {
            const categoryCount = data?.cloud_infras.inventory.reduce(
              (pV: number, cV: Inventory) =>
                cV.category === category ? pV + cV.count : pV,
              0
            );
            const nodeType =
              data?.cloud_infras.metadata.dash_mapping[category] &&
              Object.keys(data.cloud_infras.metadata.dash_mapping[category])[0];
            return (
              <button
                data-test="group-tabs"
                key={category}
                className={`flex items-center gap-2 px-4 py-2.5 bg-gradient-to-b ${
                  parsed.category === category
                    ? "z-50 dark:text-white dark:from-card dark:to-tab shadow-md dark:shadow-signin"
                    : "dark:text-checkbox dark:hover:text-white dark:from-card dark:to-expand dark:hover:to-tab"
                } duration-100`}
                onClick={() => {
                  if (nodeType) {
                    setSelectedCategory(category);
                    navigate(
                      `/dashboard/table/details?integration=${parsed.integration}&widget=infra&category=${category}&node_type=${nodeType}`
                    );
                  }
                }}
              >
                <img
                  src={`/dashboard/infra/${category.toLowerCase()}.svg`}
                  alt={category}
                  className="w-4 h-4"
                />
                <article className="flex items-center gap-1 capitalize">
                  <span className="hidden sm:block font-medium">
                    {categoryCount}
                  </span>
                  <p className="hidden lg:block">{category}</p>
                </article>
              </button>
            );
          }
        )}
      </nav>
    </article>
  );
};

export default CategoryTabs;
