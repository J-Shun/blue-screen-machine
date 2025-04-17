import Screen from "./containers/Screen";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster toastOptions={{ duration: 2000 }} />
      <Screen />
    </>
  );
}

export default App;
