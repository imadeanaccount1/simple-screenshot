## Screenshot Generator
A simple Next.js API that takes a screenshot of a website and returns it.

API Endpoint: https://simple-screenshot.vercel.app/api

## Methods
- **GET `api/screenshots`**

  Get a screenshot of an entire page based on its URL.

  Example URL: [https://simple-screenshot.vercel.app/api/screenshot?width=500&height=500&url=https://wasteof.money](https://simple-screenshot.vercel.app/api/screenshot?width=500&height=500&url=https://wasteof.money)
  
  Request Parameters:
    - width (in pixels)
    - height (in pixels)
    - url (https only i think)
  Returns:
  a jpeg image response

## Credits
This API was made for [@radeeyate](https://github.com/radeeyate)
