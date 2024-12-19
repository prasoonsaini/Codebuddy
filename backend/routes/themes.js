const { Router, json } = require('express');
const themesRouter = Router();

themesRouter.use(json());
const themes = [{ "id": "dark", "name": "Dark Theme" },
{ "id": "light", "name": "Light Theme" }]

themesRouter.get('/', (req, res) => {
    res.status(200).json({ themes: themes })
})

themesRouter.post('/select', (req, res) => {
    const theme = req.theme;
    res.status(200).json({ message: "Theme is setted!" })
})

module.exports = {
    themesRouter,
};
