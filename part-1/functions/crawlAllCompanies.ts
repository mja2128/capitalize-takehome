import ObjectsToCsv = require("objects-to-csv");
import puppeteer from 'puppeteer';

import crawlCompanyPage from "./crawlCompanyPage";

async function crawlAllCompanies() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const allCompaniesPageUrl = 'https://www.hicapitalize.com/find-my-401k/';
    await page.goto(allCompaniesPageUrl);

    const companyNameElement = await page.$('text/Company name');
    const grandparent = await (await companyNameElement.getProperty('parentElement')).getProperty('parentElement');
    // skip a row because there is an invisible one
    let companyRow = await (await grandparent.getProperty('nextElementSibling')).getProperty('nextElementSibling');
    // minus 2 to account for header row and invisible extra row
    // const numberOfCompanies = (await (await (await grandparent.getProperty('parentElement')).getProperty('childElementCount')).jsonValue()) - 2;
    // crawl just 90 company pages because I hit some sort of anti-DoS protection and get a 403 if I go much further
    const numberOfCompanies = 90;
    let companyCounter = 1;
    const companies = [];
    while (companyCounter <= numberOfCompanies && companyRow !== null) {
        const websiteElement = await (await companyRow.getProperty('children')).evaluateHandle(el => el.item(3));
        const websiteAnchor = await websiteElement.getProperty('firstElementChild');
        const websiteLink = await websiteAnchor.evaluate(el => el.getAttribute('href'));
        companies.push(await crawlCompanyPage(`${allCompaniesPageUrl}${websiteLink}`));
        companyRow = await companyRow.getProperty('nextElementSibling');
        companyCounter++;
    }

    const companiesCsv = new ObjectsToCsv(companies);
    await companiesCsv.toDisk('./companies.csv');

    await browser.close();
}

crawlCompanyPage('https://www.hicapitalize.com/find-my-401k/walmart').then(c => {
    console.log('Walmart Company Info:\n', c);
});

console.log('Crawling Capitalize Company 401(k) pages...');
crawlAllCompanies().then(() => {
    console.log('All set! Please see ./companies.csv for the results :)');
});
