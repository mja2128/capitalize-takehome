const express = require('express');
const axios = require('axios');

const app = express();

app.get('/alight-companies', async function (req, res) {
    const { name: companyName } = req.query;
    const { data } = await axios.get(`https://beplb07.alight.com/client/${companyName}/benefitCenter`);
    return res.send(data);
});

app.get('/capitalize-companies', async function (req, res) {
    const { name: companyName } = req.query;
    const { data } = await axios.get(`https://api.hicapitalize.com/api/v1/companies`, {
        params: {
            company_name: companyName,
        }
    });
    return res.send(data);
});

app.listen(process.env.PORT || 3000);
