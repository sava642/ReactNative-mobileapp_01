import React, { useState, useEffect } from "react";
import { Apploading } from "expo";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Main from "./components/Main";
import * as Font from 'expo-font';



export default function App() {
  const [iasReady, setIasReady] = useState(false);


  const loadApplication = async () => {
    await Font.loadAsync({
      "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    });

    setIasReady(true)


  };
  useEffect(() => {
    loadApplication()
  }, [])


  // if (!iasReady) {
  //   return (
  //     <Apploading
  //       startAsync={loadApplication}
  //       onFinish={() => setIasReady(true)}
  //       onError={console.warn}
  //     />
  //   )
  // }
  // if (!iasReady) {
  //   async () => {
  //     await Font.loadAsync({
  //       "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
  //     });
  //     setIasReady(true)
  //   };
  // var promise = await loadApplication()
  // promise.then(setIasReady(true))
  // }
  if (iasReady) {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
}

