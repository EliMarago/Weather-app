import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
const API_KEY = "490b8a9390bf7bc401d03f00b608995f";

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  // inizialmente non mando nessun dato
  res.render("index.ejs", {
    citta: "",
    temperatura: "",
    descrizione: "",
    umidita: "",
    vento: "",
    oggi: "",
  });
});

app.post("/api/geolo", async (req, res) => {
  const { lat, lon, lang } = req.body;
  const language = lang || "it";
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=${language}`
    );
    const data = response.data;

    res.json({
      citta: data.name,
      temperatura: Math.round(data.main.temp),
      descrizione: data.weather[0].description,
      umidita: data.main.humidity,
      vento: Math.round(data.wind.speed),
      oggi: new Date().toLocaleDateString(
        language + "-" + language.toUpperCase(),
        {
          year: "numeric",
          month: "long",
          day: "2-digit",
          weekday: "long",
        }
      ),
      icon: data.weather[0].icon,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore nel recupero dei dati" });
  }
});

app.listen(port, () => {
  console.log(`✅ Server in esecuzione su http://localhost:${port}`);
});
