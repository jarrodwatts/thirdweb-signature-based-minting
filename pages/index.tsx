import { useAddress, useMetamask, useNFTCollection } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

const Home: NextPage = () => {
  const address = useAddress();
  const connectWallet = useMetamask();
  const nftContract = useNFTCollection(
    "0x9A7B4A9D0EEbAFcE58669B3e5aACF740D0DCDaD0"
  );

  async function mintWithSignature() {
    const signedPayloadReq = await fetch(`/api/generate-mint-signature`, {
      method: "POST",
      body: JSON.stringify({
        name: " nft name",
        description: "nft description",
        image: "image cool yes",
        address: address,
      }),
    });

    console.log(signedPayloadReq);

    const signedPayload = (await signedPayloadReq.json()).signedPayload;

    const nft = await nftContract?.signature.mint(signedPayload);

    return nft;
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {!address ? (
        <button onClick={() => connectWallet()}>Connect Wallet</button>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p>
            hey <b>{address}</b>
          </p>

          <button onClick={() => mintWithSignature()}>
            Mint with Signature
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
