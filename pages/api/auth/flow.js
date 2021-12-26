// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  temporaryJWT,
  generateMessage,
  userJWT,
  verifySignatures,
} from "../../../lib/authentication";
import { getProfileFromFind } from "../../../lib/config";

export default async function handler(req, res) {
  if (req.method === "POST") {
    let { name, magicString, signatures } = JSON.parse(req.body);

    let valid = await verifySignatures(name, magicString, signatures);

    if (valid) {
      console.log(`Successfully signed in as ${name}...`);
      const token = userJWT(name);
      const c = await getProfileFromFind(name);
      res.status(200).json({ token, loggedIn: name, profile: c });
    } else {
      res.status(200).json({ error: "Oops! We can't log you in" });
    }
  } else {
    console.log(req.query);
    let name = req.query.name;
    let magicString = temporaryJWT();
    let message = generateMessage(name, magicString);
    res.status(200).json({ toSign: message, magicString, name });
  }
}
