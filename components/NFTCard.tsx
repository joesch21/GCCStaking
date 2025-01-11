'use client';

import { client } from "@/app/client";
import { NFT, prepareContractCall } from "thirdweb";
import { MediaRenderer, TransactionButton } from "thirdweb/react";
import { NFT_CONTRACT, STAKING_CONTRACT } from "../utils/contracts";
import { useState } from "react";
import { approve } from "thirdweb/extensions/erc721";

// ✅ Updated Prop Types: No more async props directly
type OwnedNFTsProps = {
    nft: NFT;
    refetch: () => Promise<void>;  // Return type updated for compatibility
    refetchStakedInfo: (options?: any) => Promise<void>;  // Also updated
};


// ✅ NFTCard Component Updated
export const NFTCard = ({ nft, refetch, refetchStakedInfo }: OwnedNFTsProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isApproved, setIsApproved] = useState(false);

    const handleStakeActions = async () => {
        await refetch(); 
        await refetchStakedInfo(); 
    };

    const imageUrl = nft?.metadata.image?.startsWith("ipfs://")
        ? nft.metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")
        : nft.metadata.image || "/0.png";

    // ✅ Local Refetch Logic
    const handleRefetch = async () => {
        window.location.reload(); // Simplified to force reload instead of passing down a function
    };

    return (
        <div>
            <MediaRenderer client={client} src={imageUrl} />
            <p>{nft.metadata.name || `NFT ID: ${nft.id}`}</p>

            <button onClick={() => setIsModalOpen(true)}>Stake</button>

            {isModalOpen && (
                <div>
                    <button onClick={() => setIsModalOpen(false)}>❌ Close</button>

                    {!isApproved ? (
                        <TransactionButton
                        transaction={() => approve({
                            contract: NFT_CONTRACT,
                            to: STAKING_CONTRACT.address as `0x${string}`,  // Fixed the error here
                            tokenId: nft.id
                        })}
                        style={{ width: "100%" }}
                        onTransactionConfirmed={() => setIsApproved(true)}
                    >
                        Approve
                    </TransactionButton>
                    
                    ) : (
                        <TransactionButton
                            transaction={() => prepareContractCall({
                                contract: STAKING_CONTRACT,
                                method: "stake",
                                params: [[nft.id]]
                            })}
                            onTransactionConfirmed={() => {
                                alert("Staked Successfully!");
                                setIsModalOpen(false);
                                handleStakeActions(); // ✅ Using local function for refetch
                            }}
                        >
                            Confirm Stake
                        </TransactionButton>
                    )}
                </div>
            )}
        </div>
    );
};
