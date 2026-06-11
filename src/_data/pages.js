import { Client } from "@notionhq/client";
import fs from "fs";
import { blocksToHTML } from "../utils/parseRichText.mjs"
import { parse } from "./parse/parse.mjs"


let secret
let databaseId;
if (fs.existsSync('./env.mjs')) {
  const env = await import('../../env.mjs')
    secret = env.NOTION_DATABASE_SECRET;
    databaseId = env.NOTION_DATABASE_ID;
} else {
    secret = process.env.NOTION_DATABASE_SECRET;
    databaseId = process.env.NOTION_DATABASE_ID;
}


const notion = new Client({ auth: secret });
const pagesFilePath = "./pages.json";
const notionDataFilePath = "./notionData.json";

const saveJsonToFile = (data, filePath) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    console.log(`✅ JSON saved to ${filePath}`);
  } catch (err) {
    console.error("❌ Error writing file:", err);
  }
};

const checkDataFile = (filePath) => {
  return fs.existsSync(filePath);
};

const readJsonFromFile = (filePath) => {
  try {
    const rawData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(rawData);
  } catch (err) {
    console.error("❌ Error reading file:", err);
    return null;
  }
};

const getNotionData = async () => {
      const response = await notion.databases.query({ database_id: databaseId });
      const data = response;
  
      for (let i=0; i < data.results.length; i++) {
          const published = data.results[i]?.properties?.published?.checkbox
          if (published) {
            const pageId = data.results[i].id;
            const blocks = await notion.blocks.children.list({ block_id: pageId })
            const body = await blocksToHTML(blocks.results);
      
            data.results[i].contents = body;
            console.log("writing file ", pageId)
          }

      }
      return data;
}


const parseNotionData = async (entries) => {
    const pages = await parse(entries);
    return pages;
}

const pages = async () => {
  if (checkDataFile(notionDataFilePath)) {
    if (checkDataFile(pagesFilePath)) {
      const pages = readJsonFromFile(pagesFilePath);
      return pages;
    } else {
      console.log("GENERATING PAGES FROM NOTION DATA");
      const data = readJsonFromFile(notionDataFilePath);
      const pages = await parse(data);
      saveJsonToFile(pages, pagesFilePath);
      return pages;
    }
  } else {
    console.log("pulling fresh data file"); 
    try {
      const notionEntries = await getNotionData();
      let pages = null;
        saveJsonToFile(notionEntries.results, notionDataFilePath);
        pages = await parseNotionData(notionEntries.results);
        if (!checkDataFile(pagesFilePath)) {
          saveJsonToFile(pages, pagesFilePath);
        }
      console.log("returning pages");
      return pages;
    } catch (e) {
      console.log("ERRRRRRRRRRRR", e)
    }
  }
};

export default pages;
