// import { formatDateMonthYear, sortByMostRecent } from "../../utils/utils.mjs"
// import { renderRichText } from "../../utils/parseRichText.mjs"

// export const parseResumeData = async (resumeData) => {
//     const resumePages = resumeData.pages;
//     const resumeMain = resumeData.main
//     const resumeEntries = []

//     const resume = {
//         main: {
//                 title: homePage.properties.title.rich_text[0]?.plain_text,
//                 body: homePage.contents,
//                 permalink: "/",
//                 featuredImage: await downloadImage(mainPageFeatImage, mainPageFeatImageDescription, outputDir),
//                 featuredImageDescription: mainPageFeatImageDescription,
//                 metaTitle: homePage.properties.metaTitle.rich_text[0]?.plain_text,   
//                 description: homePage.properties.description.rich_text[0]?.plain_text     
//                 },
//         pages: []
//     }
    
//     for (const item of resumePages) {
//         const published = item.properties?.published?.checkbox
        
//         if (published) {
//             const properties = item.properties;
//             const body = item.contents
//             const publishDate = properties.publishDate.date?.start;
//             const id = properties.id.title[0].plain_text;
    
//             const entry = {
//                 title: renderRichText(properties.title.rich_text),
//                 id,
//                 publishDate: formatDateMonthYear(publishDate),
//                 rawDate: publishDate,
//                 body
//             }
    
//             resumeEntries.push(entry)
//         }   
//     }

//     return sortByMostRecent(resumeEntries);
// }

