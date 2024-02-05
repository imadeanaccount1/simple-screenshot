// const fs = require("fs");
import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import { cookies } from "next/headers";
const chromium = require("@sparticuz/chromium-min");
const puppeteer = require("puppeteer");

async function screenshot(url: any, width: any, height: any, cookiesList: any) {
  const browser = await puppeteer.launch({
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: {
      width: parseInt(width),
      height: parseInt(height),
    },
    executablePath: await chromium.executablePath(
      `https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar`
    ),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
  console.log("browser");
  const pageOne = await browser.newPage();
  console.log("page");
  await pageOne.goto(url);
  if (cookiesList.length > 0) {
    await pageOne.setCookie(...cookiesList);
    const cookiesSet = await pageOne.cookies(url);
    console.log(JSON.stringify(cookiesSet));
    await pageOne.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
  }

  const file = await pageOne.screenshot();
  browser.close();

  // await pageOne.waitForTimeout(50000);
  return file;
}
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const headersList = headers();
  const cookieStore = cookies();
  const width =
    searchParams.get("width") ||
    headersList.get("width") ||
    cookieStore.get("width")!.value;
  const height =
    searchParams.get("height") ||
    headersList.get("height") ||
    cookieStore.get("height")!.value;
  const url =
    searchParams.get("url") ||
    headersList.get("url") ||
    cookieStore.get("url")!.value;
  const cookiesList =
    searchParams.get("cookiesList") ||
    headersList.get("cookiesList") ||
    cookieStore.get("cookiesList")!.value ||
    "[]";
  console.log(width, height, url);
  // const referer = headersList.get("referer");
  console.log(width, height, url);

  const file = await screenshot(url, width, height, cookiesList);

  // const image3 = await fs.readFileSync(`./scrapingbee_homepage.jpg`);

  const response = new NextResponse(file, {
    headers: {
      "content-type": "image/jpg",
    },
  });

  response.headers.set("content-type", "image/jpeg");
  return response;
}
