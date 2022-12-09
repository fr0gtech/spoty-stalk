import "public/globals.css";
import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import { FocusStyleManager, HotkeysProvider } from "@blueprintjs/core";
import store from "../redux/store"
import { Provider } from "react-redux"
import {SessionProvider} from 'next-auth/react';
import dynamic from "next/dynamic";

FocusStyleManager.onlyShowFocusOnTabs();
const queryClient = new QueryClient();
export default function App({Component, pageProps: {session, ...pageProps}}: AppProps) {
  const MusicPlayer = dynamic(() => import("../components/musicPlayer"), {
    ssr: false,
  })
  return (
    <Provider store={store}>
    <QueryClientProvider client={queryClient}>
    <SessionProvider session={session}>
    <HotkeysProvider>
      <div className="bp4-dark mx-auto">
      <Component {...pageProps} />
      <MusicPlayer/>
      </div>
    </HotkeysProvider>

    </SessionProvider>
    </QueryClientProvider>
    </Provider>
  );
}
