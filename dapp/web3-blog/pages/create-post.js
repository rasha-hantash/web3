/* pages/create-post.js */
/* useEffect is a lifecycle hook for react: allows us to do different things when a component is loaded. useRef allows use a create a reference to different items in order to workaround not using react lifecycle */
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic"; // simple markdown editor doesnt work on the server, so this allows you to only dybamically import the markdown editor on the client. todo: test out removing this
import { css } from "@emotion/css";
import { ethers } from "ethers";
import { create } from "ipfs-http-client"; // use this create function that will allows us to create new items on ipfs

/* import contract address and contract owner address */
import { contractAddress } from "../config";

import Blog from "../artifacts/contracts/Blog.sol/Blog.json";

/* define the ipfs endpoint */
/* THIS IS A PUBLIC PORT. It works well but feel free to create own port with infura*/
const client = create("https://ipfs.infura.io:5001/api/v0");

/* configure the markdown editor to be client-side import */
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

const initialState = { title: "", content: "" };

function CreatePost() {
  /* configure initial state to be used in the component */
  const [post, setPost] = useState(initialState);
  const [image, setImage] = useState(null); // allows use to create a cover image, and determine whether or not certain properties will exist  when we upload to ipfs
  const [loaded, setLoaded] = useState(false); // allows us to create a hack that will solve any ui lag issues caused by simple markdown editor

  const fileRef = useRef(null);
  const { title, content } = post;
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      /* delay rendering buttons until dynamic import is complete */
      setLoaded(true);
    }, 500);
  }, []);

  //   allows us to update the contents of a post
  function onChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }));
  }

  async function createNewPost() {
    /* saves post to ipfs then anchors to smart contract */
    if (!title || !content) return;
    const hash = await savePostToIpfs();
    await savePost(hash);
    router.push(`/`);
  }

  async function savePostToIpfs() {
    /* save post metadata to ipfs */
    try {
      // takes content we have in the post that is stored into local state and then turn it to json and upload to ipfs
      const added = await client.add(JSON.stringify(post));
      return added.path;
    } catch (err) {
      console.log("error: ", err);
    }
  }

  async function savePost(hash) {
    /* anchor post to smart contract */
    // check to make sure user is signed in
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, Blog.abi, signer);
      console.log("contract: ", contract);
      try {
        const val = await contract.createPost(post.title, hash); // this is the actual createPost call in Blog.sol
        /* optional - wait for transaction to be confirmed before rerouting */
        /* await provider.waitForTransaction(val.hash). should be considered when you do deployment since transaction won't 
        be as instantaneous as localhost */
        console.log("val: ", val);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  // this programmatically triggers clicking the button without actually to manually click a button
  function triggerOnChange() {
    /* trigger handleFileChange handler of hidden file input */
    fileRef.current.click();
  }

  async function handleFileChange(e) {
    /* upload cover image to ipfs and save hash to state */
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    const added = await client.add(uploadedFile);
    setPost((state) => ({ ...state, coverImage: added.path })); // ...state = upload all existing state (post title and content). and then add the new path to the ipfs hash for the cover image
    setImage(uploadedFile);
  }

  return (
    <div className={container}>
      {
        //   renders cover image if it exists
        image && (
          <img className={coverImageStyle} src={URL.createObjectURL(image)} />
        )
      }
      <input
        onChange={onChange}
        name="title"
        placeholder="Give it a title ..."
        value={post.title}
        className={titleStyle}
      />
      <SimpleMDE
        className={mdEditor}
        placeholder="What's on your mind?"
        value={post.content}
        onChange={(value) => setPost({ ...post, content: value })}
      />
      {
        // once loaded show the two buttons
        loaded && (
          <>
            <button className={button} type="button" onClick={createNewPost}>
              Publish
            </button>
            <button onClick={triggerOnChange} className={button}>
              Add cover image
            </button>
          </>
        )
      }
      {/* this won't be visible at all */}
      <input
        id="selectImage"
        className={hiddenInput}
        type="file"
        onChange={handleFileChange} // uploads cover image to ipfs once it is clicked by the "Add cover Image" button
        ref={fileRef}
      />
    </div>
  );
}

const hiddenInput = css`
  display: none;
`;

const coverImageStyle = css`
  max-width: 800px;
`;

const mdEditor = css`
  margin-top: 40px;
`;

const titleStyle = css`
  margin-top: 40px;
  border: none;
  outline: none;
  background-color: inherit;
  font-size: 44px;
  font-weight: 600;
  &::placeholder {
    color: #999999;
  }
`;

const container = css`
  width: 800px;
  margin: 0 auto;
`;

const button = css`
  background-color: #fafafa;
  outline: none;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  margin-right: 10px;
  font-size: 18px;
  padding: 16px 70px;
  box-shadow: 7px 7px rgba(0, 0, 0, 0.1);
`;

export default CreatePost;
