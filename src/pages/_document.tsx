import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Custom fonts, global metadata, etc. */}
        <meta name="description" content="Cyberguard Frontend" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
