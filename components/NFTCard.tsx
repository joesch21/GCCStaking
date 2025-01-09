import { client } from "@/app/client";
import { NFT, prepareContractCall } from "thirdweb";
import { TransactionButton } from "thirdweb/react";
import { NFT_CONTRACT, STAKING_CONTRACT } from "../utils/contracts";
import { useState } from "react";
import { approve } from "thirdweb/extensions/erc721";

type OwnedNFTsProps = {
    nft: NFT;
    refetch: () => void;
    refetchStakedInfo: () => void;
};

// ✅ Address Validation Function
const isValidEthereumAddress = (address: string): address is `0x${string}` => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const NFTCard = ({ nft, refetch, refetchStakedInfo }: OwnedNFTsProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [showImage, setShowImage] = useState(false); // Delay image rendering for mobile optimization

    return (
        <div style={{ 
            margin: "10px",
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center" 
        }}>
            {/* NFT Name and ID */}
            <p style={{ fontWeight: "bold", margin: "0 10px 10px 10px" }}>
                {nft.metadata.name || `NFT ID: ${nft.id}`}
            </p>

            {/* Show Image on Button Click for Faster Load */}
            <button 
                style={{ marginBottom: "10px", padding: "8px", cursor: "pointer" }}
                onClick={() => setShowImage(!showImage)}
            >
                {showImage ? "Hide Image" : "Show Image"}
            </button>

            {showImage && (
                <img 
                    src={nft.metadata.image}
                    alt={nft.metadata.name}
                    style={{
                        borderRadius: "10px",
                        marginBottom: "10px",
                        height: "150px",
                        width: "150px",
                        objectFit: "cover"
                    }}
                />
            )}

            {/* Stake Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                style={{
                    border: "none",
                    backgroundColor: "#333",
                    color: "#fff",
                    padding: "10px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    width: "100%",
                    maxWidth: "250px", 
                }}
            >
                Stake
            </button>

            {/* Staking Modal */}
            {isModalOpen && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <div style={{
                        minWidth: "80%",
                        maxWidth: "400px",
                        backgroundColor: "#222",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            style={{
                                border: "none",
                                backgroundColor: "transparent",
                                color: "#fff",
                                cursor: "pointer"
                            }}
                        >
                            Close
                        </button>

                        <h3 style={{ margin: "10px 0" }}>Confirm Staking</h3>
                        {/* Approval Flow */}
                        {!isApproved ? (
                            <TransactionButton
                                transaction={() => {
                                    if (isValidEthereumAddress(STAKING_CONTRACT.address)) {
                                        return approve({
                                            contract: NFT_CONTRACT,
                                            to: STAKING_CONTRACT.address,
                                            tokenId: nft.id
                                        });
                                    } else {
                                        throw new Error("Invalid staking contract address.");
                                    }
                                }}
                                style={{ width: "100%", maxWidth: "250px" }}
                                onTransactionConfirmed={() => setIsApproved(true)}
                            >
                                Approve
                            </TransactionButton>
                        ) : (
                            <TransactionButton
                                transaction={() =>
                                    prepareContractCall({
                                        contract: STAKING_CONTRACT,
                                        method: "stake",
                                        params: [[nft.id]]
                                    })
                                }
                                onTransactionConfirmed={() => {
                                    alert("Staked Successfully!");
                                    setIsModalOpen(false);
                                    refetch();
                                    refetchStakedInfo();
                                }}
                                style={{ width: "100%", maxWidth: "250px" }}
                            >
                                Confirm Stake
                            </TransactionButton>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
