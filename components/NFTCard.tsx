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
    const [isImageVisible, setIsImageVisible] = useState(false);

    return (
        <div style={{ 
            margin: "10px auto", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            textAlign: "center",
            width: "90%", // Mobile friendly width
            maxWidth: "300px", 
        }}>
            {/* NFT Name and ID */}
            <p style={{ fontWeight: "bold", margin: "10px 0" }}>
                {nft.metadata.name || `NFT ID: ${nft.id}`}
            </p>

            {/* Image Lazy Loading for Performance */}
            <button
                onClick={() => setIsImageVisible(!isImageVisible)}
                style={{
                    marginBottom: "10px",
                    padding: "10px",
                    borderRadius: "10px",
                    backgroundColor: "#222",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer"
                }}
            >
                {isImageVisible ? "Hide Image" : "Show Image"}
            </button>

            {isImageVisible && (
                <img
                    src={nft.metadata.image}
                    alt={nft.metadata.name}
                    style={{
                        borderRadius: "10px",
                        height: "150px",
                        width: "150px",
                        objectFit: "cover",
                        marginBottom: "10px"
                    }}
                />
            )}

            {/* Stake Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                style={{
                    padding: "10px",
                    borderRadius: "10px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    width: "100%",
                    maxWidth: "250px"
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
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        width: "90%",
                        maxWidth: "400px",
                        backgroundColor: "#333",
                        padding: "20px",
                        borderRadius: "12px",
                        textAlign: "center"
                    }}>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            style={{
                                border: "none",
                                backgroundColor: "transparent",
                                color: "#fff",
                                fontSize: "16px",
                                cursor: "pointer"
                            }}
                        >
                            ❌ Close
                        </button>

                        <h3 style={{ margin: "20px 0" }}>Confirm Staking</h3>

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
                                style={{ width: "100%" }}
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
                                style={{ width: "100%" }}
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
