Tick Sighting Tracker

Author
Faizan Naveed

Overview
This is a web-based application built with React + Vite that visualizes tick sightings across the UK using mapping and data visualization. Users can explore sightings, filter by species, date, and location, and even report new sightings through a validated form that saves locally. The app is interactive, cleanly styled, and handles a real-world CSV dataset.


Key Features

Interactive UK Map using react-leaflet for geospatial visualization.
Data Filtering by species, location (city), and date ranges.


Summary Panel showing:

Total sightings
Species distribution (via Pie Chart)
Seasonal Activity (via Bar Chart)
Report Sighting Form with validation and user feedback.
LocalStorage Database to simulate user data persistence.
Modern Responsive UI with custom styling and conditional states.


Tech Stack & Tools:

Area	Tool/Library
Frontend	React 18 + Vite
Maps	react-leaflet, Leaflet.js
Charts	Recharts
Form Handling	React Hooks
Data	Converted CSV from original Excel
Local DB	window.localStorage
Styling	Custom inline + conditional styles


How to Run the Project: 
Clone the Repository:


git clone https://github.com/<your-username>/<your-repo-name>.git
cd "My react app"

Install Dependencies
npm install

Run the Dev Server:
npm run dev

Open the App:
Visit http://localhost:5173
 in your browser.

Project Structure
My react app/
│

├── components/              # All UI components (MapView, EducationPanel, Form)

├── assets/                  # Static files (CSV dataset)

├── dbService.js             # Local database simulation using localStorage

├── App.jsx                  # Main component with routes

├── main.jsx                 # Entry point

└── index.css                # Global styles


Notes on Implementation:

The map shows markers for each sighting location.
Summary panel updates live based on applied filters.
The “Share” button attempts to use native share (or fallback to clipboard).
The "Directions" button shows the exact location.


The “Report Sighting” form includes:

Real-time validation
Success/failure messages
Confirmation warning if "Unknown" species is selected
Submission stores entry in localStorage
A “Cancel” button allows users to return to the homepage.


Problems Faced:

Initial Setup with Vite: Had to resolve module path issues and component folder structures.
Leaflet + React Compatibility: Required configuring CSS and handling marker click events smoothly.
Excel to CSV Conversion: The original dataset was an XLS file; it was manually cleaned and exported as a CSV to feed into the frontend.
Routing Edge Cases: Ensured the /report route loaded cleanly even after page refreshes.
Form UX: Crafted custom error, success, and warning states manually for clarity and feedback.
No Backend Provided: Used localStorage as a mock database to store user-submitted sightings.



Video Walkthrough

📽️ An unlisted YouTube video walk-through of the project (within 10 mins) is included in the repo:
[YouTube Link Placeholder]

Final Thoughts
This project demonstrates how data visualization, form handling, and location-based interactivity can be combined into a practical tool — all while keeping the stack lightweight and manageable.
