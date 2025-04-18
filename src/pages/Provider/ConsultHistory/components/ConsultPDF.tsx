import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
// import { Consult } from "../ConsultHistory"; // Adjust the import path based on your project structure

// Define styles
const styles = StyleSheet.create({
  page: { padding: 20 },
  section: { marginBottom: 10 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 12 },
});

// PDF Document Component
const ConsultPDF = ({ consult }: { consult: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Consultation Details</Text>
        <Text style={styles.text}>
          Date: {new Date(consult.date_time).toLocaleDateString()}
        </Text>
        <Text style={styles.text}>
          Patient: {consult.patient.first_name} {consult.patient.last_name}
        </Text>
        <Text style={styles.text}>
          Provider: {consult.provider.first_name} {consult.provider.last_name}
        </Text>
        <Text style={styles.text}>Clinic: {consult.clinic?.name}</Text>
        <Text style={styles.text}>Service: {consult.service?.name}</Text>
        <Text style={styles.text}>Assessment: {consult.assessment}</Text>
      </View>
    </Page>
  </Document>
);

export default ConsultPDF;
