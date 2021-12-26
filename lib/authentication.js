const jwt = require("jsonwebtoken");

import * as fcl from "@onflow/fcl";

export const JWT_KEY = "something_private_and_long_enough_to_secure";

// When the client calls /auth/flow, we generate a magic string for the client to sign
// This key expires in 15 minutes
export function temporaryJWT() {
  return jwt.sign({ id: 2 }, JWT_KEY, {
    expiresIn: 60 * 15 * 1 * 1000,
  });
}

// This is a deterministic function that is used both when we generate a message
// and when we verify it
export function generateMessage(name, magicString) {
  return `Do you want to sign in as ${name}?\n\nWe include this magic string for extra \nsecurity:\n\n${magicString}`;
}

// When the client calls POST /auth/flow
// verifySignatures does 2 things!
// first, it verifies the magicString (a temporaryJWT) to make sure that we generated it
// and that it hasn't expired (which might be the case when it's a replay attack)
// second, it checks that the user indeed signed the message
export const verifySignatures = async (
  name,
  magicString,
  compositeSignatures
) => {
  // step (1) - validate the salt
  // skipping for simplicity, assume magicString is valid

  // step (2) - validate the signature
  let message = generateMessage(name, magicString);
  message = Buffer.from(message).toString("hex");

  console.log("Received signatures:", compositeSignatures);
  try {
    return await fcl.verifyUserSignatures(message, compositeSignatures);
  } catch (error) {
    console.log(error);
  }
};

// this is the final JWT that the user gets, to signify logged-in status
export function userJWT(name) {
  return jwt.sign({ name: name }, JWT_KEY, {
    expiresIn: 60 * 60 * 24 * 1000,
  });
}
