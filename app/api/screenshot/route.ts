// const fs = require("fs");
import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import { cookies } from "next/headers";
const chromium = require("@sparticuz/chromium-min");
const puppeteer = require("puppeteer");

async function screenshot(
  url: string,
  width: string,
  height: string,
  cookiesList: Array<{
    name: string;
    value: string;
    domain: string;
    path?: string;
    expires?: number;
    size?: number;
    httpOnly?: boolean;
    secure?: boolean;
    session?: boolean;
  }>,
  scale: string,
  extraHeaders: {
    [key: string]: any;
  },
  mediaFeatures: Array<{
    name: string;
    value: string;
  }>
) {
  const browser = await puppeteer.launch({
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: {
      width: parseInt(width),
      height: parseInt(height),
      deviceScaleFactor: parseFloat(scale),
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
  if (Object.keys(extraHeaders).length > 0) {
    await pageOne.setExtraHTTPHeaders(extraHeaders);
  }
  if (mediaFeatures.length > 0) {
    await pageOne.emulateMediaFeatures(mediaFeatures);
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
  const width: string =
    searchParams.get("width") ||
    headersList.get("width") ||
    (cookieStore.get("width") ? cookieStore.get("width")!.value : null) ||
    "1920";
  try {
    parseInt(width);
  } catch (err) {
    return new NextResponse("width is not an integer", {
      status: 400,
    });
  }
  const height: string =
    searchParams.get("height") ||
    headersList.get("height") ||
    (cookieStore.get("height") ? cookieStore.get("height")!.value : null) ||
    "1080";
  try {
    parseInt(height);
  } catch (err) {
    return new NextResponse("height is not an integer", {
      status: 400,
    });
  }
  const scale =
    searchParams.get("scale") ||
    headersList.get("scale") ||
    (cookieStore.get("scale") ? cookieStore.get("scale")!.value : null) ||
    "1";
  try {
    parseFloat(scale);
  } catch (err) {
    return new NextResponse("scale is not a float", {
      status: 400,
    });
  }
  const url: string | null =
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
    return new NextResponse("cookiesList is not valid JSON Array string", {
      status: 400,
    });
  }

  const extraHeaders =
    searchParams.get("extraHeaders") ||
    headersList.get("extraHeaders") ||
    (cookieStore.get("extraHeaders")
      ? cookieStore.get("extraHeaders")!.value
      : null) ||
    "{}";
  try {
    JSON.parse(extraHeaders);
  } catch (err) {
    return new NextResponse("extraHeaders is not valid JSON Object string", {
      status: 400,
    });
  }

  const mediaFeatures =
    searchParams.get("mediaFeatures") ||
    headersList.get("mediaFeatures") ||
    (cookieStore.get("mediaFeatures")
      ? cookieStore.get("mediaFeatures")!.value
      : "[]");
  try {
    JSON.parse(mediaFeatures);
  } catch (err) {
    return new NextResponse("mediaFeatures is not valid JSON Array string", {
      status: 400,
    });
  }
  const file = await screenshot(
    url,
    width,
    height,
    JSON.parse(cookiesList),
    scale,
    JSON.parse(extraHeaders),
    JSON.parse(mediaFeatures)
  );

  // const image3 = await fs.readFileSync(`./scrapingbee_homepage.jpg`);

  const response: NextResponse = new NextResponse(file, {
    headers: {
      "content-type": "image/jpg",
    },
  });

  response.headers.set("content-type", "image/jpeg");
  return response;
}
