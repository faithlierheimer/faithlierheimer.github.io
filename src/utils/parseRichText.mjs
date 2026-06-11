// Converts a single rich-text run into HTML, handling annotations + links.
import { downloadImage } from "./createImg.mjs"
export const richTextToHTML = (rt) => {
  let html = rt.plain_text
    // Escape basic HTML entities
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const { bold, italic, underline, strikethrough, code } = rt.annotations;

  if (code)          html = `<code>${html}</code>`;
  if (bold)          html = `<strong>${html}</strong>`;
  if (italic)        html = `<em>${html}</em>`;
  if (underline)     html = `<u>${html}</u>`;
  if (strikethrough) html = `<s>${html}</s>`;

  // Link can live on rt.text.link.url or rt.href
  const url = rt.text?.link?.url ?? rt.href ?? null;
  if (url) html = `<a href="${url}">${html}</a>`;

  return html;
};

// Joins an array of rich-text runs into an HTML string.
export const renderRichText = (richTextArr) => {
  if (!Array.isArray(richTextArr)) {
    console.warn("renderRichText expected an array, got:", richTextArr);
    return "";
  }
  return richTextArr.map(richTextToHTML).join("");
};

const getVideoBlock = (url) => {
    if (!url) return`<!-- Unsupported VIDEO TYPE-->`

    if (url.includes("youtube.com")) {
      const ytUrl = new URL(url);
      const videoId = ytUrl.searchParams.get("v");
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;

      return `<iframe width='560' height='315' src=${embedUrl} title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' allowfullscreen></iframe>`
    }
    return `<!-- Unsupported VIDEO TYPE-->`;
}

// Converts a single block to an HTML string.
const blockToHTML = async (block) => {
  const { type } = block;

  switch (type) {
    case "paragraph":
      return `<p>${renderRichText(block.paragraph.rich_text)}</p>`;

    case "heading_1":
      return `<h1>${renderRichText(block.heading_1.rich_text)}</h1>`;

    case "heading_2":
      return `<h2>${renderRichText(block.heading_2.rich_text)}</h2>`;

    case "heading_3":
      return `<h3>${renderRichText(block.heading_3.rich_text)}</h3>`;

    case "bulleted_list_item":
      return `<li>${renderRichText(block.bulleted_list_item.rich_text)}</li>`;

    case "numbered_list_item":
      return `<li>${renderRichText(block.numbered_list_item.rich_text)}</li>`;

    case "quote":
      return `<blockquote>${renderRichText(block.quote.rich_text)}</blockquote>`;

    case "video":
      return getVideoBlock(block.video?.external?.url);

    case "divider":
      return `<div class="divider></div>`

    case "code": {
      const lang = block.code.language ?? "";
      return `<pre><code${lang ? ` class="language-${lang}"` : ""}>${renderRichText(block.code.rich_text)}</code></pre>`;
    }

    case "image": {
      const src =
        block.image.type === "external"
          ? block.image.external.url
          : block.image.file.url;

      const caption = renderRichText(block.image.caption);
      const hostedImg = await downloadImage(src, caption, "./build/public/img")
      return caption
        ? `<figure><img src="${hostedImg}" alt="${caption}" /><figcaption>${caption}</figcaption></figure>`
        : `<img src="${hostedImg}" alt="" />`;
    }

    default:
      return `<!-- Unsupported block: ${type} -->`;
  }
};

export const blocksToHTML = async (blocks) => {
  const parts = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (block.type === "bulleted_list_item") {
      const items = [];
      while (i < blocks.length && blocks[i].type === "bulleted_list_item") {
        items.push(await blockToHTML(blocks[i++]));
      }
      parts.push(`<ul>${items.join("")}</ul>`);

    } else if (block.type === "numbered_list_item") {
      const items = [];
      while (i < blocks.length && blocks[i].type === "numbered_list_item") {
        items.push(await blockToHTML(blocks[i++]));
      }
      parts.push(`<ol>${items.join("")}</ol>`);

    } else {
      parts.push(await blockToHTML(block));
      i++;
    }
  }

  return parts.join("\n");
};
