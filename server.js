console.log('hey')
const express = require("express");
const app = express();
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    next();
});
console.log('used')
app.use(express.static("public"))
app.listen(8079)
console.log('listening')
