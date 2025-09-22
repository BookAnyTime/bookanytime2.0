import fs from "fs";
import axios from "axios";

export const handler = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const { data: products } = await axios.get(
      "https://bookanytimeserver2-0.onrender.com/api/properties/getall"
    );

    const { data: offers } = await axios.get(
      "https://bookanytimeserver2-0.onrender.com/api/offers/active"
    );

    const staticUrls = [
      { loc: "", priority: 1.0 },
      { loc: "products", priority: 1.0 },
      { loc: "wishlist", priority: 0.8 },
      { loc: "list-your-property", priority: 0.8 },
      { loc: "maps", priority: 0.9 },
      { loc: "about", priority: 0.7 },
      { loc: "contact", priority: 0.7 },
    ];

    const urls = [
      ...staticUrls.map(
        (u) => `<url><loc>https://bookanytime.in/${u.loc}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority></url>`
      ),
      ...products.map(
        (p) => `<url><loc>https://bookanytime.in/products/${p._id}</loc><lastmod>${p.updatedAt?.split("T")[0] || today}</lastmod><priority>0.8</priority>${
          p.images?.length ? `<image:image><image:loc>${p.images[0]}</image:loc><image:title>${p.name}</image:title></image:image>` : ""
        }</url>`
      ),
      ...offers.map(
        (o) => `<url><loc>https://bookanytime2.netlify.app/offer/${o._id}</loc><lastmod>${today}</lastmod><priority>0.9</priority>${
          o.image?.length ? `<image:image><image:loc>${o.image[0]}</image:loc><image:title>${o.name}</image:title></image:image>` : ""
        }</url>`
      ),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join("\n")}
</urlset>`;

    // Save sitemap to /public folder
    fs.writeFileSync("./public/sitemap.xml", xml, "utf8");

    return {
      statusCode: 200,
      body: "✅ Sitemap regenerated!",
    };
  } catch (err) {
    return { statusCode: 500, body: "❌ Error: " + err.message };
  }
};
