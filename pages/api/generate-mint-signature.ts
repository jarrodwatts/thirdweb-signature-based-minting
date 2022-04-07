import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function generateMintSignature(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("The date is:", Date.now());

  // De-construct body from request
  let { address, name, description, image } = JSON.parse(req.body);
  const sdk = new ThirdwebSDK(
    new ethers.Wallet(
      // Your wallet private key
      process.env.PRIVATE_KEY as string,
      // RPC URL
      ethers.getDefaultProvider(
        `https://rinkeby.infura.io/v3/${process.env.INFURA_KEY}`
      )
    )
  );

  const nftContract = sdk.getNFTCollection(
    "0x9A7B4A9D0EEbAFcE58669B3e5aACF740D0DCDaD0"
  );

  const signedPayload = await nftContract.signature.generate({
    metadata: {
      name: name,
      description: description,
      image: image,
      properties: {},
    },
    to: address,
    // 10 years in the future
    mintEndTime: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000),
    // 10 years in the past
    mintStartTime: new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000),
  });

  console.log("sending back signed payload:", signedPayload);

  // return 200 and signedpayload
  res.status(200).json({
    signedPayload: JSON.parse(JSON.stringify(signedPayload)),
  });
}
