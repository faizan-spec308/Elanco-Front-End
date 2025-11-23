Tick Sighting Tracker

Author: Faizan Naveed

Overview

This is a web-based application built with React + Vite that visualizes tick sightings across the UK using mapping and data visualization.

Users can explore sightings, filter by species, date, and location, and report new sightings through a validated form that stores data locally. The app is interactive, responsive, and works with a real-world CSV dataset.

Key Features

Interactive UK Map using react-leaflet for geospatial visualization

Data Filtering by:

Species

Location (city)

Date range

Summary Panel displaying:

Total sightings

Species distribution (Pie Chart)

Seasonal activity (Bar Chart)

Report Sighting Form with:

Real-time validation

Warning for “Unknown” species

Success & error feedback

Storage in localStorage

Cancel button

LocalStorage Database simulates user data persistence

Modern Responsive UI with custom styling and conditional states

Tech Stack & Tools
Area	Tool / Library
Frontend	React 18 + Vite
Maps	react-leaflet, Leaflet.js
Charts	Recharts
Form Handling	React Hooks
Data	CSV (converted from Excel)
Local DB	window.localStorage
Styling	Custom inline + conditional
How to Run the Project
1. Clone the Repository
git clone https://github.com//.git
cd "My react app"

2. Install Dependencies
npm install

3. Run the Dev Server
npm run dev

4. Open the App

Visit:
http://localhost:5173

Project Structure
My react app/
│
├── components/      # All UI components (MapView, EducationPanel, Form)
├── assets/          # Static files (CSV dataset)
├── dbService.js     # Local database simulation using localStorage
├── App.jsx          # Main component with routes
├── main.jsx         # Entry point
└── index.css        # Global styles

Notes on Implementation

Map displays markers for each sighting location

Summary panel updates live when filters change

“Share” button uses native sharing or falls back to clipboard

Report form includes:

Real-time validation

Warning for Unknown species

Success & failure messages

Stores submissions in localStorage

Cancel button returns the user to the homepage

Clean routing, including /report persistence on refresh

Problems Faced

Vite module path issues during setup

Leaflet + React compatibility (CSS + marker click handling)

Manual Excel → CSV cleaning and conversion

Routing edge cases for direct refreshes

Manual creation of error/success/warning UX states

No backend → had to simulate DB with localStorage

Video Walkthrough

📽️ An unlisted YouTube video walk-through of the project (within 10 mins) is included in the repo:
[YouTube Link Placeholder]

Final Thoughts

This project demonstrates how mapping, data visualization, and form handling can be combined into a practical, lightweight tool — without needing a backend.
