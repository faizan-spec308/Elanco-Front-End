import { MapContainer, TileLayer, CircleMarker } from "react-leaflet";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import tickData from "../assets/tickdata.csv?url";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import { db } from "../dbService";

import {
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis
} from "recharts";

const cityCoords = {
  Manchester: [53.4808, -2.2426],
  London: [51.5074, -0.1278],
  Glasgow: [55.8642, -4.2518],
  Birmingham: [52.4862, -1.8904],
  Southampton: [50.9097, -1.4043],
  Nottingham: [52.9548, -1.1581],
  Sheffield: [53.3811, -1.4701],
  Edinburgh: [55.9533, -3.1883],
  Newcastle: [54.9784, -1.6174]
};

// --- COLOR LOGIC ---
const getMarkerColor = (species) => {
  if (!species) return "#3B82F6"; 
  const lower = species.toLowerCase();
  if (lower.includes("ricinus") || lower.includes("sheep")) return "#EF4444"; 
  return "#3B82F6"; 
};

function MapView() {
  const [sightings, setSightings] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedSpecies, setSelectedSpecies] = useState("All");
  const [timelineYear, setTimelineYear] = useState(2025); 
  const [isTimelineActive, setIsTimelineActive] = useState(false);
  const [selectedChartCity, setSelectedChartCity] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedSighting, setSelectedSighting] = useState(null);
  
  const navigate = useNavigate();

  // --- SHARE FUNCTION ---
  const handleShare = async (sighting) => {
    const shareText = `⚠️ Tick Sighting Alert!\nSpecies: ${sighting.species}\nLocation: ${sighting.location}\nDate: ${new Date(sighting.date).toLocaleDateString()}`;
    try {
      await navigator.clipboard.writeText(shareText);
      alert("📋 Sighting details copied to clipboard!");
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert("📋 Copied to clipboard!");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      Papa.parse(tickData, {
        header: true,
        download: true,
        complete: async (results) => {
          const csvData = results.data
            .filter((entry) => entry.location && cityCoords[entry.location])
            .map((entry) => ({ ...entry, coords: cityCoords[entry.location], source: 'csv' }));

          let userData = [];
          try { userData = await db.getSightings(); } catch (error) { console.error(error); }

          const mappedUserData = userData
            .filter(entry => entry.location && cityCoords[entry.location])
            .map(entry => ({ ...entry, coords: cityCoords[entry.location], source: 'user' }));

          const combined = [...csvData, ...mappedUserData];
          setSightings(combined);

          const years = Array.from(new Set(combined.map((e) => new Date(e.date).getFullYear()))).sort();
          setAvailableYears(years);
          if (years.length > 0) setTimelineYear(Math.max(...years));
        }
      });
    };
    fetchData();
  }, []);

  const filteredSightings = sightings.filter((sighting) => {
    const sYear = new Date(sighting.date).getFullYear();
    const matchesCity = selectedCity === "All" || sighting.location === selectedCity;
    const matchesSpecies = selectedSpecies === "All" || sighting.species === selectedSpecies;
    const matchesTimeline = isTimelineActive ? sYear <= timelineYear : true;
    return matchesCity && matchesSpecies && matchesTimeline;
  });

  const speciesSummary = filteredSightings.reduce((acc, sighting) => {
    const sp = sighting.species || "Unknown";
    acc[sp] = (acc[sp] || 0) + 1;
    return acc;
  }, {});

  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString("default", { month: "short" }),
    count: 0
  }));

  filteredSightings
    .filter(s => (selectedChartCity === "All" || s.location === selectedChartCity) && (selectedYear === "All" || new Date(s.date).getFullYear().toString() === selectedYear))
    .forEach(s => { monthlyData[new Date(s.date).getMonth()].count++; });

  return (
    <div style={styles.container}>
      
      {/* --- CSS FIXES: Dark Dropdowns & Layout Reset --- */}
      <style>{`
        select option { background-color: #1F2937; color: #F3F4F6; }
        #root { width: 100%; max-width: 100%; } 
      `}</style>

      {/* HEADER & FILTERS */}
      <div style={styles.headerRow}>
        <h2 style={styles.pageTitle}>Tick Tracker <span style={styles.subtitle}>UK Dashboard</span></h2>
        
        <div style={styles.filtersBar}>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>City</span>
            <select style={styles.selectInput} value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
              <option value="All" style={{ color: '#000' }}>All Cities</option>
              {Object.keys(cityCoords).map((city) => <option key={city} value={city} style={{ color: '#ffffffff' }}>{city}</option>)}
            </select>
          </div>
          
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Species</span>
            <select style={styles.selectInput} value={selectedSpecies} onChange={(e) => setSelectedSpecies(e.target.value)}>
              <option value="All" style={{ color: '#000' }}>All Species</option>
              {[...new Set(sightings.map((s) => s.species))].map((sp) => <option key={sp} value={sp} style={{ color: '#ffffffff' }}>{sp}</option>)}
            </select>
          </div>

          <label style={styles.toggleLabel}>
             <input type="checkbox" checked={isTimelineActive} onChange={(e) => setIsTimelineActive(e.target.checked)} style={{accentColor: '#6366F1', marginRight: '8px'}}/>
             Timeline Mode
           </label>
        </div>
      </div>

      {/* --- FLEXBOX DASHBOARD LAYOUT (Replaced Grid) --- */}
      <div style={styles.dashboardGrid}>
        
        {/* MAP CARD (Flex Grow) */}
        <div style={styles.mapCard}>
          <MapContainer center={[54.5, -3.0]} zoom={6} style={{ height: "100%", width: "100%", borderRadius: "12px", zIndex: 0 }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
            {filteredSightings.map((sighting, index) => (
              <CircleMarker key={index} center={sighting.coords} radius={6} 
                pathOptions={{ color: '#fff', weight: 1, fillColor: getMarkerColor(sighting.species), fillOpacity: 0.8 }}
                eventHandlers={{ click: () => setSelectedSighting(sighting) }}
              />
            ))}
          </MapContainer>

          {isTimelineActive && (
            <div style={styles.timelineOverlay}>
              <span style={styles.timelineText}>Showing history up to <strong>{timelineYear}</strong></span>
              <input type="range" min={availableYears[0] || 2020} max={availableYears[availableYears.length - 1] || 2025} value={timelineYear} onChange={(e) => setTimelineYear(Number(e.target.value))} style={styles.slider} />
            </div>
          )}

          {selectedSighting && (
            <div style={styles.modalCard}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: '10px'}}>
                <h3 style={styles.modalTitle}>{selectedSighting.species || "Unknown Tick"}</h3>
                <button onClick={() => setSelectedSighting(null)} style={styles.closeBtn}>✕</button>
              </div>
              <div style={styles.modalMeta}>
                <p>📍 {selectedSighting.location}</p>
                <p>📅 {new Date(selectedSighting.date).toLocaleDateString()}</p>
              </div>
              {selectedSighting.image && (
                <div style={styles.imageContainer}>
                  <img src={selectedSighting.image} alt="Evidence" style={styles.sightingImage} />
                </div>
              )}
              <div style={styles.actionGrid}>
                <button style={styles.primaryBtn} onClick={() => navigate("/report")}>New Report</button>
                <button style={styles.secondaryBtn} onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedSighting.coords[0]},${selectedSighting.coords[1]}`, "_blank")}>Directions</button>
                <button style={styles.outlineBtn} onClick={() => handleShare(selectedSighting)}>Share</button>
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR (Fixed Width) */}
        <div style={styles.sidebar}>
          
          <div style={styles.widgetCard}>
            <h4 style={styles.widgetTitle}>Risk Levels</h4>
            <div style={{display:'flex', gap: '15px'}}>
               <div style={styles.legendItem}><span style={{...styles.dot, background: '#EF4444'}}></span>High Risk</div>
               <div style={styles.legendItem}><span style={{...styles.dot, background: '#3B82F6'}}></span>Standard</div>
            </div>
          </div>

          <div style={styles.widgetCard}>
            <h4 style={styles.widgetTitle}>Live Stats</h4>
            <div style={styles.statRow}>
              <span>Total Sightings</span>
              <span style={styles.statValue}>{filteredSightings.length}</span>
            </div>
            <div style={{ height: "200px", marginTop: "10px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={Object.entries(speciesSummary).map(([name, value]) => ({ name, value }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={40} paddingAngle={5}>
                    {Object.entries(speciesSummary).map((entry, index) => <Cell key={`cell-${index}`} fill={getMarkerColor(entry[0])} />)}
                  </Pie>
                  <Tooltip contentStyle={{background: '#ffffffff', border: 'none', borderRadius: '8px'}}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={styles.widgetCard}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
               <h4 style={styles.widgetTitle}>Activity</h4>
               <select style={styles.miniSelect} value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                  <option value="All" style={{ color: '#000' }}>All Years</option>
                  {availableYears.map((year) => <option key={year} value={year} style={{ color: '#000' }}>{year}</option>)}
               </select>
            </div>
            <div style={{ height: "180px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" tick={{fontSize: 10, fill: '#9CA3AF'}} axisLine={false} tickLine={false}/>
                  <Tooltip cursor={{fill: '#374151'}} contentStyle={{background: '#1F2937', border: 'none', borderRadius: '8px'}}/>
                  <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- MODERN CSS-IN-JS STYLES ---
const styles = {
  container: { width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
  pageTitle: { fontSize: '1.8rem', fontWeight: '700', margin: 0, letterSpacing: '-0.02em' },
  subtitle: { fontSize: '1rem', color: '#9CA3AF', fontWeight: '400', marginLeft: '10px' },
  
  filtersBar: { display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' },
  filterGroup: { display: 'flex', alignItems: 'center', gap: '8px', background: '#1F2937', padding: '6px 12px', borderRadius: '8px', border: '1px solid #374151' },
  filterLabel: { fontSize: '0.85rem', color: '#dedfe0ff', fontWeight: '500' },
  selectInput: { background: 'transparent', border: 'none', color: '#F3F4F6', fontSize: '0.9rem', cursor: 'pointer', outline: 'none' },
  toggleLabel: { display: 'flex', alignItems: 'center', fontSize: '0.9rem', cursor: 'pointer', color: '#D1D5DB', fontWeight: '500' },

  // --- UPDATED LAYOUT: FLEXBOX (Robust) ---
  dashboardGrid: { 
    display: 'flex', 
    flexDirection: 'row', // Stack side by side
    gap: '1.5rem', 
    height: 'calc(100vh - 140px)', 
    minHeight: '600px',
    width: '100%',
    overflow: 'hidden'
  },
  
  mapCard: { 
    flex: 1, // Takes up all remaining space
    position: 'relative', 
    background: '#1F2937', 
    borderRadius: '16px', 
    border: '1px solid #374151', 
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
    overflow: 'hidden', 
    display: 'flex', 
    flexDirection: 'column' 
  },
  
  timelineOverlay: { position: 'absolute', bottom: '20px', left: '20px', right: '20px', background: 'rgba(17, 24, 39, 0.85)', backdropFilter: 'blur(8px)', padding: '15px 20px', borderRadius: '12px', zIndex: 500, display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid rgba(255,255,255,0.1)' },
  timelineText: { fontSize: '0.9rem', color: '#E5E7EB', textAlign: 'center' },
  slider: { width: '100%', accentColor: '#6366F1', cursor: 'pointer' },

  sidebar: { 
    width: '350px', // Fixed width for sidebar
    minWidth: '350px', 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '1rem', 
    overflowY: 'auto' 
  },
  widgetCard: { background: '#1F2937', padding: '1.2rem', borderRadius: '16px', border: '1px solid #374151', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  widgetTitle: { margin: '0 0 1rem 0', fontSize: '1rem', color: '#2a4476ff', fontWeight: '600' },
  
  legendItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#D1D5DB' },
  dot: { width: '10px', height: '10px', borderRadius: '50%' },
  
  statRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' },
  statValue: { fontSize: '1.5rem', fontWeight: '700', color: '#6366F1' },
  miniSelect: { background: '#374151', border: 'none', color: '#D1D5DB', fontSize: '0.8rem', borderRadius: '4px', padding: '2px 6px' },

  // Modal Styles
  modalCard: { position: 'absolute', top: '20px', right: '20px', width: '320px', background: '#ffffff', color: '#1F2937', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', zIndex: 1000 },
  modalTitle: { margin: 0, fontSize: '1.25rem', fontWeight: '700' },
  closeBtn: { background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#1F2937', fontWeight: '800', lineHeight: '1' },
  modalMeta: { fontSize: '0.9rem', color: '#4B5563', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '4px' },
  imageContainer: { width: '100%', height: '160px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem', border: '1px solid #E5E7EB' },
  sightingImage: { width: '100%', height: '100%', objectFit: 'cover' },
  
  actionGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
  primaryBtn: { gridColumn: '1 / -1', background: '#4F46E5', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
  secondaryBtn: { background: '#F3F4F6', color: '#1F2937', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' },
  outlineBtn: { background: 'transparent', color: '#4F46E5', border: '1px solid #4F46E5', padding: '8px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' },
};

export default MapView;