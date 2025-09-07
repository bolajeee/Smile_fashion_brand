// global styles
import "../assets/css/styles.scss";
import "swiper/css";
import "rc-slider/assets/index.css";
import "react-rater/lib/react-rater.css";

// types
import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";
import Router from "next/router";
import React, { Fragment } from "react";
import { SessionProvider } from "next-auth/react";
import { AppContextProvider } from '@/contexts/AppContext';
import { Provider } from "react-redux";
import { makeStore } from "@/store";

import * as gtag from "../utils/gtag";

const isProduction = process.env.NODE_ENV === "production";
const store = makeStore();

// only events on production
if (isProduction) {
  // Notice how we track pageview when route is changed
  Router.events.on("routeChangeComplete", (url: string) => gtag.pageview(url));
}

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--main-font",
});

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => (
  <SessionProvider session={session}>
    <AppContextProvider>
      <Provider store={store}>
      <Fragment>
        <style jsx global>{`
          :root {
            --main-font: ${poppins.style.fontFamily};
          }
        `}</style>
        <Component {...pageProps} />
      </Fragment>
      </Provider>
    </AppContextProvider>
  </SessionProvider>
);

export default MyApp;
