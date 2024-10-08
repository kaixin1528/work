/* eslint-disable no-restricted-globals */
import { scaleQuantize } from "@visx/scale";
import { Mercator, Graticule } from "@visx/geo";
import * as topojson from "topojson-client";
import topology from "../../../../world-topo.json";
import { geoMercator } from "d3-geo";
import { Region } from "../../../../types/dashboard";
import { regionMarkers } from "../../../../constants/dashboard";
import { useGraphStore } from "src/stores/graph";
import { useGeneralStore } from "src/stores/general";
import { GetActiveRegions } from "src/services/dashboard/region";

export const background = "#021C35";

export type GeoMercatorProps = {
  integration: string;
  width: number;
  height: number;
  events?: boolean;
};

interface FeatureShape {
  type: "Feature";
  id: string;
  geometry: { coordinates: [number, number][][]; type: "Polygon" };
  properties: { name: string };
}

// @ts-ignore
const world = topojson.feature(topology, topology.objects.units) as {
  type: "FeatureCollection";
  features: FeatureShape[];
};

const color = scaleQuantize({
  domain: [
    Math.min(...world.features.map((f) => f.geometry.coordinates.length)),
    Math.max(...world.features.map((f) => f.geometry.coordinates.length)),
  ],
  range: ["#41576D"],
});

const RegionMap = ({ integration, width, height }: GeoMercatorProps) => {
  const { env } = useGeneralStore();
  const { setElementType, setSelectedNode, graphInfo, setGraphInfo } =
    useGraphStore();

  const { data: regions } = GetActiveRegions(env, integration);

  const centerX = width / 2;
  const centerY = height / 2;
  const scale = (width / 630) * 100;

  const projection = geoMercator()
    .translate([centerX, centerY + 50])
    .scale(scale);

  return width < 10 ? null : (
    <svg data-test="region-map" width={width} height={height}>
      <Mercator<FeatureShape>
        data={world.features}
        scale={scale}
        translate={[centerX, centerY + 50]}
      >
        {(mercator) => (
          <g>
            <Graticule
              graticule={(g) => mercator.path(g) || ""}
              stroke="rgba(33,33,33,0.05)"
            />
            {mercator.features.map(({ feature, path }, i) => {
              return (
                <path
                  key={`map-feature-${i}`}
                  d={path || ""}
                  fill={color(feature.geometry.coordinates.length)}
                  stroke={background}
                  strokeWidth={0.5}
                />
              );
            })}
            <g>
              {regions?.map((region: Region, index: number) => {
                if (!regionMarkers[integration][region.graph_artifact_id])
                  return null;
                return (
                  <circle
                    data-test="region"
                    key={index}
                    r={8}
                    fill="#61AE25"
                    fillOpacity={
                      region.activity_level === "HIGH"
                        ? 1
                        : region.activity_level === "MEDIUM"
                        ? 0.6
                        : 0.2
                    }
                    stroke={region.activity_level === "LOW" ? "#7894B0" : ""}
                    transform={`translate(${projection([
                      regionMarkers[integration][region.graph_artifact_id].lng,
                      regionMarkers[integration][region.graph_artifact_id].lat,
                    ])})`}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setElementType("node");
                      setSelectedNode({
                        id: region.graph_artifact_id,
                      });
                      setGraphInfo({
                        ...graphInfo,
                        showPanel: true,
                      });
                    }}
                  />
                );
              })}
            </g>
          </g>
        )}
      </Mercator>
    </svg>
  );
};

export default RegionMap;
