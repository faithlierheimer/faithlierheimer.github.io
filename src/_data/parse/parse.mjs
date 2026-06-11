import { parseBlogData } from "./parse-blogs.mjs"
import { parseProjectData } from "./parse-projects.mjs"
import { parseNewsData } from "./parse-news.mjs"
import { parseHomeData } from "./parse-home.mjs"


const sortEntriesIntoBuckets = (entries) => {
    const buckets = {};

    for (const entry of entries) {
        const type = entry.properties.type?.select?.name;

        if (!type) continue;
                if (!type) continue;

        const isMainPage = entry.properties.mainPage?.checkbox;
        
        if (!buckets[type]) {
            buckets[type] = {
                main: {},
                pages: []
            }
        }
        if (isMainPage) {
            buckets[type].main = entry;
        } else {
            buckets[type].pages.push(entry);
        }
    }

    return buckets;
}

export const parse = async (entries) => {

    const buckets = sortEntriesIntoBuckets(entries);

    const news = parseNewsData(buckets.news);
    const home = await parseHomeData(buckets.about);
    home.main.news = news;

    const blog = await parseBlogData(buckets.blog);
    // const projects = await parseProjectData(buckets.projects);
    const projects = {
     main: {
        title: "My work",
        body: "A bunch of rich text and links to other pages",
        featuredImage: "presentation.jpg",
        label: "projects",
        type: "project",
        permalink: "projects",
      },
      pages: [],
    }

    const parsedData = {
        home,
        blog,
        projects
    }

    return parsedData;
}


