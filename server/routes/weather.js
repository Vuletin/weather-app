require("dotenv").config();
const express = require("express");
const router = express.Router();
const Search = require("../models/Search");

router.get("/", async (req, res) => {
  const city = req.query.city;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  const formattedCity = city.trim().toLowerCase().replace("city of ", "");
  const capitalizedCity = formattedCity.charAt(0).toUpperCase() + formattedCity.slice(1);

  if (!city) return res.status(400).json({ error: "City is required" });

  console.log(`🌐 Fetching weather for: ${city} with API key: ${apiKey}`);

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    if (response.ok) {
      const temp = data?.main?.temp;
      const description = data?.weather?.[0]?.description;
      const icon = data?.weather?.[0]?.icon;

            const normalizeCity = (str) =>
        str
          .toLowerCase()
          .replace(/city of |metropolitan city of |province of |county of /gi, "")
          .split(",")[0]
          .trim()
          .replace(/\b\w/g, (c) => c.toUpperCase());

      const formattedCity = normalizeCity(city);

      await Search.findOneAndUpdate(
        { city: formattedCity },
        {
          $set: {
            city: formattedCity,
            temp,
            description,
            icon,
            searchedAt: new Date(),
            timezone: data.timezone
          },
        },
        { upsert: true }
      );

      console.log("✅ Weather data fetched:", data.name);
      res.json(data);
    }

    else {
      console.error("❌ API error:", data.message);
      res.status(response.status).json({ error: data.message });
    }
  } catch (error) {
    console.error("🔴 Weather error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// This must be **outside** the first route
router.get("/history", async (req, res) => {
  try {
    const searches = await Search.find()
      .sort({ updatedAt: -1 })  // sort by latest search
      .limit(10);               // show last 10 unique cities
    res.json(searches);
  } catch (err) {
    console.error("Error fetching search history:", err);
    res.status(500).json({ error: "Failed to get history" });
  }
});

router.get('/forecast', async (req, res) => {
  const city = req.query.city;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message });
    }

    res.json(data);
  } catch (err) {
    console.error("❌ Forecast fetch error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;