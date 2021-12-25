import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { getProfile } from "../lib/config";
import * as fcl from "@onflow/fcl";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{" "}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div styles={{ display: "flex" }}>
          <button
            onClick={async () => {
              let c = await fcl.authenticate();
              console.log("Authenticated", c);
            }}
          >
            Log in
          </button>

          <button
            onClick={async () => {
              let c = await fcl.unauthenticate();
              console.log("Logged out", c);
            }}
          >
            Log out
          </button>

          <button
            onClick={async () => {
              await fcl.authenticate();
              let currentUser = await fcl.currentUser().snapshot();
              console.log("The Current User", currentUser);

              let c = await getProfile(currentUser);
              console.log("getProfile", c);
            }}
          >
            Get my Profile
          </button>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
