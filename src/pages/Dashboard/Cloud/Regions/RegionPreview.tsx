/* eslint-disable no-restricted-globals */
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import { useNavigate } from "react-router-dom";
import RegionPreviewMap from "./RegionPreviewMap";

const RegionPreview = ({ integration }: { integration: string }) => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full h-full cursor-pointer font-light dark:bg-card black-shadow">
      <h4 className="absolute top-4 left-5 text-base dark:text-white">
        Regions
      </h4>
      <article
        data-test="regions"
        className="h-full cursor-pointer"
        onClick={() =>
          navigate(
            `/dashboard/region/details?integration=${integration}&section=rgn`
          )
        }
      >
        <ParentSize>
          {({ width, height }) => (
            <RegionPreviewMap
              integration={integration}
              width={width}
              height={height}
            />
          )}
        </ParentSize>
      </article>
    </section>
  );
};

export default RegionPreview;
