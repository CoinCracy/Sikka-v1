import React, { useState } from "react";
import {
  mintToken,
  createAssociatedTokenAccount,
} from "../../lib/createUtils";

import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
const getProvider = () => {
  if ("solana" in window) {
    const provider = window.solana;
    if (provider.isPhantom) {
      return provider;
    }
  }
};

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

function MintModal(props) {
  const [mintassAccountCreated, setmintAssAccountCreated] = useState(false);

  async function findAssociatedTokenAddress(walletAddress, tokenMintAddress) {
    return (
      await PublicKey.findProgramAddress(
        [
          walletAddress.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          tokenMintAddress.toBuffer(),
        ],
        SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
      )
    )[0];
  }

  const provider = getProvider();

  async function mint(amount, receiver) {
    if (mintassAccountCreated) {
        const associatedTokenAccount = await findAssociatedTokenAddress(
            new PublicKey(receiver),
            new PublicKey(props.mintAddress)
          );
    
          await mintToken(
            null,
            null,
            new PublicKey(associatedTokenAccount.toString()),
            amount,
            true,
            true
          ).then((data) => {
        console.log(data);
      });
    } else {
      const associatedTokenAccount = await createAssociatedTokenAccount(
        null,
        true,
        props.mintAddress,
        receiver
      ).then(setmintAssAccountCreated(true));

      await mintToken(
        null,
        null,
        new PublicKey(associatedTokenAccount.toString()),
        amount,
        true,
        true
      ).then((data) => {
        console.log(data);
      });
    }
  }

  return (
    <div className="mint-modal">
      <label htmlFor="#mintamount">Amount</label>
      <input type="text" id="mintamount"></input>

      <label htmlFor="#mintrecipient">Receiver</label>
      <input type="text" id="mintrecipient"></input>

      <button
        onClick={() =>
          mint(
            document.getElementById("mintamount").value,
            document.getElementById("mintrecipient").value
          )
        }
      >
        Mint
      </button>
    </div>
  );
}

export default MintModal;
