import { useEffect } from "react";
import "./App.css";
import Layout from "./components/Layout/Layout";
import { loadWeb3, onAccountChange } from './depositNFT'

function App() {
  useEffect(() => {
    loadWeb3();
  })
  return <Layout />;
}

export default App;
