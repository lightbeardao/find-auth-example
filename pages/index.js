import * as fcl from "@onflow/fcl";
import cookieCutter from "cookie-cutter";
import Head from "next/head";
import { Button, ButtonGroup } from "../components";
import { getName, getProfile } from "../lib/config";
import { useState } from "react";
import ProfileDisplay from "../components/ProfileDisplay";

export function setCookie(key, value) {
  // set cookie
  cookieCutter.set(key, value);
}

export function deleteCookie(key) {
  // Delete a cookie
  cookieCutter.set(key, "", { expires: new Date(0) });
}

export const sendVerification = async (name, magicString, signature) => {
  return fetch("/api/auth/flow", {
    method: "POST",
    body: JSON.stringify({
      name: name,
      magicString: magicString,
      signatures: signature,
    }),
  })
    .then((response) => response.json())
    .catch((e) => console.error("Error:", e));
};

export const signMessage = async (message) => {
  const MSG = Buffer.from(message).toString("hex");
  try {
    return await fcl.currentUser().signUserMessage(MSG);
  } catch (error) {
    console.log(error);
  }
};

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [localProfile, setLocalProfile] = useState(null);

  return (
    <div className="border min-h-full bg-gray-50 overflow-hidden">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col gap-8 items-center p-4 pb-20">
        <h1 className="text-3xl font-bold underline">Hello world!</h1>

        <p className="text-xl">
          Open the Console to see messages! (<kbd>F12</kbd>)
        </p>
        <ButtonGroup name="Stuff anyone can do (dApp)">
          <ProfileDisplay profile={localProfile} />
          <Button
            onClick={async () => {
              await fcl.authenticate();
              let currentUser = await fcl.currentUser().snapshot();
              console.log("The Current User", currentUser);

              let c = await getProfile(currentUser);
              setLocalProfile(c);
              console.log("getProfile", c);
            }}
          >
            Get my Profile
          </Button>
          <Button
            onClick={async () => {
              await fcl.authenticate();
              let currentUser = await fcl.currentUser().snapshot();
              let c = await getName(currentUser.addr);
              console.log("default name:", c);
            }}
          >
            Get my FIND name
          </Button>
        </ButtonGroup>

        <ButtonGroup name="Sign In (to YourApp)">
          <Button
            onClick={async () => {
              await fcl.authenticate();
              let currentUser = await fcl.currentUser().snapshot();
              let c = await getProfile(currentUser);
              console.log("getProfile", c);
              
              // For now, we can only sign in as the default name
              let loginAs = c.findName;
              
              // First, we fetch the magic string to sign
              let { toSign, name, magicString } = await fetch(
                `/api/auth/flow?name=${loginAs}`
                ).then((x) => x.json());
                let signature = await signMessage(toSign);
                
                console.log("toSign", toSign);
                console.log("signed", signature);
                
                // Then, we post the response to the endpoint
                const result = await sendVerification(
                  name,
                  magicString,
                  signature
                  );
                  console.log("Result", result);
                  
                  // if successful, set a cookie!
                  if (result.loggedIn) {
                    setProfile(result.profile);
                    setCookie("authToken", result.token);
                  }
                }}
          >
            Sign in with Profile
          </Button>

          <Button
            onClick={async () => {
              const token = cookieCutter.get("authToken");
              console.log("Cookie:", token);
              
              let result = await fetch("/api/sample-auth", {
                headers: {
                  Authorization: token,
                },
              })
              .then((x) => x.json())
              .catch((e) => {
                console.error(e);
              });
              console.log("Server says", result);
            }}
          >
            Make authenticated request
          </Button>
          <ProfileDisplay profile={profile} />
        </ButtonGroup>

        <ButtonGroup name="Sign out">
          <Button
            onClick={async () => {
              deleteCookie("authToken");
              console.log("No longer logged in!");
              setProfile(null);
            }}
          >
            Sign out with Profile
          </Button>
        </ButtonGroup>
      </main>

      <footer className="fixed bottom-0 grid place-center w-full">
        <a
          href="https://find.xyz/"
          target="_blank"
          rel="noopener noreferrer"
          className="border bg-green-100 p-2 px-4"
        >
          FIND a treat
        </a>
      </footer>
    </div>
  );
}
