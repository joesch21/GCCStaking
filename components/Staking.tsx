"use client";

import { chain } from "@/app/chain";
import { client } from "@/app/client";
import { ConnectButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { StakeRewards } from "./StakeRewards";
import { NFT_CONTRACT, STAKING_CONTRACT } from "../utils/contracts";
import { NFT } from "thirdweb";
import { useEffect, useState } from "react";
import { getNFT, ownerOf, totalSupply } from "thirdweb/extensions/erc721";
import { NFTCard } from "./NFTCard";
import { StakedNFTCard } from "./StakedNFTCard";

export const Staking = () => {
    const account = useActiveAccount();
    const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);
    const [cachedNFTs, setCachedNFTs] = useState<{ [key: string]: NFT }>({});

    const getOwnedNFTs = async () => {
        if (!account) return;

        let ownedNFTs: NFT[] = [];
        const totalNFTSupply = await totalSupply({ contract: NFT_CONTRACT });

        for (let i = 0; i < parseInt(totalNFTSupply.toString()); i++) {
            const tokenId = BigInt(i);

            if (cachedNFTs[tokenId.toString()]) {
                ownedNFTs.push(cachedNFTs[tokenId.toString()]);
                continue;
            }

            const owner = await ownerOf({ contract: NFT_CONTRACT, tokenId });

            if (owner === account?.address) {
                const nft = await getNFT({ contract: NFT_CONTRACT, tokenId });
                ownedNFTs.push(nft);
                setCachedNFTs(prev => ({ ...prev, [tokenId.toString()]: nft }));
            }
        }

        setOwnedNFTs(ownedNFTs);
    };

    useEffect(() => {
        if (account) {
            getOwnedNFTs();
        }
    }, [account]);

    const { data: stakedInfo, refetch: refetchStakedInfo } = useReadContract({
        contract: STAKING_CONTRACT,
        method: "getStakeInfo",
        params: [account?.address as `0x${string}`]
    });

    if (!account) {
        return (
            <div style={{ color: "white", textAlign: "center" }}>
                <p>Please connect your wallet to stake your NFTs.</p>
                <ConnectButton client={client} chain={chain} />
            </div>
        );
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#151515",
            borderRadius: "8px",
            width: "100%",
            maxWidth: "400px",
            padding: "20px",
            color: "white",
        }}>
            <ConnectButton client={client} chain={chain} />

            <hr style={{ width: "100%", border: "1px solid #333", margin: "20px 0" }}/>

            {/* Owned NFTs Section */}
            <div style={{ margin: "20px 0", width: "100%" }}>
                <h2>Owned NFTs</h2>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                    {ownedNFTs.length > 0 ? (
                        ownedNFTs.map((nft) => (
                            <NFTCard
                                key={nft.id}
                                nft={nft}
                                onStaked={() => {
                                    getOwnedNFTs();
                                    refetchStakedInfo();
                                }}
                            />
                        ))
                    ) : (
                        <p>You own 0 NFTs</p>
                    )}
                </div>
            </div>

            <hr style={{ width: "100%", border: "1px solid #333" }}/>

            {/* Staked NFTs Section */}
            <div style={{ width: "100%", margin: "20px 0" }}>
                <h2>Staked NFTs</h2>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                    {stakedInfo && stakedInfo[0]?.length > 0 ? (
                        stakedInfo[0].map((nft: any, index: number) => (
                            <StakedNFTCard
                                key={index}
                                tokenId={nft}
                                onUnstaked={() => {
                                    getOwnedNFTs();
                                    refetchStakedInfo();
                                }}
                            />
                        ))
                    ) : (
                        <p>No NFTs staked yet</p>
                    )}
                </div>
            </div>

            <hr style={{ width: "100%", border: "1px solid #333" }}/>

            {/* Stake Rewards Section */}
            <StakeRewards />
        </div>
    );
};
