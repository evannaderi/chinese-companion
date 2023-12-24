import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const { id } = req.query; // Extract the file ID from the URL
    const filePath = path.join('/tmp', `${id}.mp3`); // Path to the file in the /tmp directory

    if (fs.existsSync(filePath)) {
        // If the file exists, stream it back to the client
        res.setHeader('Content-Type', 'audio/mpeg');
        fs.createReadStream(filePath).pipe(res);
        console.log("File exists!!", filePath);
    } else {
        // If the file does not exist, return a 404 error
        res.status(404).json({ error: "File not found" });
        console.log("File does not exist!!", filePath);
    }
}
