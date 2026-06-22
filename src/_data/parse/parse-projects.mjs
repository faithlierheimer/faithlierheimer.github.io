import { downloadImage } from "../../utils/createImg.mjs"
import { categoryLabels, formatDateMonthDayYear } from "../../utils/utils.mjs";

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
            permalink: "projects",          
        },
        pages: []
    }

      const projectsSortedByDate = projectPages.sort((a, b) => {
      if (a.properties?.published?.checkbox) {
            const dateA = a.properties?.publishDate?.date?.start || "1967-06-07";
            const dateB = b.properties?.publishDate?.date?.start || "1967-06-07";
            return new Date(dateB) - new Date(dateA);
        }
    })

    const projectCategories = {}

    for (const project of projectsSortedByDate) {
        const published = project.properties?.published?.checkbox

        if (published) {
            const properties = project.properties;
            const id = properties.id.title[0].plain_text;
            const metaTitle = properties.metaTitle.rich_text[0]?.plain_text;
            const title = properties.title.rich_text[0]?.plain_text;
            const body = project.contents
            const description = properties.description.rich_text[0]?.plain_text;
            const teaserText = properties.teaserText.rich_text[0]?.plain_text;
            const publishDate = properties.publishDate.date?.start || "1967-06-07";
            const featured = properties.featured?.checkbox;
                
            const featuredImageDescription =
            properties.featuredImageDescription?.rich_text[0]?.plain_text;
            const featuredImage = await downloadImage(
            properties.featuredImage?.files[0]?.file?.url,
            featuredImageDescription,
            outputDir,
            );
        
        const category = properties.category?.select?.name;
        let categoryId = properties.category?.select?.name;
    
        if (categoryId) {
          categoryId =
            categoryLabels[category] || category.replaceAll(" ", "-").toLowerCase();
        } else {
          categoryId = "random";
        }

        
        const page = {
          title,
          body,
          permalink: `projects/${categoryId}/${id}`,
          metaTitle,
          description,
          featuredImage,
          featuredImageDescription,
          publishDate: formatDateMonthDayYear(publishDate),
          rawDate: publishDate,
          category,
          categoryId,
          teaserText: teaserText || description
        };

         //This is for organizing actual projects into categories
        if (categoryId && !projectCategories[categoryId]) {
          projectCategories[categoryId] = {};
          projectCategories[categoryId].pages = [];
          projectCategories[categoryId].pages.push(page);
          projectCategories[categoryId].id = categoryId;
          projectCategories[categoryId].label = category;
          projectCategories[categoryId].metaTitle = `${mainProject.properties.metaTitle.rich_text[0]?.plain_text} - ${category} projects`
          projectCategories[categoryId].description = `${mainProject.properties.description.rich_text[0]?.plain_text} - ${category} projects`
        } else {
            projectCategories[categoryId].pages.push(page);
        }
        
        if (featured) {
            projects.featured.push(page);
        }
            //this is just to have a list of project categories for the main project page
            projects.main.categories.push({id: categoryId, label: category || "Random"});
        
            projects.pages.push(page);
        }
    }
    for (const cat of Object.values(projectCategories)) {
        projects.categories.push(cat)
    }

    projects.main.categories = [...new Map(projects.main.categories.map(item => [item.id, item])).values()]

    return projects;
}

