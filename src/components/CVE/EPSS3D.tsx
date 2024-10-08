import React from "react";
import Plot from "react-plotly.js";
import { Get3DEPSS } from "src/services/general/cve";

const EPSS3D = ({ selectedCVE }: { selectedCVE: string }) => {
  const { data: epss } = Get3DEPSS(selectedCVE);

  const data = epss
    ? [
        {
          type: "scatter3d",
          mode: "lines",
          hovertemplate: "<b>%{x}</b><br>EPSS: %{y}<br>Percentile: %{z}",
          showlegend: false,
          x: epss.publish_time,
          y: epss.percentile,
          z: epss.epss,
        },
      ]
    : [];

  return (
    <>
      {epss ? (
        data.length > 0 ? (
          <Plot
            data={data as any}
            layout={{
              autosize: true,
              title: "3D EPSS",
              paper_bgcolor: "#021C35",
              plot_bgcolor: "#021C35",
              font: {
                color: "FFF",
              },
              margin: {
                b: 30,
                t: 100,
              },
              scene: {
                xaxis: {
                  type: "date",
                  title: "Date",
                  color: "FFF",
                  titlefont: {
                    color: "white",
                  },
                  tickfont: {
                    color: "white",
                  },
                },
                yaxis: {
                  title: "EPSS Score",
                  color: "FFF",
                  titlefont: {
                    color: "white",
                  },
                  tickfont: {
                    color: "white",
                  },
                },
                zaxis: {
                  title: "Percentile",
                  color: "FFF",
                  titlefont: {
                    color: "white",
                  },
                  tickfont: {
                    color: "white",
                  },
                },
              },
            }}
            config={{ displayModeBar: false }}
          />
        ) : (
          <p>No 3D EPSS available</p>
        )
      ) : null}
    </>
  );
};

export default EPSS3D;
