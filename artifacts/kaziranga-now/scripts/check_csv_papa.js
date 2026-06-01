import Papa from 'papaparse';

async function run() {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTjXAxRoqAYbkftm1l2yz-Ib5prf2ujnR9kcd4iCwJON4YSw8S8UucAYRu3GQuhYeH4Za1EoB3U7f3L/pub?gid=177547042&single=true&output=csv";
  const res = await fetch(url);
  const text = await res.text();
  
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
  console.log("Total rows parsed:", parsed.data.length);
  
  const regions = new Set();
  parsed.data.forEach(row => {
    regions.add(row["Region"]);
  });
  console.log("Unique Regions (PapaParse):", Array.from(regions));
  
  // Find rows where Region looks weird
  const weirdRows = parsed.data.filter(row => {
    const reg = row["Region"] || "";
    return reg.includes("http") || reg.includes("Floor") || reg === "";
  });
  console.log("Weird rows:", weirdRows);
}

run().catch(console.error);
