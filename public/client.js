window.addEventListener("DOMContentLoaded", () => {
  // appena la pagina è caricata chiedo la posizione
  const browserLang = navigator.language || navigator.userLanguage;
  const lang = browserLang.slice(0, 2);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          const res = await fetch("/api/geolo", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              lat,
              lon,
              lang,
            }),
          });

          const data = await res.json();
          console.log("Dati meteo:", data);

          document.querySelector(".location").textContent = data.citta;
          document.querySelector(".date").textContent = data.oggi;
          document.querySelector(".grades").textContent =
            data.temperatura + "°";
          document.querySelector(".weather").textContent = data.descrizione;
          document.querySelector(".km").textContent = data.vento + " Km/h";
          document.querySelector(".percent").textContent = data.umidita + "%";
          const container = document.querySelector(".container");

          const descrizione = data.descrizione.toLowerCase();
          let iconName = "default";

          container.classList.remove(
            "scattered-clouds",
            "clear-sky",
            "few-clouds",
            "broken-clouds",
            "shower-rain",
            "rain",
            "thunderstorm",
            "snow",
            "mist"
          );

          if (descrizione.includes("cielo sereno")) {
            iconName = "clear-sky";
            container.classList.add("clear-sky");
            document.body.style.backgroundImage = `url(img/cielo-sereno.avif)`;
          } else if (descrizione.includes("poche nuvole")) {
            iconName = "few-clouds";
            container.classList.add("few-clouds");
            document.body.style.backgroundImage = `url(img/poche-nuvole.avif)`;
          } else if (descrizione.includes("nubi sparse")) {
            iconName = "scattered-clouds";
            container.classList.add("scattered-clouds");
            document.body.style.backgroundImage = `url(img/nubi-sparse.avif)`;
          } else if (descrizione.includes("cielo coperto")) {
            iconName = "broken-clouds";
            container.classList.add("broken-clouds");
            document.body.style.backgroundImage = `url(img/nuvole-spezzate.avif)`;
          } else if (descrizione.includes("pioggia forte")) {
            iconName = "shower-rain";
            container.classList.add("shower-rain");
            document.body.style.backgroundImage = `url(img/pioggia-forte.avif)`;
          } else if (descrizione.includes("pioggia")) {
            iconName = "rain";
            container.classList.add("rain");
            document.body.style.backgroundImage = `url(img/pioggia.avif)`;
          } else if (descrizione.includes("temporale")) {
            iconName = "thunderstorm";
            container.classList.add("thunderstorm");
            document.body.style.backgroundImage = `url(img/temporale.avif)`;
          } else if (descrizione.includes("neve")) {
            iconName = "snow";
            container.classList.add("snow");
            document.body.style.backgroundImage = `url(img/neve.avif)`;
          } else if (descrizione.includes("nebbia")) {
            iconName = "mist";
            container.classList.add("mist");
            document.body.style.backgroundImage = `url(img/nebbia.avif)`;
          }
          document.querySelector(".sun-icon").src = `/img/${iconName}.png`;
        } catch (err) {
          console.error("Errore fetch:", err);
        }
      },
      (err) => {
        console.error("Errore geolocalizzazione:", err);
      }
    );
  } else {
    console.error("Geolocalizzazione non supportata.");
  }
});
