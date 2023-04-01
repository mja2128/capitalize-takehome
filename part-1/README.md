# Capitalize Takehome Part 1

## Prerequisites:
* Install Node: https://nodejs.org/en/download

## To Run:
1. In this directory (`/capitalize-takehome/part-1`), run the following commands:
    1. `npm i`
    2. `npm run start`
   3. When it is complete, you should now have a file called `companies.csv` in this current directory containing a set of companies with info scraped from the Capitalize Find Your 401(k) page

## Notes / Challenges:
* I ran into an issue where I was getting a 403 Forbidden error from the capitalize website after crawling somewhere around 95 companies. It seems to be a time-based rate limit, so I could have possibly resolved this by adding a wait after a certain number of companies. However, I didn't do that here because I didn't want this program to run too slowly for those testing it. It already takes about a minute and a half as is.
* I couldn't figure out how to parse the company description text from a company page. I was mainly interacting with nodes/elements and couldn't figure out how to get free text that's the sibling of an element.
* I couldn't see the "find your 401(k)" pages in the sitemap, so I ended up getting many companies by parsing the list on the top-level find your 401(k) page. However, this may not be all companies that capitalize has info on. Also, I ran into the aforementioned limit doing it this way anyway, so this definitely isn't the ideal solution.
* CSV format isn't the best way to show the 401k plan info since it is in a nested object. The column for 401k info shows JSON, which technically is readable, but not the best presentation. For human consumption, I probably would print it out a bit differently, perhaps in some form of table. However, for machine consumption, this should work fairly well I think. I figured CSV is a good middle ground between human- and machine- readability.
* In general, my code to crawl this data is pretty brittle. I am depending on the current structure of the pages to stay the same. However, if a design change or something else happens to add or remove some divs, for example, this could all fall apart unfortunately. This could probably be improved by adding some fallback crawling logic, or better yet, training an AI-powered web crawler to read the page like a human would :)
* I probably also don't need to instantiate two different browser objects. I can probably pass one around as a parameter as needed.