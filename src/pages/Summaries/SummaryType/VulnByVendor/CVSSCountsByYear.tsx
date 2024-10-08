import React from "react";
import Plot from "react-plotly.js";

const CVSSCountsByYear = ({ cpeAnalytics }: { cpeAnalytics: any }) => {
  const data = cpeAnalytics.data
    ? [
        {
          type: "scatter3d",
          mode: "markers",
          hovertemplate: "<b>%{x}</b><br>Count: %{y}<br>CVSS Score: %{z}",
          showlegend: false,
          x: cpeAnalytics.data.year,
          y: cpeAnalytics.data.count,
          z: cpeAnalytics.data.count_metadata,
        },
      ]
    : [];

  return (
    <>
      {cpeAnalytics ? (
        data.length > 0 ? (
          <Plot
            data={data as any}
            layout={{
              autosize: true,
              title: "CVSS Counts By Year",
              titlefont: { size: 15 },
              paper_bgcolor: "#0C253D",
              plot_bgcolor: "#0C253D",
              font: {
                color: "FFF",
              },
              margin: {
                b: 30,
                t: 100,
              },
              scene: {
                xaxis: {
                  type: "category",
                  title: "Year",
                  color: "FFF",
                  titlefont: {
                    color: "white",
                  },
                  tickfont: {
                    color: "white",
                  },
                },
                yaxis: {
                  title: "Count",
                  color: "FFF",
                  titlefont: {
                    color: "white",
                  },
                  tickfont: {
                    color: "white",
                  },
                },
                zaxis: {
                  title: "CVSS Score",
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
          <p>No CVSS scores available</p>
        )
      ) : null}
    </>
  );
};

export default CVSSCountsByYear;
