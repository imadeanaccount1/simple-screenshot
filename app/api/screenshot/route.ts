import { NextResponse, NextRequest } from "next/server";
import { cookies, headers } from "next/headers";
const puppeteer = require("puppeteer");

async function screenshot(url: any, width: any, height: any) {
  const browser = await puppeteer.launch({
    defaultViewport: {
      width: parseInt(width),
      height: parseInt(height),
    },
    headless: "new",
  });
  console.log("browser");
  const pageOne = await browser.newPage();
  console.log("page");
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
  console.log(cookieStore.get("width"));

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
  console.log(width, height, url);

  const file = await screenshot(url, width, height);

  // const image3 = await fs.readFileSync(`./scrapingbee_homepage.jpg`);

  const response = new NextResponse(file, {
    headers: {
      "content-type": "image/jpg",
    },
  });

  response.headers.set("content-type", "image/jpeg");
  return response;
}
