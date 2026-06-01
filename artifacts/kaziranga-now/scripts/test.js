const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTjXAxRoqAYbkftm1l2yz-Ib5prf2ujnR9kcd4iCwJON4YSw8S8UucAYRu3GQuhYeH4Za1EoB3U7f3L/pub?gid=177547042&single=true&output=csv";

async function test() {
  const res = await fetch(url);
  const text = await res.text();
  
  // Custom CSV parser
  function parseCSV(csvText) {
    const lines = [];
    let row = [""];
    lines.push(row);
    let inQuotes = false;
    
    for (let i = 0; i < csvText.length; i++) {
      const c = csvText[i];
      const next = csvText[i+1];
      
      if (c === '"') {
        if (inQuotes && next === '"') {
          row[row.length - 1] += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        row.push("");
      } else if ((c === '\r' || c === '\n') && !inQuotes) {
        if (c === '\r' && next === '\n') {
          i++;
        }
        row = [""];
        lines.push(row);
      } else {
        row[row.length - 1] += c;
      }
    }
    return lines.filter(r => r.length > 1 || (r.length === 1 && r[0] !== ""));
  }

  const rows = parseCSV(text);
  const headers = rows[0].map(h => h.trim());
  console.log("Headers:", headers);
  
  const data = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = row[idx] || "";
    });
    data.push(obj);
  }

  const non_empty_poster = data.filter(r => r.Poster && r.Poster.trim() !== "");
  console.log("Non-empty posters:", non_empty_poster.map(x => ({ Venue: x.Venue, Poster: x.Poster })));
  
  const non_empty_images = data.filter(r => r.Images && r.Images.trim() !== "");
  console.log("Non-empty images:", non_empty_images.map(x => ({ Venue: x.Venue, Images: x.Images })));
}

test().catch(console.error);
