const app = require("./app/app");

const PORT = process.env.PORT || 9876;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
