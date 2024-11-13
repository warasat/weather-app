const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files like style.css

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post('/', (req, res) => {
  const query = req.body.cityName;
  const apiKey = '9b29aad5f7fefcf07fe4c669b0c8c557';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric`;

  https.get(url, (response) => {
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;

      // Serve the weather data with embedded variables for dynamic display
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Weather Result</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <div class="container result">
                <h1>Weather in ${query}</h1>
                <p>Temperature: ${temp}°C</p>
                <p>Description: ${description}</p>
                <a href="/">Check another city</a>
            </div>
        </body>
        </html>
      `);
    });
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
