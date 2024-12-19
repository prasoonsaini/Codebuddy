const { Router, json } = require('express');
const codeRouter = Router();

codeRouter.use(json());

codeRouter.post('/submit', (req, res) => {
    const code = req.code;
    const lang = req.language;
    const input = req.input;
    //// send the code to run-machine
    const output = "output";
    const executionTime = 1.2;
    const compilerResponse = {
        status: 200,
        verdict: "AC"
    }
    res.status(200).json({
        message: "Code submitted successfully",
        output: output, executionTime: executionTime, compilerResponse: compilerResponse
    })
})

codeRouter.get('/languages', (req, res) => {
    const lang = [
        { language: 'c++', id: 'cpp' },
        { language: 'java', id: 'java' },
        { language: 'python', id: 'py' },
        { language: 'javascript', id: 'js' },
    ]
    res.status(200).json({ languages: lang });
})


module.exports = {
    codeRouter,
};
