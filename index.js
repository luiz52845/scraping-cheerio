const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.get('/cotacao', async (req, res) => {
    try {
        const { data } = await axios.get('https://dolarhoje.com/');
        const $ = cheerio.load(data);
        const cotacaoDolar = $('#nacional').val().trim();

        if (cotacaoDolar) {
            res.status(200).json({
                status: 'success',
                data: {
                    timestamp: new Date().toISOString(),
                    cotacao: cotacaoDolar
                }
            });
        } else {
            res.status(404).json({
                status: 'error',
                message: 'Cotação do dólar não encontrada'
            });
        }
    } catch (error) {
        console.error('Erro ao buscar cotação:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Erro ao buscar cotação do dólar',
            error: error.message
        });
    }
});

app.use((req, res, next) => {
    res.header('Content-Type', 'application/json');
    next();
});

app.listen(port, () => {
    console.log(`Servidor rodando na http://localhost:${port}`);
});