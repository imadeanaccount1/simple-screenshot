// const fs = require("fs");
import { NextResponse, NextRequest } from "next/server";
// const chromium = require("@sparticuz/chromium-min");
// const puppeteer = require("puppeteer");

// async function screenshot(url: any, width: any, height: any) {
//   const browser = await puppeteer.launch({
//     args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
//     defaultViewport: chromium.defaultViewport,
//     executablePath: await chromium.executablePath(
//       `https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar`
//     ),
//     headless: chromium.headless,
//     ignoreHTTPSErrors: true,
//   });
//   console.log("browser");
//   const pageOne = await browser.newPage();
//   console.log("page");
//   await pageOne.goto("https://css.land");

//   const file = await pageOne.screenshot();
//   browser.close();

//   // await pageOne.waitForTimeout(50000);
//   return file;
// }
const chromium = require("@sparticuz/chromium-min");
const puppeteer = require("puppeteer");
let _page: any;

async function getBrowser() {
  // local development is broken for this 👇
  // but it works in vercel so I'm not gonna touch it
  return puppeteer.launch({
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(
      `https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar`
    ),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
}

async function getPage() {
  if (_page) return _page;

  const browser = await getBrowser();
  _page = await browser.newPage();
  return _page;
}

export async function getScreenshot(url: any, ratio = 1) {
  const page = await getPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });
  await page.setViewport({
    width: 1000,
    height: 600,
    devicePixelRatio: ratio,
  });
  const file = await page.screenshot();
  return file;
}
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const width = searchParams.get("width");
  const height = searchParams.get("height");
  const url = searchParams.get("url");
  console.log(width, height, url);

  const file = await getScreenshot(url);

  // const image3 = await fs.readFileSync(`./scrapingbee_homepage.jpg`);

  const response = new NextResponse(file, {
    headers: {
      "content-type": "image/jpg",
    },
  });

  response.headers.set("content-type", "image/jpeg");
  return response;
}
