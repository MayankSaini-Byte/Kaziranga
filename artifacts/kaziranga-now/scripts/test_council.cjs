const Papa = require("papaparse");

const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTjXAxRoqAYbkftm1l2yz-Ib5prf2ujnR9kcd4iCwJON4YSw8S8UucAYRu3GQuhYeH4Za1EoB3U7f3L/pub?gid=1429305251&single=true&output=csv";

async function test() {
  const res = await fetch(url);
  const text = await res.text();
  
  Papa.parse(text, {
    header: true,
    complete: (results) => {
      console.log("Total parsed rows:", results.data.length);
      console.log("Headers:", Object.keys(results.data[0] || {}));
      console.log("First 10 rows:", results.data.slice(0, 10));
    }
  });
}

test().catch(console.error);
