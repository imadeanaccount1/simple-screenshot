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
  console.log("page", cookiesList.length);

  if (cookiesList.length > 0) {
    await pageOne.setCookie(...cookiesList);
  }
  await pageOne.goto(url);

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
    (cookieStore.get("width") ? cookieStore.get("width")!.value : null) ||
    "1920";
  const height =
    searchParams.get("height") ||
    headersList.get("height") ||
    (cookieStore.get("height") ? cookieStore.get("height")!.value : null) ||
    "1080";
  const url =
    searchParams.get("url") ||
    headersList.get("url") ||
    (cookieStore.get("url") ? cookieStore.get("url")!.value : null);
  if (!url) {
    return new NextResponse("url is required", {
      status: 400,
    });
  }
  const cookiesList =
    searchParams.get("cookiesList") ||
    headersList.get("cookiesList") ||
    (cookieStore.get("cookiesList")
      ? cookieStore.get("cookiesList")!.value
      : null) ||
    "[]";
  console.log(width, height, url, cookiesList);

  try {
    JSON.parse(cookiesList);
  } catch (err) {
    return new NextResponse("cookiesList is not valid JSON string", {
      status: 400,
    });
  }

  const file = await screenshot(url, width, height, JSON.parse(cookiesList));

  // const image3 = await fs.readFileSync(`./scrapingbee_homepage.jpg`);

  const response = new NextResponse(file, {
    headers: {
      "content-type": "image/jpg",
    },
  });

  response.headers.set("content-type", "image/jpeg");
  return response;
}
