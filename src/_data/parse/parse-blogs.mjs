import { downloadImage } from "../../utils/createImg.mjs";
import { categoryLabels, formatDateMonthDayYear } from "../../utils/utils.mjs";

export const parseBlogData = async (blogEntries) => {
  const mainBlog = blogEntries.main;
  const blogPages = blogEntries.pages;

  const outputDir = "./build/public/img";
  const mainPageFeatImageDescription =
    mainBlog.properties.featuredImageDescription?.rich_text[0]?.plain_text;
  const mainPageFeatImage = await downloadImage(
    mainBlog.properties.featuredImage?.files[0]?.file?.url,
    mainPageFeatImageDescription,
    outputDir,
  );

  const blogs = {
    main: {
      title: mainBlog.properties.title.rich_text[0]?.plain_text,
      body: mainBlog.contents,
      featuredImage: mainPageFeatImage,
      featuredImageDescription: mainPageFeatImageDescription,
      metaTitle: mainBlog.properties.metaTitle.rich_text[0]?.plain_text,
      permalink: "/blog/",
      categories: [],
    },
    categories: [],
    pages: [],
    featured: []
  };

  const blogPagesSortedByDate = blogPages.sort((a, b) => {
      if (a.properties?.published?.checkbox) {
            const dateA = a.properties?.publishDate?.date?.start || "1967-06-07";
            const dateB = b.properties?.publishDate?.date?.start || "1967-06-07";
            return new Date(dateB) - new Date(dateA);
        }
    })

    const blogCategories = {}

  for (const blog of blogPagesSortedByDate) {
    const published = blog.properties?.published?.checkbox
    if (published) {
        const properties = blog.properties;
        const id = properties.id.title[0].plain_text;
        const metaTitle = properties.metaTitle.rich_text[0]?.plain_text;
        const title = properties.title.rich_text[0]?.plain_text;
        const description = properties.description.rich_text[0]?.plain_text;
        const teaserText = properties.teaserText.rich_text[0]?.plain_text;
        const body = blog.contents;
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
          permalink: `/blog/${categoryId}/${id}/`,
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
        
        //This is for organizing actual blogs into categories
        if (categoryId && !blogCategories[categoryId]) {
          blogCategories[categoryId] = {};
          blogCategories[categoryId].pages = [];
          blogCategories[categoryId].pages.push(page);
          blogCategories[categoryId].id = categoryId;
          blogCategories[categoryId].label = category;
          blogCategories[categoryId].metaTitle = `${mainBlog.properties.metaTitle.rich_text[0]?.plain_text} - ${category} blogs`
          blogCategories[categoryId].description = `${mainBlog.properties.description.rich_text[0]?.plain_text} - ${category} blogs`
        } else {
            blogCategories[categoryId].pages.push(page);
        }
        
        if (featured) {
            blogs.featured.push(page);
        }
        //this is just to have a list of blog categories for the main blog page
        blogs.main.categories.push({id: categoryId, label: category || "Random"});
    
        blogs.pages.push(page);
    }
  }
  for (const cat of Object.values(blogCategories)) {
    blogs.categories.push(cat)
  }

  blogs.main.categories = [...new Map(blogs.main.categories.map(item => [item.id, item])).values()]

  return blogs;
};
