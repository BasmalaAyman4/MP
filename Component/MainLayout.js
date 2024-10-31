import React, { useEffect } from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import { Provider } from 'react-redux';
import {Store , persistor} from "@/Component/Redux/store";
const MainLayout = (props) => {
  return (
    <>
   <Provider store={Store}>
      <NavBar />
      
      {props.children}
      <Footer />
      </Provider>
    </>
  )
}

export default MainLayout
