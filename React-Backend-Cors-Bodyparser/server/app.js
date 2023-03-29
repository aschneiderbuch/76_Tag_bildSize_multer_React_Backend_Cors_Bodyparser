import express from "express"
import { appendFile, readFile, writeFile } from "./helper.js"
import cors from "cors"
import multer from "multer"
import { fileTypeFromBuffer } from 'file-type'
import fs from 'fs'
import morgan from "morgan"

const PORT = 7777
const app = express()

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2000000 }

})

app.use(morgan("dev"))

// Middleware zum Parsen von JSON und zur Behandlung von CORS hinzufügen
// app.use(express.json())
app.use(cors({ origin: "http://localhost:5174" }))

app.use("/images", express.static("./images"))

// Handler für GET-Anfragen auf "/api/getPosts"
app.get("/api/getPosts", (req, res) => {
    // Aufruf der "readFile"-Funktion, um den Inhalt der Datei zu lesen
    readFile()
        // Senden des Inhalts als JSON zurück an den Client
        .then(data => res.json(data))
        // Konsolenausgabe im Falle eines Fehlers
        .catch(err => console.log(err))
})

// Handler für POST-Anfragen auf "/api/addPost"
app.post("/api/addPost", upload.single("postImage"), (req, res) => {
    const data = req.body

    console.log(data);

    /**
     * Wir prüfen anhand der MAgicNumber um was für eine Datei es sich handelt und 
     * da wir unsere Datei nur im Buffer liegen haben müssen wir sie selber speichern
     */
    fileTypeFromBuffer(req.file.buffer)
        .then(result => {
            if (result.ext === 'png' || result.ext === 'jpeg' || result.ext === 'jpg') {
                let filename = new Date().getTime()
                filename += '.' + result.ext
                fs.writeFile('./images/' + filename, req.file.buffer, (err) => {
                    if (err) console.log(err)
                    else {
                        //@TODO den Post erstellen und speichern
                        // console.log(filename)
                        // console.log(data) 
                        // ! .image(filename=Bilddatei) dem     object data      hinzufügen 
                        // ! den Dateinamen der   Bilddatei filename     zu den Daten des neu erstellten Posts hinzufügen
                        // ! damit Bildname im FrontEnd und in der posts.json auftaucht 
                        data.image = filename   // ! hier image rein und in SinglePost.jsx bei src noch /images/ rein 
                        data.test = "test" // !!! wird in die posts.json geschrieben eingefügt
                        console.log(data)
                        // console.log(data.image)

                        appendFile(data)
                            .then(newData => res.json(newData))
                            .catch(err => console.log(err))
                        console.log(req.file)
/*                         res.send("OK")
 */                    }
                })
            }
            else {
                res.status(418).end()
            }
        })
})

// Starten des Servers auf dem definierten Port und Konsolenausgabe
app.listen(PORT, () => console.log("Server läuft auf PORT" + PORT))
