import fs from 'fs';
import readline from 'readline';
import path from 'path';

export default async function (req, res) {
  if (req.method === 'POST') {
    console.log("in lookup.js query is: ", req.body.query);
    const query = req.body.query;
    const dictionaryPath = path.join(process.cwd(), 'public', 'chinese_dict.txt');
    const stream = fs.createReadStream(dictionaryPath);
    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity
    });

    let translation = "Not found";
    
    for await (const line of rl) {
      const [traditional, simplified, ...definitionParts] = line.split(' ');
      if (traditional === query || simplified === query) {
        translation = definitionParts.join(' '); // Join the rest of the parts to form the definition
        break;
      }
    }

    rl.close();
    res.status(200).json({ result: translation });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}