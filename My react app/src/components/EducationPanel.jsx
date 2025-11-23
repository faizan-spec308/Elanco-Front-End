import { useState } from "react";

function EducationPanel() {
  const [tab, setTab] = useState("species");

  return (
    <div style={styles.panelContainer}>
      
      <div style={styles.tabContainer}>
        <button 
          onClick={() => setTab("species")} 
          style={tab === "species" ? styles.activeTab : styles.inactiveTab}
        >
          🦠 Species Guide
        </button>
        <button 
          onClick={() => setTab("prevention")} 
          style={tab === "prevention" ? styles.activeTab : styles.inactiveTab}
        >
          🛡️ Prevention Tips
        </button>
      </div>

    
      <div style={styles.contentArea}>
        {tab === "species" ? (
          <div style={styles.fadeIn}>
            <h3 style={styles.heading}>Common Tick Species in the UK</h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <span style={styles.bulletAccent}></span>
                <div>
                  <strong style={styles.term}>Ixodes ricinus (Sheep Tick)</strong>
                  <p style={styles.description}>Primary threat to sheep and cattle. Transmits Louping Ill and Tick-borne fever.</p>
                </div>
              </li>
              <li style={styles.listItem}>
                <span style={{...styles.bulletAccent, background: '#10B981'}}></span>
                <div>
                  <strong style={styles.term}>Ixodes hexagonus (Hedgehog Tick)</strong>
                  <p style={styles.description}>Common on hunting dogs and wildlife. Can cause skin irritation in pets.</p>
                </div>
              </li>
              <li style={styles.listItem}>
                <span style={{...styles.bulletAccent, background: '#F59E0B'}}></span>
                <div>
                  <strong style={styles.term}>Dermacentor reticulatus (Meadow Tick)</strong>
                  <p style={styles.description}>High risk for dogs. Known vector for Canine Babesiosis (fatal if untreated).</p>
                </div>
              </li>
            </ul>
          </div>
        ) : (
          <div style={styles.fadeIn}>
            <h3 style={styles.heading}>Animal & Livestock Protection</h3>
            <div style={styles.gridTips}>
              <div style={styles.tipCard}>
                <div style={styles.icon}>🐕</div>
                <strong>Companion Animals</strong>
                <p style={styles.tipText}>Use vet-approved collars or spot-on treatments (e.g., fipronil/permethrin) year-round.</p>
              </div>
              <div style={styles.tipCard}>
                <div style={styles.icon}>🐑</div>
                <strong>Livestock (Sheep/Cattle)</strong>
                <p style={styles.tipText}>Apply pour-ons or use dip baths during peak seasons (Spring/Autumn) to reduce infestation.</p>
              </div>
              <div style={styles.tipCard}>
                <div style={styles.icon}>🌾</div>
                <strong>Pasture Management</strong>
                <p style={styles.tipText}>Clear scrub and bracken where ticks thrive. Keep grazing grass shorter to reduce habitat.</p>
              </div>
              <div style={styles.tipCard}>
                <div style={styles.icon}>🔍</div>
                <strong>Physical Inspection</strong>
                <p style={styles.tipText}>Check animals' ears, udders, and necks daily. Remove ticks manually before they engorge.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  panelContainer: {
    background: "#1F2937",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid #374151",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    color: "#F3F4F6",
  },
  tabContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    borderBottom: "1px solid #374151",
    paddingBottom: "15px",
  },
  activeTab: {
    background: "#4F46E5",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "20px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  inactiveTab: {
    background: "transparent",
    color: "#9CA3AF",
    border: "1px solid #374151",
    padding: "8px 16px",
    borderRadius: "20px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  contentArea: {
    minHeight: "200px",
  },
  fadeIn: {
    animation: "fadeIn 0.3s ease-in",
  },
  heading: {
    marginTop: 0,
    color: "#E5E7EB",
    fontSize: "1.2rem",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    display: "flex",
    gap: "15px",
    background: "#111827",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "10px",
    border: "1px solid #374151",
  },
  bulletAccent: {
    minWidth: "4px",
    background: "#EF4444",
    borderRadius: "4px",
  },
  term: {
    display: "block",
    marginBottom: "4px",
    color: "#F3F4F6",
  },
  description: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#9CA3AF",
  },
  gridTips: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "15px",
  },
  tipCard: {
    background: "#111827",
    padding: "15px",
    borderRadius: "12px",
    textAlign: "center",
    border: "1px solid #374151",
  },
  icon: {
    fontSize: "1.5rem",
    marginBottom: "8px",
    display: "block",
  },
  tipText: {
    fontSize: "0.85rem",
    color: "#9CA3AF",
    marginTop: "5px",
    lineHeight: "1.4",
  },
};

export default EducationPanel;
