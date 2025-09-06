# Weather App

A full-stack MERN (MongoDB, Express, React, Node.js) weather application that allows users to get real-time weather data for any city, view a 5-day forecast, and track recent searches. The app also features autosuggestions for cities and displays local time based on the city's timezone.

---

## 🌐 Live Demo

* **Test the app yourself::** [vuletin.github.io/weather-app](https://vuletin.github.io/weather-app)
* ** ⚠ It's running on free hosting so wait 30 sec to load

---

## ✨ Features

* 🔍 **City Autosuggestions** as you type (powered by GeoDB API)
* ⌨️ **Autofocus** on the search bar for quick typing
* 🌤️ **Real-time Weather Info** including:
  * Temperature
  * Wind speed
  * Weather type (e.g. light rain, clear sky)
  * Weather icon
  
* 🕒 **Local Time Display** based on the city’s timezone
* 📅 **5-Day Forecast** with daily temperature and icons
* 🔁 **Recent Searches** stored in MongoDB and displayed with temp, icon, and timestamp

---

## ⚙️ Tech Stack

* **Frontend:** React
* **Backend:** Node.js + Express
* **Database:** MongoDB Atlas
* **APIs:**
 * OpenWeatherMap
 * GeoDB Cities API

* **Deployment:**

  * Frontend: GitHub Pages
  * Backend: Render

---

## 🚀 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/Vuletin/weather-app.git
cd weather-app
```

### 2. Set up environment variables

Create `.env` files in:

* `server/.env`

```env
MONGO_URI=your_mongodb_uri
OPENWEATHER_API_KEY=your_openweather_key
```

* `client/.env`

```env
REACT_APP_WEATHER_API_KEY=your_openweather_key
REACT_APP_GEODB_API_KEY=your_geodb_key
```

### 3. Install dependencies

```bash
npm install
cd client && npm install
cd ../server && npm install
```

### 4. Run the app locally

```bash
npm run dev
```

### 5. Deploy

* Backend to Render
* Frontend with:

```bash
cd client
npm run deploy
```

---

## 📹 Video Demo
* https://youtu.be/jdruHSkx41k
---

## 🙋‍♂️ Author

**Sava Vuletin**
Programmer from Serbia, passionate about building useful full-stack apps.

GitHub: [@Vuletin](https://github.com/Vuletin)
