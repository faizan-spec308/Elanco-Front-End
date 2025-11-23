

export const db = {

  getSightings: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = JSON.parse(localStorage.getItem("reportedSightings") || "[]");
        resolve(data);
      }, 500); 
    });
  },

 
  addSighting: async (sighting) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate Server-Side Validation
        if (!sighting.location || !sighting.species) {
          reject("Server Error: Missing required fields.");
          return;
        }

        // Saving to database
        try {
          const currentData = JSON.parse(localStorage.getItem("reportedSightings") || "[]");
          
          // Add an ID
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
      }, 800); 
    });
  }
};
