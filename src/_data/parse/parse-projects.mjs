import { downloadImage } from "../../utils/createImg.mjs"

export const parseProjectData = async (projectEntries) => {
    const mainProject = projectEntries.main;
    const projectPages = projectEntries.pages;

    const outputDir = "./build/public/img"
    const mainPageFeatImageDescription = mainProject.properties.featuredImageDescription?.rich_text[0]?.plain_text;
    const mainPageFeatImage = await downloadImage(mainProject.properties.featuredImage?.files[0]?.file?.url, mainPageFeatImageDescription, outputDir);

    const projects = {
        main: {
            title: mainProject.properties.title.rich_text[0]?.plain_text,
            body: mainProject.contents,
            featuredImage: mainPageFeatImage,
            featuredImageDescription: mainPageFeatImageDescription,
            metaTitle: mainProject.properties.metaTitle.rich_text[0]?.plain_text,
            permalink: projects,          
        },
        pages: []
    }

    for (const project of projectPages) {
        const published = project.properties?.published?.checkbox

        if (published) {
            const properties = project.properties;
            const id = properties.id.title[0].plain_text;
            // const published = properties.published?.checkbox;
            const metaTitle = properties.metaTitle.rich_text[0]?.plain_text;
            const title = properties.title.rich_text[0]?.plain_text;
            const body = project.contents
            // const publishDate = properties.publishDate.date?.start;
            
            const featuredImageDescription = properties.featuredImageDescription?.rich_text[0]?.plain_text;
            const featuredImage = await downloadImage(properties.featuredImage?.files[0]?.file?.url, featuredImageDescription, outputDir);
        
            const page = {
                title,
                body,
                permalink: id,
                metaTitle,
                featuredImage,
                featuredImageDescription
            }
            
            projects.pages.push(page);
        }
    }

    return projects;
}

