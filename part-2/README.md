# Capitalize Takehome Part 2

## Prerequisites:
* Install Node: https://nodejs.org/en/download

## To Run:
1. In this directory (`/capitalize-takehome/part-2`), run the following commands:
   1. `npm i`
   2. `npm run start`
   3. If your local port 3000 is in use, please change `part-2/package.json` line 12 to use a free port on your machine
   4. In Postman or the API testing tool of your choice, send a request to either of the following endpoints

## API Endpoints
* `GET /alight-companies?name=<company name to search>`
  * Query Params:
    * `name`: The name of a company to search for
  * Returns:
    * An array of company objects returned from the Alight company benefit center API

* `GET /capitalize-companies?name=<company name to search>`
    * Query Params:
        * `name`: The name of a company to search for
    * Returns:
      * An array of company objects returned from the Capitalize company search API
