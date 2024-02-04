const fs = require("fs");
import { NextResponse, NextRequest } from "next/server";
const puppeteer = require("puppeteer");

async function screenshot(url: any, width: any, height: any) {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: parseInt(width),
      height: parseInt(height),
    },
  });
  const pageOne = await browser.newPage();
  await pageOne.goto(url);

  await pageOne.screenshot({ path: `./scrapingbee_homepage.jpg` });

  // await pageOne.waitForTimeout(50000);
  browser.close();
  return null;
}
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const width = searchParams.get("width");
  const height = searchParams.get("height");
  const url = searchParams.get("url");
  console.log(width, height, url);

  await screenshot(url, width, height);

  const image3 = await fs.readFileSync(`./scrapingbee_homepage.jpg`);

  const response = new NextResponse(image3, {
    headers: {
      "content-type": "image/jpg",
    },
  });

  response.headers.set("content-type", "image/jpeg");
  return response;
}
