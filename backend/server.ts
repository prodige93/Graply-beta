import express = require("express");
import cors = require("cors");

import webhookRouter from "./routes/webhook";

//Configuration / initialisation du server Express
const app = express();

app.use(cors());

// IMPORTANT : le webhook Stripe a besoin du body brut — doit être déclaré AVANT express.json()
app.use("/api/webhook", express.raw({ type: "application/json" }), webhookRouter);


app.use(express.json());

//Initialisation au lancement du serveur 
app.get("/api", (_req, res) => {
    console.log("Requête reçue sur /api")
    res.send("API running 🚀")
});

//Écoute du server sur le port 3300
app.listen(3300, () => {
    console.log("Server running on port 3300 🚀");
})