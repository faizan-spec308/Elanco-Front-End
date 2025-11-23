import { BrowserRouter, Routes, Route } from "react-router-dom";
import MapView from "./components/MapView";
import EducationPanel from "./components/EducationPanel";
import ReportSightingForm from "./components/ReportSightingForm";

function App() {
  return (
    <BrowserRouter>
      <div style={styles.appContainer}>
        {/* Navigation / Header could go here */}
        
        <div style={styles.contentWrapper}>
          <Routes>
            <Route
              path="/"
              element={
                <div style={styles.dashboardLayout}>
                  <MapView />
                  <div style={styles.educationSection}>
                    <EducationPanel />
                  </div>
                </div>
              }
            />
            <Route path="/report" element={<ReportSightingForm />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

const styles = {
  appContainer: {
    backgroundColor: "#111827", // Deep dark background
    minHeight: "100vh",
    color: "#F3F4F6",
    fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  contentWrapper: {
    width: "100%",
    maxWidth: "1600px",
    margin: "0 auto",
    padding: "20px",
    boxSizing: "border-box",
  },
  dashboardLayout: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
  educationSection: {
    marginTop: "1rem",
  }
};

export default App;