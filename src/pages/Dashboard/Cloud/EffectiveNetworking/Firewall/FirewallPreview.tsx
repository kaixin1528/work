/* eslint-disable no-restricted-globals */
import { useNavigate } from "react-router-dom";
import { convertToUTCString } from "src/utils/general";
import { useGeneralStore } from "src/stores/general";
import { GetFirewallPreview } from "src/services/dashboard/effective-networking/firewall";

const FirewallPreview = ({
  integration,
  selectedTab,
}: {
  integration: string;
  selectedTab: string;
}) => {
  const navigate = useNavigate();

  const { env } = useGeneralStore();

  const { data: firewallPreview } = GetFirewallPreview(
    env,
    integration,
    selectedTab
  );

  const ingressRatio =
    firewallPreview?.ingress_total === 0
      ? 0
      : Math.floor(
          100 *
            (firewallPreview?.internet_ingress_counts /
              firewallPreview?.ingress_total)
        );

  const egressRatio =
    firewallPreview?.egress_total === 0
      ? 0
      : Math.floor(
          100 *
            (firewallPreview?.internet_egress_counts /
              firewallPreview?.egress_total)
        );

  return (
    <section
      data-test="firewall-preview"
      className="grid p-4 gap-2 z-50 cursor-pointer"
      onClick={() =>
        navigate(
          `/dashboard/en/details?integration=${integration}&section=firewall`
        )
      }
    >
      <section className="grid grid-cols-2 gap-3 pb-2 content-start border-b dark:border-checkbox">
        <article className="grid content-start gap-1 text-xs">
          <h6 className="text-xs dark:text-checkbox font-medium">Most used</h6>
          {firewallPreview ? (
            firewallPreview?.most_used.length > 0 ? (
              <ul className="grid gap-2 p-2">
                {firewallPreview.most_used.map(
                  (
                    firewall: { source_id: string; resource_counts: number },
                    index: number
                  ) => {
                    return (
                      <li
                        data-test="most-used-firewall"
                        key={index}
                        className="flex items-center gap-1 dark:text-checkbox break-all"
                      >
                        <span className="w-10 text-xl text-center dark:text-white">
                          {firewall.resource_counts}
                        </span>
                        {firewall.source_id}
                      </li>
                    );
                  }
                )}
              </ul>
            ) : (
              <article className="grid p-2 dark:bg-search cursor-pointer">
                <p className="truncate">Not available</p>
              </article>
            )
          ) : null}
        </article>
        <article
          data-test="recent-firewall"
          className="grid gap-2 content-start"
        >
          <article className="flex items-start gap-2 text-xs">
            <img
              src="/graph/alerts/create.svg"
              alt="created"
              className="w-4 h-4"
            />
            <article className="grid gap-2 w-full">
              <h4 className="dark:text-checkbox font-medium">
                Recently created
              </h4>
              {firewallPreview ? (
                firewallPreview?.recently_created.length > 0 ? (
                  <article className="grid p-2 dark:bg-search cursor-pointer">
                    <p className="truncate">
                      {firewallPreview.recently_created[0].node_id}
                    </p>
                    <p className="text-[0.65rem] dark:text-checkbox">
                      {convertToUTCString(
                        firewallPreview.recently_created[0].new_timestamp
                      )}
                    </p>
                  </article>
                ) : (
                  <article className="grid p-2 dark:bg-search cursor-pointer">
                    <p className="truncate">Not available</p>
                  </article>
                )
              ) : null}
            </article>
          </article>
          <article className="flex items-start gap-2 text-xs">
            <img
              src="/dashboard/firewall/bound.svg"
              alt="created"
              className="w-4 h-4"
            />
            <article className="grid gap-2 w-full">
              <h4 className="dark:text-checkbox font-medium">Recently bound</h4>
              {firewallPreview ? (
                firewallPreview?.recently_bound.length > 0 ? (
                  <article className="grid p-2 w-full dark:bg-search cursor-pointer">
                    <p className="truncate">
                      {firewallPreview.recently_bound[0].src_id}
                    </p>
                    <p className="text-[0.65rem] dark:text-checkbox">
                      bound to
                    </p>
                    <p className="truncate">
                      {firewallPreview.recently_bound[0].dst_id}
                    </p>
                  </article>
                ) : (
                  <article className="grid p-2 dark:bg-search cursor-pointer">
                    <p className="truncate">Not available</p>
                  </article>
                )
              ) : null}
            </article>
          </article>
        </article>
      </section>
      <section
        data-test="ingress-egress"
        className="grid grid-cols-2 gap-3 text-xs"
      >
        <article className="grid gap-1">
          <h4 className="dark:text-checkbox font-medium">Ingress</h4>
          {firewallPreview && (
            <article className="flex items-center gap-3">
              <svg
                width="100"
                height="31"
                viewBox="0 0 100 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 0.370117H0V30.6401H100V0.370117Z"
                  fill="url(#paint0_linear_0_1)"
                />
                <rect
                  x="0"
                  y="0"
                  width={ingressRatio}
                  height="31"
                  fill="url(#paint1_linear_0_1)"
                />
                <line
                  x1={ingressRatio}
                  y1="0"
                  x2={ingressRatio}
                  y2="31"
                  stroke="#22B573"
                  strokeMiterlimit="10"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_0_1"
                    x1="50"
                    y1="0.370117"
                    x2="50"
                    y2="29.9701"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#0A4240" />
                    <stop offset="0.5" stopColor="#00142B" />
                    <stop offset="1" stopColor="#0A4240" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_0_1"
                    x1="11.5"
                    y1="0.370117"
                    x2="11.5"
                    y2="30.6301"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#00142B" />
                    <stop offset="0.5" stopColor="#22B573" />
                    <stop offset="1" stopColor="#00142B" />
                  </linearGradient>
                </defs>
              </svg>
              <p> {ingressRatio}%</p>
              <img
                src="/dashboard/firewall/ingress.svg"
                alt="ingress"
                className="w-5 h-5"
              />
            </article>
          )}
        </article>
        <article className="grid gap-1">
          <h4 className="dark:text-checkbox font-medium">Egress</h4>
          {firewallPreview && (
            <article className="flex items-center gap-3">
              <svg
                width="100"
                height="31"
                viewBox="0 0 100 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100.08 0.370117H0.0800781V30.6401H100.08V0.370117Z"
                  fill="url(#paint0_linear_3349_8570)"
                />
                <rect
                  x="0"
                  y="0"
                  width={egressRatio}
                  height="31"
                  fill="url(#paint1_linear_3349_8570)"
                />
                <line
                  x1={egressRatio}
                  y1="0"
                  x2={egressRatio}
                  y2="31"
                  stroke="#FF0000"
                  strokeMiterlimit="10"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_3349_8570"
                    x1="50.0801"
                    y1="0.370117"
                    x2="50.0801"
                    y2="29.9701"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#3D0F21" />
                    <stop offset="0.5" stopColor="#00142B" />
                    <stop offset="1" stopColor="#3D0F21" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_3349_8570"
                    x1="1.08008"
                    y1="0.370117"
                    x2="1.08008"
                    y2="30.6301"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#00142B" />
                    <stop offset="0.5" stopColor="#FF0000" />
                    <stop offset="1" stopColor="#00142B" />
                  </linearGradient>
                </defs>
              </svg>
              <p>{egressRatio}%</p>
              <img
                src="/dashboard/firewall/egress.svg"
                alt="egress"
                className="w-5 h-5"
              />
            </article>
          )}
        </article>
      </section>
    </section>
  );
};

export default FirewallPreview;
