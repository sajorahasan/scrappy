"use server";

import axios from "axios";
import * as cheerio from "cheerio";
import { extractDescription, extractPrice } from "../utils";

export async function scrapAmazonProduct(url: string) {
  if (!url) return;

  // curl --proxy brd.superproxy.io:22225
  // --proxy-user brd-customer-hl_99c9cdf3-zone-scrappy:5u2v5tn66dqy
  // -k "https://geo.brdtest.com/welcome.txt"

  // BrightData proxy configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (Math.random() * 2 - 1) * 100000;
  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  };

  try {
    const response = await axios.get(url, options);

    // console.log(response.data);

    const $ = cheerio.load(response.data);
    const title = $("#productTitle").text().trim();
    const currency = $(".priceToPay span.a-price-symbol")?.text().trim();
    const currentPrice = extractPrice(
      $(".priceToPay span.a-price-whole"),
      $(".a.size.base.a-color-price"),
      $(".a-button-selected .a-color-base")
    );
    const originalPrice = extractPrice(
      $("span.a-price.a-text-price span.a-offscreen"),
      $(".a-price.a-text-price span.a-offscreen"),
      $("#listPrice"),
      $("#priceblock_ourprice"),
      $("#priceblock_dealprice"),
      $(".a-size-base.a-color-price")
    );
    const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");
    const outOfStock = $("#availability span").text().trim().toLowerCase() === "currently unavailable";

    const images =
      $("#imgBlkFront").attr("data-a-dynamic-image") || $("#landingImage").attr("data-a-dynamic-image") || "{}";
    const imageUrls = Object.keys(JSON.parse(images));
    const description = extractDescription($);

    // Construct data object with scraped information
    const data = {
      url,
      currency: currency || "₹",
      images: imageUrls,
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: Number(discountRate),
      category: "category",
      reviewsCount: 100,
      stars: 4.5,
      isOutOfStock: outOfStock,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    };

    console.log(data);

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(`Failed to scrap product: ${error.message}`);
  }
}
