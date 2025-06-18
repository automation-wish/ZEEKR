import { Helmet } from "react-helmet";
import ZeekrChatbot from "./ZeekrChatbot";

export default function App() {
  return (
    <>
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,maximum-scale=1"
        />
      </Helmet>

      <ZeekrChatbot />
    </>
  );
}
