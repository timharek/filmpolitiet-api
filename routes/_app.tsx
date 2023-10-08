import { AppProps } from "$fresh/server.ts";
import { Footer } from "../components/Footer.tsx";
import { Header } from "../components/Header.tsx";

export default function App({ Component }: AppProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Filmpolitiet API</title>
      </head>
      <body class="dark:(bg-slate-900 text-white)">
        <Header />
        <Component />
        <Footer />
      </body>
    </html>
  );
}
