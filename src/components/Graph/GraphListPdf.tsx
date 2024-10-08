import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { GraphEdge, GraphNode } from "src/types/general";
import { convertToUTCString } from "src/utils/general";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    alignContent: "flex-start",
    backgroundColor: "#0d243d",
    padding: 10,
    fontFamily: "Lato",
  },
  section: {
    padding: 5,
    flexGrow: 1,
    alignContent: "flex-start",
    fontSize: "16px",
  },
  list: {
    flexGrow: 1,
    alignContent: "flex-start",
    padding: 5,
  },
  snapshotTime: {
    color: "#FFF",
  },
  elementType: {
    paddingTop: 10,
    color: "#FFF",
    fontSize: "14px",
  },
  integrationType: {
    fontSize: "12px",
    backgroundColor: "#26a4a44d",
    border: "1",
    borderColor: "#26a4a4",
    padding: 5,
    paddingHorizontal: 10,
    marginTop: "10",
    color: "#FFF",
  },
  nodeType: {
    fontSize: "12px",
    backgroundColor: "#29abe24d",
    border: "1",
    borderColor: "#29ABE2",
    padding: 5,
    paddingHorizontal: 10,
    color: "#FFF",
  },
  critical: {
    flexDirection: "row",
    fontSize: "10px",
    gap: "2",
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: "#DC0000",
    color: "#FFF",
  },
  high: {
    flexDirection: "row",
    fontSize: "10px",
    gap: "2",
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: "#FD8C00",
  },
  source: {
    flexDirection: "row",
    fontSize: "10px",
    gap: "2",
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: "#22B573",
  },
  qualifying: {
    flexDirection: "row",
    fontSize: "10px",
    gap: "2",
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: "#FFCC33",
  },
  regular: {
    flexDirection: "row",
    fontSize: "10px",
    gap: "2",
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: "#23394F",
    color: "#FFF",
  },
  removed: {
    flexDirection: "row",
    fontSize: "10px",
    gap: "2",
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: "#FF3131",
  },
  created: {
    flexDirection: "row",
    fontSize: "10px",
    gap: "2",
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: "#00AC46",
  },
  modified: {
    flexDirection: "row",
    fontSize: "10px",
    gap: "3",
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: "#FFFDD0",
  },
});

Font.register({
  family: "Lato",
  src: `https://fonts.gstatic.com/s/lato/v16/S6uyw4BMUTPHjx4wWw.ttf`,
});

const GraphListPDF = ({
  filteredIntegrationTypes,
  nodes,
  edges,
  curSnapshotTime,
  searchString,
}: {
  filteredIntegrationTypes: GraphNode[];
  nodes: any;
  edges: any;
  curSnapshotTime: number;
  searchString: string;
}) => {
  const filteredEdges = edges?.filter((edge: GraphEdge) =>
    edges?.length > 0 ? edge.data?.diffEdge : true
  );
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.snapshotTime}>
            {convertToUTCString(curSnapshotTime)} Snapshot
          </Text>
          {searchString !== "" && (
            <Text style={styles.elementType}>Query string: {searchString}</Text>
          )}
          <Text style={styles.elementType}>Resources</Text>
          <View style={styles.section}>
            {filteredIntegrationTypes?.map((account: GraphNode) => {
              const filteredNodeTypes = [
                ...new Set(
                  nodes
                    .filter(
                      (node: GraphNode) =>
                        node.integrationType === account.integrationType &&
                        (edges?.length > 0 ? node.data?.diffNode : true)
                    )
                    .reduce((pV: string[], cV: GraphNode) => {
                      if (!cV.nodeType?.includes("AGG"))
                        return [...pV, cV.nodeType];
                      else return [...pV];
                    }, [])
                ),
              ] as string[];
              if (filteredNodeTypes?.length === 0) return null;
              return (
                <View key={account.integrationType} style={styles.list}>
                  <Text style={styles.integrationType}>
                    {account.integrationType}
                  </Text>
                  <View style={styles.list}>
                    {filteredNodeTypes.map((nodeType) => {
                      const filteredNodes = nodes.filter(
                        (node: GraphNode) =>
                          node.integrationType === account.integrationType &&
                          node.nodeType === nodeType &&
                          (edges?.length > 0 ? node.data?.diffNode : true)
                      );

                      const nodeTypeName = nodes.find(
                        (node: GraphNode) =>
                          node.integrationType === account.integrationType &&
                          node.nodeType === nodeType
                      )?.nodeTypeName;
                      return (
                        <View key={nodeType} style={styles.list}>
                          <Text style={styles.nodeType}>
                            {nodeTypeName} ({filteredNodes.length})
                          </Text>
                          <View style={styles.list}>
                            {filteredNodes.map((node: GraphNode) => {
                              const annotation =
                                node.data?.simulationAnnotation?.annotation ||
                                node.data?.graphAnnotation?.annotation ||
                                "";

                              const diffAction =
                                node.data?.diffNode?.action || "";
                              return (
                                <View
                                  key={node.id}
                                  style={
                                    styles[annotation.toLowerCase()] ||
                                    styles[diffAction.toLowerCase()] ||
                                    styles[node.data?.isSearched || ""] ||
                                    styles.regular
                                  }
                                >
                                  <Text>•</Text>
                                  <Text>{node.id}</Text>
                                </View>
                              );
                            })}
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </Page>

      {filteredEdges?.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.elementType}>
              Relations ({filteredEdges.length})
            </Text>
            <View style={styles.section}>
              {filteredEdges.map((edge: GraphEdge) => {
                const annotation =
                  edge.data?.simulationAnnotation?.annotation ||
                  edge.data?.graphAnnotation?.annotation ||
                  "";
                const diffAction = edge.data?.diffEdge?.action || "";
                return (
                  <View
                    key={edge.id}
                    style={
                      styles[annotation.toLowerCase()] ||
                      styles[diffAction.toLowerCase()] ||
                      styles.regular
                    }
                  >
                    <Text>•</Text>
                    <Text>{edge.id}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </Page>
      )}
    </Document>
  );
};

export default GraphListPDF;
