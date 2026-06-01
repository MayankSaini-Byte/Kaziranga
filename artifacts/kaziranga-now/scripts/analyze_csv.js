async function run() {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTjXAxRoqAYbkftm1l2yz-Ib5prf2ujnR9kcd4iCwJON4YSw8S8UucAYRu3GQuhYeH4Za1EoB3U7f3L/pub?gid=177547042&single=true&output=csv";
  const res = await fetch(url);
  const text = await res.text();
  
  // Basic CSV parsing to get rows
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const headerLine = lines[0];
  console.log("Headers Line:", headerLine);
  
  // Let's parse with a basic regex for CSV cells
  function parseCSVRow(text) {
    const p = RegExp('("([^"]|"")*"|[^,\\r\\n]*)(,|$)', 'g');
    const row = [];
    let m;
    while ((m = p.exec(text)) && m[1] !== undefined) {
      let cell = m[1];
      if (cell.startsWith('"') && cell.endsWith('"')) {
        cell = cell.slice(1, -1).replace(/""/g, '"');
      }
      row.push(cell);
      if (m[3] === '') break; // end of line
      if (p.lastIndex === text.length) break;
    }
    return row;
  }

  const headers = parseCSVRow(headerLine);
  console.log("Parsed Headers:", headers);
  console.log("Total Rows:", lines.length - 1);
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = parseCSVRow(lines[i]);
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = cells[idx] || "";
    });
    data.push(obj);
  }

  // Count non-empty values
  const counts = {};
  headers.forEach(h => counts[h] = 0);
  data.forEach(row => {
    headers.forEach(h => {
      if (row[h] && row[h].trim() !== "") {
        counts[h]++;
      }
    });
  });
  console.log("Non-empty counts:", counts);
  
  // Let's see some non-empty Instagram Post values
  const withInsta = data.filter(d => d["Instagram Post"] && d["Instagram Post"].trim() !== "");
  console.log("Rows with Instagram Post (showing first 5):", withInsta.slice(0, 5));

  // Let's see some region values
  const regions = new Set(data.map(d => d["Region"]).filter(Boolean));
  console.log("Unique Regions:", Array.from(regions));

  // Print non-empty Poster and Images rows
  const withPoster = data.filter(d => d["Poster"] && d["Poster"].trim() !== "");
  console.log("Rows with Poster:", withPoster);
  const withImages = data.filter(d => d["Images"] && d["Images"].trim() !== "");
  console.log("Rows with Images:", withImages);
}

run().catch(console.error);
