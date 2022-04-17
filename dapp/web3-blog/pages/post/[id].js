import ReactMarkdown from "react-markdown"; // this is going to be the markdown renderer. only need to pass down a string of markdown
import { useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { css } from "@emotion/css";
import { ethers } from "ethers";
import { AccountContext } from "../../context";

/* import contract and owner addresses */
import { contractAddress, ownerAddress } from "../../config";
import Blog from "../../artifacts/contracts/Blog.sol/Blog.json";

// We will be leveraging server-side data fetching using getStaticPaths
// and getStaticProps which will create these pages at build
// time  using  the array of posts queried from the network.
const ipfsURI = "https://ipfs.io/ipfs/"; // allows us to talk to ipfs

export default function Post({ post }) {
  const account = useContext(AccountContext);
  const router = useRouter();
  const { id } = router.query; // read the current url and get the id from it

  // if we run a build and someone creates a new post, this will fetch that
  // new post and show a loading page while it is still grabbing the data
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {post && (
        <div className={container}>
          {
            /* if the owner is the user, render an edit button */
            ownerAddress === account && (
              <div className={editPost}>
                <Link href={`/edit-post/${id}`}>
                  <a>Edit post</a>
                </Link>
              </div>
            )
          }
          {
            /* if the post has a cover image, render it */
            post.coverImage && (
              <img src={post.coverImage} className={coverImageStyle} />
            )
          }
          <h1>{post.title}</h1>
          <div className={contentContainer}>
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

// because we get the static paths and props on the server side, it renders the page a lot faster
export async function getStaticPaths() {
  /* here we fetch the posts from the network */
  let provider;
  if (process.env.ENVIRONMENT === "local") {
    provider = new ethers.providers.JsonRpcProvider();
  } else if (process.env.ENVIRONMENT === "testnet") {
    provider = new ethers.providers.JsonRpcProvider(
      "https://rpc-mumbai.matic.today"
    );
  } else {
    provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com/");
  }

  const contract = new ethers.Contract(contractAddress, Blog.abi, provider);
  const data = await contract.fetchPosts();

  /* then we map over the posts and create a params object passing */
  /* the id property to getStaticProps which will run for ever post */
  /* in the array and generate a new page */
  const paths = data.map((d) => ({ params: { id: d[2] } }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  /* using the id property passed in through the params object */
  /* we can us it to fetch the data from IPFS and pass the */
  /* post data into the page as props */
  const { id } = params;
  const ipfsUrl = `${ipfsURI}/${id}`;
  const response = await fetch(ipfsUrl);
  const data = await response.json();
  if (data.coverImage) {
    let coverImage = `${ipfsURI}/${data.coverImage}`;
    data.coverImage = coverImage;
  }

  return {
    props: {
      post: data,
    },
  };
}

const editPost = css`
  margin: 20px 0px;
`;

const coverImageStyle = css`
  width: 900px;
`;

const container = css`
  width: 900px;
  margin: 0 auto;
`;

const contentContainer = css`
  margin-top: 60px;
  padding: 0px 40px;
  border-left: 1px solid #e7e7e7;
  border-right: 1px solid #e7e7e7;
  & img {
    max-width: 900px;
  }
`;
