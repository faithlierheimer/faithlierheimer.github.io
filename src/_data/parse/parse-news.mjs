import { formatDateMonthYear, sortByMostRecent } from "../../utils/utils.mjs"
import { renderRichText } from "../../utils/parseRichText.mjs"

export const parseNewsData = (newsData) => {
    const news = newsData.pages;
    const newsEntries = []
    
    for (const item of news) {
        const published = item.properties?.published?.checkbox
        
        if (published) {
            const properties = item.properties;
            const body = item.contents
            const publishDate = properties.publishDate.date?.start;
            const id = properties.id.title[0].plain_text;
    
            const entry = {
                title: renderRichText(properties.title.rich_text),
                id,
                publishDate: formatDateMonthYear(publishDate),
                rawDate: publishDate,
                body
            }
    
            newsEntries.push(entry)
        }   
    }

    return sortByMostRecent(newsEntries);
}

