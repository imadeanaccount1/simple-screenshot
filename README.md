## Simple Screenshot Generator

A simple Next.js API that takes a screenshot of a website and returns it.

API Endpoint: https://simple-screenshot.vercel.app/api

## Usage

If you want to run this API locally, use the `local` branch, which has the same request formatting/schemas. If you want to deploy to Vercel or Netlify, use the `main` branch.

Simply run `npm run dev` or `npm run build && npm run start` on either branch to run!

## Methods

- **GET `api/screenshot`**

  Get a screenshot of an entire page based on its URL.

  Example URL: [https://simple-screenshot.vercel.app/api/screenshot?width=500&height=500&url=https://wasteof.money](https://simple-screenshot.vercel.app/api/screenshot?width=500&height=500&url=https://wasteof.money)

  You can choose to pass parameters through query parameters, headers, cookies, or a mix.

  Request Parameters (cookies, headers, or URL params):

  - url **(required)**
  - width (number of pixels) (optional) - Default Value: 1920
  - height (number of pixels) (optional) - Default Value: 1080
  - cookiesList (a JSON string array in the form `[{ "name": "token", "value": "", "domain": "wasteof.money" }]` that can be used to pass cookies to the site you are taking a screenshot of (e.g. for authentication)) (optional) - Default Value: "[]"
  - scale (float representing the scale of the screenshot) (optional) - Default Value: 1
  - extraHeaders (a JSON string object in the form `{"user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36"}` that allows you to pass headers to the site you are taking a screenshot of (e.g. to set user theme, user agent, language)) (optional) - Default Value: "{}"
  - mediaFeatures (a JSON string array in the form `[{ "name": "prefers-color-scheme", "value": "dark" }]` that allows you to specify media feature values to the page you are screenshotting (e.g. to set color theme preference)) (optional) - Default Value: "[]"

  Returns:
  a jpeg image response

## Credits

This API was made for [@radeeyate](https://github.com/radeeyate).

## Todo:

- [ ] better type safety
- [ ] error handling
