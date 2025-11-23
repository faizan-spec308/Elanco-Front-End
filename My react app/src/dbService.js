

export const db = {
  // Simulate fetching data with a delay
  getSightings: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = JSON.parse(localStorage.getItem("reportedSightings") || "[]");
        resolve(data);
      }, 500); 
    });
  },

  // Simulate saving data with validation and delay
  addSighting: async (sighting) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 1. Simulate Server-Side Validation
        if (!sighting.location || !sighting.species) {
          reject("Server Error: Missing required fields.");
          return;
        }

        // 2. "Save" to database (LocalStorage in this case)
        try {
          const currentData = JSON.parse(localStorage.getItem("reportedSightings") || "[]");
          
          // Add an ID and Timestamp
          const newEntry = { 
            ...sighting, 
            id: Date.now(), 
            timestamp: new Date().toISOString() 
          };
          
          localStorage.setItem("reportedSightings", JSON.stringify([...currentData, newEntry]));
          resolve(newEntry);
        } catch (err) {
          reject("Database write failed. Storage might be full.");
        }
      }, 800); // 0.8s network delay
    });
  }
};