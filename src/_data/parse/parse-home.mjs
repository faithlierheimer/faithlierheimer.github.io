import { downloadImage } from "../../utils/createImg.mjs"

export const parseHomeData = async (homeEntries) => {
    const homePage = homeEntries.main;

    const outputDir = "./build/public/img"
    const mainPageFeatImage = homePage.properties.featuredImage?.files[0]?.file?.url;
    const mainPageFeatImageDescription = homePage.properties.featuredImageDescription?.rich_text[0]?.plain_text;

    const home = {
        main: {
            title: homePage.properties.title.rich_text[0]?.plain_text,
            body: homePage.contents,
            permalink: "/",
            featuredImage: await downloadImage(mainPageFeatImage, mainPageFeatImageDescription, outputDir),
            featuredImageDescription: mainPageFeatImageDescription,
            metaTitle: homePage.properties.metaTitle.rich_text[0]?.plain_text,   
            description: homePage.properties.description.rich_text[0]?.plain_text     
        },
        pages: []
    }

    return home;
}

