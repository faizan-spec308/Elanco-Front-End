import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../dbService"; 

const cityOptions = [
  "Manchester", "London", "Glasgow", "Birmingham", "Southampton",
  "Nottingham", "Sheffield", "Edinburgh", "Newcastle"
];

const speciesOptions = [
  "Ixodes ricinus", "Dermacentor reticulatus", "Haemaphysalis punctata", "Unknown"
];

const ReportSightingForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    location: "",
    species: ""
  });

  const [errors, setErrors] = useState({});       
  const [warning, setWarning] = useState("");     
  const [status, setStatus] = useState(null);     

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    if (warning) setWarning("");
    if (status === 'error') setStatus(null);
  };

  const validate = () => {
    const newErrors = {};
    const today = new Date().toISOString().split("T")[0];

    if (!formData.date) newErrors.date = "Date is required.";
    if (formData.date > today) newErrors.date = "Date cannot be in the future.";
    if (!formData.time) newErrors.time = "Time is required.";
    if (!formData.location) newErrors.location = "Please select a location.";
    if (!formData.species) newErrors.species = "Please identify the species.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (formData.species === "Unknown" && !warning) {
      setWarning("⚠️ You selected 'Unknown'. Please ensure you have a photo for verification later. Click Submit again to confirm.");
      return;
    }

    setStatus('loading');
    setErrors({});
    setWarning("");

    try {
      await db.addSighting(formData);
      setStatus('success');
      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.formCard}>
        <h2 style={styles.header}>Report a Tick Sighting</h2>

        {status === 'success' && (
          <div style={styles.msgSuccess}>
            ✅ Sighting submitted successfully! Redirecting...
          </div>
        )}

        {status === 'error' && (
          <div style={styles.msgErrorBox}>
            ❌ Database connection failed. Please try again.
          </div>
        )}

        {warning && (
          <div style={styles.msgWarning}>
            {warning}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.row}>
            <div style={styles.halfWidth}>
              <label style={styles.label}>Date Found</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                style={{...styles.input, ...(errors.date ? styles.inputError : {})}}
              />
              {errors.date && <p style={styles.errorText}>{errors.date}</p>}
            </div>

            <div style={styles.halfWidth}>
              <label style={styles.label}>Time Found</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                style={{...styles.input, ...(errors.time ? styles.inputError : {})}}
              />
              {errors.time && <p style={styles.errorText}>{errors.time}</p>}
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Location (Nearest City)</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              style={{...styles.input, ...(errors.location ? styles.inputError : {})}}
            >
              <option value="">Select a city...</option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            {errors.location && <p style={styles.errorText}>{errors.location}</p>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Tick Species</label>
            <select
              name="species"
              value={formData.species}
              onChange={handleChange}
              style={{...styles.input, ...(errors.species ? styles.inputError : {})}}
            >
              <option value="">Select species...</option>
              {speciesOptions.map((sp) => (
                <option key={sp} value={sp}>{sp}</option>
              ))}
            </select>
            {errors.species && <p style={styles.errorText}>{errors.species}</p>}
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => navigate("/")}
              style={styles.backButton}
              disabled={status === 'loading'}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              style={{
                ...styles.submitButton,
                ...(status === 'loading' ? styles.submitButtonDisabled : {}),
                ...(warning ? styles.submitButtonWarning : {})
              }}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? "Submitting..." : warning ? "Confirm Submit" : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    backgroundColor: "#000000", 
    height: "94vh",            
    width: "96vw",             
    overflow: "hidden",         
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
    padding: 0,                 
    boxSizing: "border-box",
  },
  formCard: {
    backgroundColor: "#000000", 
    color: "#e0e0e0",
    padding: "2.5rem",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "600px",
    boxShadow: "0 0 40px rgba(255,255,255,0.05)", 
    border: "1px solid #333",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
    color: "#fff",
    fontSize: "1.8rem",
    fontWeight: "600",
  },
  row: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1.2rem",
  },
  halfWidth: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: "1.2rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    color: "#aaa",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "0.8rem",
    backgroundColor: "#1a1a1a", 
    border: "1px solid #444",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  inputError: {
    borderColor: "#ff5252",
    backgroundColor: "rgba(255, 82, 82, 0.05)",
  },
  errorText: {
    color: "#ff5252",
    fontSize: "0.8rem",
    marginTop: "0.3rem",
    marginBottom: "0",
  },
  msgSuccess: {
    backgroundColor: "rgba(76, 175, 80, 0.15)",
    border: "1px solid #4caf50",
    color: "#81c784",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  msgErrorBox: {
    backgroundColor: "rgba(255, 82, 82, 0.15)",
    border: "1px solid #ff5252",
    color: "#ff8a80",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  msgWarning: {
    backgroundColor: "rgba(255, 193, 7, 0.15)",
    border: "1px solid #ffc107",
    color: "#ffca28",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "2rem",
    gap: "1rem",
  },
  backButton: {
    backgroundColor: "transparent",
    color: "#aaa",
    padding: "0.8rem 1.5rem",
    borderRadius: "8px",
    border: "1px solid #444",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "all 0.2s",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#646cff",
    color: "#fff",
    padding: "0.8rem 1.5rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "background-color 0.2s",
  },
  submitButtonWarning: {
    backgroundColor: "#ffb300",
    color: "#000",
  },
  submitButtonDisabled: {
    backgroundColor: "#444",
    color: "#888",
    cursor: "not-allowed",
  },
};

export default ReportSightingForm;
