/* pages/__app.js */
import "../styles/globals.css";
import { useState } from "react"; // manages local state
import Link from "next/link"; // allows you to create links between pages
import { css } from "@emotion/css";
import { ethers } from "ethers";
import Web3Modal from "web3modal"; // allows an easy way to get the users wallet
import WalletConnectProvider from "@walletconnect/web3-provider"; // allows users to use different wallets besides metamask
import { AccountContext } from "../context.js"; // manage and update address of the sign in user and pass that information around the application
import { ownerAddress } from "../config"; // address of the owner that deploys the contract
import "easymde/dist/easymde.min.css";

// app.js is the entry point to the application
// throw in any global imports here
function App({ Component, pageProps }) {
  /* create local state to save account information after signin */
  const [account, setAccount] = useState(null);
  /* web3Modal configuration for enabling wallet access */
  async function getWeb3Modal() {
    const web3Modal = new Web3Modal({
      cacheProvider: false,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: "your infura project id",
          },
        },
      },
    });
    return web3Modal;
  }

  /* the connect function uses web3 modal to connect to the user's wallet  with a click of a button */
  async function connect() {
    try {
      const web3Modal = await getWeb3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const accounts = await provider.listAccounts();
      setAccount(accounts[0]); // this will set the local state
    } catch (err) {
      console.log("error:", err);
    }
  }

  return (
    <div>
      <nav className={nav}>
        <div className={header}>
          <Link href="/">
            <a>
              <img src="/logo.svg" alt="React Logo" style={{ width: "50px" }} />
            </a>
          </Link>
          <Link href="/">
            <a>
              <div className={titleContainer}>
                <h2 className={title}>Full Stack</h2>
                <p className={description}>WEB3</p>
              </div>
            </a>
          </Link>
          {!account && (
            // if a  user is not signed in the display the button to connect
            <div className={buttonContainer}>
              <button className={buttonStyle} onClick={connect}>
                Connect
              </button>
            </div>
          )}
          {
            // else display account info
            account && <p className={accountInfo}>{account}</p>
          }
        </div>
        <div className={linkContainer}>
          <Link href="/">
            <a className={link}>Home</a>
          </Link>
          {
            /* if the signed in user is the contract owner, we */
            /* show the nav link to create a new post */
            account === ownerAddress && (
              <Link href="/create-post">
                <a className={link}>Create Post</a>
              </Link>
            )
          }
        </div>
      </nav>
      <div className={container}>
        <AccountContext.Provider value={account}>
          {/* this will render actual application 
           pass in the context for the currently signed in account
           and have is re renderered throught out the app 
           at first when context is crated, value is set to null. when the 
           value changes then the child components are re-rendered  */}

          <Component {...pageProps} connect={connect} />
        </AccountContext.Provider>
      </div>
    </div>
  );
}

// emotion.css makes writing css this easy :)
const accountInfo = css`
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: flex-end;
  font-size: 12px;
`;

const container = css`
  padding: 40px;
`;

const linkContainer = css`
  padding: 30px 60px;
  background-color: #fafafa;
`;

const nav = css`
  background-color: white;
`;

const header = css`
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.075);
  padding: 20px 30px;
`;

const description = css`
  margin: 0;
  color: #999999;
`;

const titleContainer = css`
  display: flex;
  flex-direction: column;
  padding-left: 15px;
`;

const title = css`
  margin-left: 30px;
  font-weight: 500;
  margin: 0;
`;

const buttonContainer = css`
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;

const buttonStyle = css`
  background-color: #fafafa;
  outline: none;
  border: none;
  font-size: 18px;
  padding: 16px 70px;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 7px 7px rgba(0, 0, 0, 0.1);
`;

const link = css`
  margin: 0px 40px 0px 0px;
  font-size: 16px;
  font-weight: 400;
`;

export default App;
