import fs from "fs";
import axios from "axios";

async function generateSitemap() {
  try {
    const today = new Date().toISOString().split("T")[0];

    // 1️⃣ Fetch all products
    const { data: products } = await axios.get(
      "https://bookanytimeserver2-0.onrender.com/api/properties/getall"
    );

    // 2️⃣ Fetch all offers
    const { data: offers } = await axios.get(
      "https://bookanytimeserver2-0.onrender.com/api/offers/active"
    );

    // 3️⃣ Static pages
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
      // Static pages
      ...staticUrls.map(
        (u) => `
        <url>
          <loc>https://bookanytime.in/${u.loc}</loc>
          <lastmod>${today}</lastmod>
          <priority>${u.priority}</priority>
        </url>`
      ),

      // Products with name & first image
      ...products.map(
        (p) => `
        <url>
          <loc>https://bookanytime.in/products/${p._id}</loc>
          <lastmod>${p.updatedAt?.split("T")[0] || today}</lastmod>
          <priority>0.8</priority>
          ${p.images && p.images.length
            ? `<image:image>
                 <image:loc>${p.images[0]}</image:loc>
                 <image:title>${p.name}</image:title>
               </image:image>`
            : ""
          }
        </url>`
      ),

      // Offers with first image and title
      ...offers.map(
        (o) => `
        <url>
          <loc>https://bookanytime2.netlify.app/offer/${o._id}</loc>
          <lastmod>${today}</lastmod>
          <priority>0.9</priority>
          ${o.image && o.image.length
            ? `<image:image>
                 <image:loc>${o.image[0]}</image:loc>
                 <image:title>${o.name}</image:title>
               </image:image>`
            : ""
          }
        </url>`
      ),
    ];

    // Build XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join("\n")}
</urlset>`;

    // Save to public folder
    fs.writeFileSync("public/sitemap.xml", xml, "utf8");
    console.log("✅ Sitemap generated with product & offer images!");
  } catch (err) {
    console.error("❌ Error generating sitemap:", err.message);
  }
}

generateSitemap();
