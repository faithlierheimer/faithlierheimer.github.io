export default async function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("./src/css/")
    eleventyConfig.addWatchTarget("./src/css/");
    eleventyConfig.addPassthroughCopy("./src/public/img");
    eleventyConfig.addPassthroughCopy("./src/public/icons");
    eleventyConfig.addPassthroughCopy("public");

    eleventyConfig.setServerOptions({
        watch: ["./src/css/**/*.css"],
    });
    
    eleventyConfig.addFilter("wrapFirstWord", function (str) {
        if (!str) return "";
        const [firstWord, ...rest] = str.split(" ");
        return `<span class="title-start">${firstWord}</span>${
        rest.length ? " " + rest.join(" ") : ""
        }`;
    });
    
    return {
        dir: {
            input: "src",
            output: "build",
            includes: "_includes",
        }
    }
}