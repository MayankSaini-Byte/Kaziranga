const Papa = require("papaparse");

const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTjXAxRoqAYbkftm1l2yz-Ib5prf2ujnR9kcd4iCwJON4YSw8S8UucAYRu3GQuhYeH4Za1EoB3U7f3L/pub?gid=177547042&single=true&output=csv";

async function check() {
  const res = await fetch(url);
  const text = await res.text();
  
  Papa.parse(text, {
    header: true,
    complete: (results) => {
      console.log("Total rows:", results.data.length);
      results.data.forEach((r, idx) => {
        const posterVal = r.Poster;
        const imagesVal = r.Images;
        if ((posterVal && posterVal.trim()) || (imagesVal && imagesVal.trim())) {
          console.log(`Row ${idx}:`, { Venue: r.Venue, Poster: posterVal, Images: imagesVal });
        }
      });
    }
  });
}

check().catch(console.error);
