import { writeFileSync } from "fs";
import { createHash } from "crypto";

export const downloadImage = async (s3Url, alt, outputDir) => {
  if (!s3Url) return null;

  const res = await fetch(s3Url);
  if (!res.ok) {
    console.warn("IMAGES ARE EXPIRED, NEED UPDATED DATA FETCH");
    return null;
  }
  const buffer = await res.arrayBuffer();
  const altText = alt ? alt.trim().replaceAll(" ", "-").replaceAll(",", "-") : "img"
  
  // Use a hash of the URL as a stable filename
  const hash = createHash("md5").update(s3Url).digest("hex");
  const ext = "png"; // or parse from Content-Type header
  const filename = `${altText.slice(0, 10)}-${hash}.${ext}`;
  
  writeFileSync(`${outputDir}/${filename}`, Buffer.from(buffer));
  return `/public/img/${filename}`; // your own public URL
};