import { MediaRenderer, TransactionButton, useReadContract } from "thirdweb/react";
import { NFT_CONTRACT, STAKING_CONTRACT } from "../utils/contracts";
import { getNFT } from "thirdweb/extensions/erc721";
import { client } from "@/app/client";
import { prepareContractCall } from "thirdweb";

type StakedNFTCardProps = {
    tokenId: bigint;
    refetchStakedInfo: () => void;
    refetchOwnedNFTs: () => void;
    isOwnedNFT?: boolean; // ✅ New prop to differentiate owned vs staked
};

export const StakedNFTCard: React.FC<StakedNFTCardProps> = ({ 
    tokenId, 
    refetchStakedInfo, 
    refetchOwnedNFTs,
    isOwnedNFT = false // ✅ Default to false for staked NFTs
}) => {
    const { data: nft } = useReadContract(
        getNFT,
        {
            contract: NFT_CONTRACT,
            tokenId: tokenId,
        }
    );

    return (
        <div style={{ 
            margin: "10px auto", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            textAlign: "center",
            maxWidth: "300px" 
        }}>
            {/* ✅ Display NFT Image */}
            <MediaRenderer
                client={client}
                src={nft?.metadata.image}
                style={{
                    borderRadius: "10px",
                    marginBottom: "10px",
                    height: "150px",
                    width: "150px",
                    objectFit: "cover"
                }}
            />
            <p style={{ margin: "10px 0" }}>{nft?.metadata.name || `Token ID: ${tokenId}`}</p>

            {/* ✅ Conditional Rendering for Owned vs Staked NFTs */}
            {isOwnedNFT ? (
                <TransactionButton
                    transaction={() => (
                        prepareContractCall({
                            contract: STAKING_CONTRACT,
                            method: "stake",
                            params: [[tokenId]]
                        })
                    )}
                    onTransactionConfirmed={() => {
                        refetchOwnedNFTs();
                        refetchStakedInfo();
                        alert("NFT Staked Successfully!");
                    }}
                    style={{
                        border: "none",
                        backgroundColor: "#4CAF50",
                        color: "#fff",
                        padding: "10px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        width: "100%",
                        fontSize: "14px"
                    }}
                >
                    Stake NFT
                </TransactionButton>
            ) : (
                <TransactionButton
                    transaction={() => (
                        prepareContractCall({
                            contract: STAKING_CONTRACT,
                            method: "withdraw",
                            params: [[tokenId]]
                        })
                    )}
                    onTransactionConfirmed={() => {
                        refetchOwnedNFTs();
                        refetchStakedInfo();
                        alert("NFT Withdrawn Successfully!");
                    }}
                    style={{
                        border: "none",
                        backgroundColor: "#FF4500",
                        color: "#fff",
                        padding: "10px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        width: "100%",
                        fontSize: "14px"
                    }}
                >
                    Withdraw NFT
                </TransactionButton>
            )}
        </div>
    )
};
