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
              owner: account.address as `0x${string}`,
              tokenURI: nft.tokenURI || "",
              type: "ERC721",
              supply: BigInt(1),
              metadata: {
                ...nft.metadata,
                image: `/compressed/thumb_${tokenId.toString()}.jpg`, // ✅ Load local image
              },
            } as NFT;
          } catch (error) {
            console.error(`Error fetching NFT ${tokenId}:`, error);
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

  // ✅ Optimized Staked NFT fetching
  const { data: stakedInfo, refetch: refetchStakedInfo } = useReadContract({
    contract: STAKING_CONTRACT,
    method: "getStakeInfo",
    params: [account?.address as `0x${string}`],
  });

  // ✅ Prevents unnecessary re-renders
  const handleStake = useCallback(
    (nft: NFT) => {
      setOwnedNFTs((prev) => prev.filter((n) => n.id !== nft.id));
      refetchStakedInfo();
    },
    [refetchStakedInfo]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#151515",
        borderRadius: "8px",
        width: "100%",
        maxWidth: "400px",
        padding: "20px",
        color: "white",
      }}
    >
      <ConnectButton client={client} chain={chain} />
      <hr style={{ width: "100%", border: "1px solid #333", margin: "20px 0" }} />

      {/* ✅ Owned NFTs Section */}
      <div style={{ margin: "20px 0", width: "100%" }}>
        <h2>Owned NFTs</h2>
        <p style={{ color: "#ffcc00", fontSize: "10px" }}>
          Approve each NFT before staking. Once approved, the button will display staking - press the button again to Stake.
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {ownedNFTs.length > 0 ? (
            ownedNFTs.map((nft) => (
              <div key={nft.id.toString()} style={{ minHeight: "120px" }}>
                <NFTCard nft={nft} onStaked={() => handleStake(nft)} />
              </div>
            ))
          ) : (
            <p>You own 0 NFTs</p>
          )}
        </div>
      </div>

      <hr style={{ width: "100%", border: "1px solid #333" }} />

      {/* ✅ Staked NFTs Section */}
      <div style={{ width: "100%", margin: "20px 0" }}>
        <h2>Staked NFTs</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {stakedInfo && stakedInfo[0]?.length > 0 ? (
            stakedInfo[0].map((tokenId: bigint, index: number) => (
              <StakedNFTCard
                key={index}
                tokenId={tokenId}
                metadata={{ name: `NFT ${tokenId.toString()}` }}
                onUnstaked={() => {
                  setOwnedNFTs((prev) => [
                    ...prev,
                    {
                      id: tokenId,
                      metadata: { name: `NFT ${tokenId}` },
                    } as NFT,
                  ]);
                  refetchStakedInfo();
                }}
              />
            ))
          ) : (
            <p>No NFTs staked yet</p>
          )}
        </div>
      </div>

      <hr style={{ width: "100%", border: "1px solid #333" }} />

      {/* ✅ Stake Rewards Section */}
      <StakeRewards />
    </div>
  );
};
