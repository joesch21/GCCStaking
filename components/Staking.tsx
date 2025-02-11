"use client";

import { chain } from "@/app/chain";
import { client } from "@/app/client";
import {
  ConnectButton,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { StakeRewards } from "./StakeRewards";
import { NFT_CONTRACT, STAKING_CONTRACT } from "../utils/contracts";
import { NFT } from "thirdweb";
import { useEffect, useState, useCallback, useMemo } from "react";
import { getNFT, balanceOf } from "thirdweb/extensions/erc721";
import { NFTCard } from "./NFTCard";
import { StakedNFTCard } from "./StakedNFTCard";

export const Staking = () => {
  const account = useActiveAccount();
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);

  const getOwnedNFTs = async () => {
    if (!account) return;
    try {
      const balance = await balanceOf({
        contract: NFT_CONTRACT,
        owner: account.address,
      });

      if (!balance || Number(balance) === 0) {
        setOwnedNFTs([]);
        return;
      }

      const tokenIds = Array.from({ length: Number(balance) }, (_, i) =>
        BigInt(i)
      );

      const nfts = await Promise.all(
        tokenIds.map(async (tokenId) => {
          try {
            const nft = await getNFT({ contract: NFT_CONTRACT, tokenId });
            if (!nft) return null;
            return {
              id: tokenId,
              metadata: { ...nft.metadata, image: `/compressed/thumb_${tokenId.toString()}.jpg` },
            } as NFT;
          } catch (error) {
            return null;
          }
        })
      );

      setOwnedNFTs(nfts.filter((nft): nft is NFT => nft !== null));
    } catch (error) {
      console.error("Error fetching owned NFTs:", error);
    }
  };

  useEffect(() => {
    if (account) {
      getOwnedNFTs();
    }
  }, [account]);

  return (
    <div>
      <ConnectButton client={client} chain={chain} />
      <h2>Owned NFTs</h2>
      {ownedNFTs.map((nft) => (
        <NFTCard key={nft.id.toString()} nft={nft} onStaked={() => {}} />
      ))}
      <h2>Staked NFTs</h2>
      {ownedNFTs.map((nft) => (
        <StakedNFTCard key={nft.id.toString()} tokenId={nft.id} onUnstaked={() => {}} />
      ))}
      <StakeRewards />
    </div>
  );
};
