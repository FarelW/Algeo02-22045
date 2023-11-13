import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    justifyContent: "center",

  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  image: {
    width: 150,
    height: 150,
  },
});

const MyDocument = ({ arrayItems, compareFile }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text>Base Image to Compare With</Text>
        <Image style={styles.image} src={`${compareFile}`} />
        <Text>===================================================================</Text>
        {arrayItems.map((item, key) => {
          const name = item.fileName;
          const parts = name.split(".");
          const extension = parts[parts.length - 1].toLowerCase();

          return (
            <View key={key} style={styles.section}>
              <Image
                style={styles.image}
                src={`data:image/${extension};base64,${item.base64}%`}
              />
              <Text>Similarity: {item.Similarity}</Text>
            </View>
          );
        })}
      </Page>
    </Document>
  );
};

export default MyDocument;
