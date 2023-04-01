import puppeteer from 'puppeteer';

import Company from "../types/Company";

export default async function crawlCompanyPage(companyPageUrl: string): Promise<Company> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(companyPageUrl);

    // crawl top level company info (name, headquarters, phone number, etc.)
    const h5 = await page.$('h5');
    const companyName = await page.evaluate(el => el.textContent, h5);
    const parentElement = await h5.getProperty('parentElement');
    const grandparentElement = await parentElement.getProperty('parentElement');
    const children = await grandparentElement.getProperty('children');
    const numberOfChildren = await (await children.getProperty('length')).jsonValue();
    let industry, headquarters, phoneNumber, contact, ein;
    for (let i = 0; i < numberOfChildren; i++) {
        const child = await children.evaluateHandle((el, i) => el.item(i), i);
        const childText = await child.evaluate(el => el.textContent);
        if (childText.includes('Industry')) {
            industry = childText.replace('Industry', '');
        } else if (childText.includes('Headquarters')) {
            headquarters = childText.replace('Headquarters', '');
        } else if (childText.includes('Phone number')) {
            phoneNumber = childText.replace('Phone number', '');
        } else if (childText.includes('Contact')) {
            contact = childText.replace('Contact', '');
        } else if (childText.includes('EIN')) {
            ein = childText.replace('EIN', '');
            break;
        }
    }

    // crawl company 401(k) plan info (plan name, website, etc.)
    const providerTitleDiv = await (await page.$('text/401(k) provider')).getProperty('parentElement');
    const providerDiv = await (await providerTitleDiv.getProperty('nextElementSibling')).getProperty('firstElementChild');
    const providerName = await providerDiv.evaluate(el => el.textContent);
    const planInfoDiv = await page.$('text/Plan name');
    const parent = await planInfoDiv.getProperty('parentElement');
    const grandparent = await parent.getProperty('parentElement');
    const greatGrandparent = await grandparent.getProperty('parentElement');
    const planInfoSections = await greatGrandparent.getProperty('children');
    const numberOfPlanInfoSections = await (await planInfoSections.getProperty('length')).jsonValue();
    let planName, website, planPhoneNumber, faxNumber, hoursOfOperation, address;
    for (let i = 0; i < numberOfPlanInfoSections; i++) {
        const planInfoSection = await planInfoSections.evaluateHandle((el, i) => el.item(i), i);
        const planInfoSectionText = await planInfoSection.evaluate(el => el.textContent);
        if (planInfoSectionText.includes('Plan name')) {
            planName = planInfoSectionText.replace('Plan name', '');
        } else if (planInfoSectionText.includes('Website')) {
            const planInfoSectionChildren = await planInfoSection.getProperty('children');
            const login = await planInfoSectionChildren.evaluateHandle(el => el.item(1));
            const loginChildren = await login.getProperty('children');
            const loginChild = await loginChildren.evaluateHandle(el => el.item(0));
            if (await loginChild.evaluate(el => el === null)) {
                website = 'n/a';
            } else {
                const loginGrandchildren = await loginChild.getProperty('children');
                const loginGrandchild = await loginGrandchildren.evaluateHandle(el => el.item(0));
                website = await loginGrandchild.evaluate(el => el.getAttribute('href'));
            }
        } else if (planInfoSectionText.includes('Phone number')) {
            planPhoneNumber = planInfoSectionText.replace('Phone number', '');
        } else if (planInfoSectionText.includes('Fax number')) {
            faxNumber = planInfoSectionText.replace('Fax number', '');
        } else if (planInfoSectionText.includes('Hours of operation')) {
            hoursOfOperation = planInfoSectionText.replace('Hours of operation', '');
        } else if (planInfoSectionText.includes('Address')) {
            address = planInfoSectionText.replace('Address', '');
            break;
        }
    }

    const company: Company = {
        description: '',
        name: companyName,
        industry,
        headquarters,
        phoneNumber,
        contact,
        ein,
        "401kPlan": {
            name: planName,
            provider: providerName,
            websiteURL: website,
            phoneNumber: planPhoneNumber,
            faxNumber,
            hoursOfOperation,
            address,
        }
    };
    await browser.close();
    return company;
}
