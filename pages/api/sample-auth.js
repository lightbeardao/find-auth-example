// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { checkUserJWT } from "../../lib/authentication";

export default function handler(req, res) {
  let token = req.headers.authorization;
  let v = checkUserJWT(token);
  if (v.valid) {
    res
      .status(200)
      .json({ message: "You have full access to the server!", proof: v.data });
  } else {
    res.status(500).json({ error: "No access!" });
  }
}
