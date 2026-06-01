import Papa from "papaparse";

// ─── Google Sheets CSV URLs ──────────────────────────────────────────
const EPISODES_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTjXAxRoqAYbkftm1l2yz-Ib5prf2ujnR9kcd4iCwJON4YSw8S8UucAYRu3GQuhYeH4Za1EoB3U7f3L/pub?gid=0&single=true&output=csv";

const EVENTS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTjXAxRoqAYbkftm1l2yz-Ib5prf2ujnR9kcd4iCwJON4YSw8S8UucAYRu3GQuhYeH4Za1EoB3U7f3L/pub?gid=311257018&single=true&output=csv";

const GALLERY_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRp4pSYAb1UlKjHJ43624Lo7Syemy7LyAmlPCG6_nRHcMygI8JRx01mitkvznsMYEvo1EoDONYh4xCf/pub?gid=0&single=true&output=csv";

// TODO: Replace with your published Google Sheets CSV URL for the council sheet
const COUNCIL_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTjXAxRoqAYbkftm1l2yz-Ib5prf2ujnR9kcd4iCwJON4YSw8S8UucAYRu3GQuhYeH4Za1EoB3U7f3L/pub?gid=1429305251&single=true&output=csv";

const AAROHAN_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTjXAxRoqAYbkftm1l2yz-Ib5prf2ujnR9kcd4iCwJON4YSw8S8UucAYRu3GQuhYeH4Za1EoB3U7f3L/pub?gid=842204102&single=true&output=csv";

const MEETUPS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTjXAxRoqAYbkftm1l2yz-Ib5prf2ujnR9kcd4iCwJON4YSw8S8UucAYRu3GQuhYeH4Za1EoB3U7f3L/pub?gid=177547042&single=true&output=csv";


// ─── Types ───────────────────────────────────────────────────────────
export interface MeetupRow {
  Date: string;
  Venue: string;
  Region: string;
  "Instagram Post": string;
  "Host's ID": string;
}

export interface MeetupData {
  id: string;
  region: string;
  venue: string;
  date: string;
  instagramPost: string;
  hostId: string;
  coverImage: string;
  gallery: string[];
}

export interface EpisodeRow {
  "Episode No.": string;
  Title: string;
  Date: string;
  Host: string;
  Image_url: string;
  Instagram_url: string;
}

export interface EventRow {
  Title: string;
  Category: string;
  status: string;
  Date: string;
  description: string;
  Speaker: string;
  Image_url: string;
  youtube_url: string;
  meet_link: string;
}

export interface GalleryRow {
  Student: string;
  Category: string;
  Image_url: string;
  Timestamp: string;
  Approved: string;
}

export interface CouncilRow {
  Name: string;
  Role: string;
  "Council Type": string;
  Tagline: string;
  Phone: string;
  Email: string;
  "Image URL": string;
}

export interface AarohanRow {
  Status: string;
  "Sub-Category": string;
  "Name of Event": string;
  "Winner ": string;
  "First Runner-up": string;
  "Secong Runner-up": string;
  "Honourable mentions ": string;
  "YouTube link": string;
  Images: string;
  "Meet-Link": string;
}

// ─── Helper: fetch + parse CSV ───────────────────────────────────────
async function fetchCSV<T>(url: string): Promise<T[]> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch data (HTTP ${response.status})`);
  }
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse<T>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (err: Error) => reject(err),
    });
  });
}

// ─── Convert Google Drive share links to direct image URLs ───────────
export function toDirectImageUrl(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();

  // Google Drive share link → direct image URL
  // Matches: https://drive.google.com/file/d/FILE_ID/view...
  const driveMatch = trimmed.match(
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
  );
  if (driveMatch) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
  }

  // Google Drive open link → direct image URL
  // Matches: https://drive.google.com/open?id=FILE_ID
  const driveOpenMatch = trimmed.match(
    /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/
  );
  if (driveOpenMatch) {
    return `https://lh3.googleusercontent.com/d/${driveOpenMatch[1]}`;
  }

  // Already a direct URL (GitHub raw, imgur, etc.) — return as-is
  return trimmed;
}

// ─── Public API ──────────────────────────────────────────────────────
export function fetchEpisodes(): Promise<EpisodeRow[]> {
  return fetchCSV<EpisodeRow>(EPISODES_CSV_URL);
}

export function fetchEvents(): Promise<EventRow[]> {
  return fetchCSV<EventRow>(EVENTS_CSV_URL);
}

export function fetchGallery(): Promise<GalleryRow[]> {
  return fetchCSV<GalleryRow>(GALLERY_CSV_URL);
}

export function fetchCouncil(): Promise<CouncilRow[]> {
  return fetchCSV<CouncilRow>(COUNCIL_CSV_URL);
}

export function fetchAarohan(): Promise<AarohanRow[]> {
  return fetchCSV<AarohanRow>(AAROHAN_CSV_URL);
}

// ─── Meetups Support ─────────────────────────────────────────────────
const MEETUPS_IMAGES = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1531050171651-7ebc48a624d5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
];

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

function getDeterministicIndex(str: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % max;
}

function getDeterministicGallery(str: string, count: number): string[] {
  const startIndex = getDeterministicIndex(str, MEETUPS_IMAGES.length);
  const gallery: string[] = [];
  for (let i = 0; i < count; i++) {
    gallery.push(MEETUPS_IMAGES[(startIndex + i) % MEETUPS_IMAGES.length]);
  }
  return gallery;
}

export async function fetchMeetups(): Promise<MeetupData[]> {
  const rows = await fetchCSV<MeetupRow>(MEETUPS_CSV_URL);
  
  return rows
    .filter(row => row.Venue && row.Region && row.Date)
    .map((row) => {
      const region = row.Region.trim();
      const venue = row.Venue.trim();
      const date = row.Date.trim();
      const hostId = (row["Host's ID"] || "").trim();
      const instagramPost = (row["Instagram Post"] || "").trim();
      
      const id = slugify(venue);
      const coverImage = MEETUPS_IMAGES[getDeterministicIndex(id, MEETUPS_IMAGES.length)];
      const gallery = getDeterministicGallery(id, 6);
      
      return {
        id,
        region,
        venue,
        date,
        instagramPost,
        hostId,
        coverImage,
        gallery
      };
    });
}

