import { client } from "@/app/client";
import { NFT, prepareContractCall } from "thirdweb";
import { MediaRenderer, TransactionButton } from "thirdweb/react";
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

    return (
        <div style={{ margin: "10px" }}>
            {/* NFT Image Display */}
            <MediaRenderer
                client={client}
                src={nft.metadata.image}
                style={{
                    borderRadius: "10px",
                    marginBottom: "10px",
                    height: "200px",
                    width: "200px"
                }}
            />
            <p style={{ margin: "0 10px 10px 10px" }}>{nft.metadata.name}</p>

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
                    width: "100%"
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
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <div style={{
                        minWidth: "300px",
                        backgroundColor: "#222",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            width: "100%"
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
                        </div>

                        <h3 style={{ margin: "10px 0" }}>You're about to stake:</h3>
                        <MediaRenderer
                            client={client}
                            src={nft.metadata.image}
                            style={{
                                borderRadius: "10px",
                                marginBottom: "10px"
                            }}
                        />

                        {/* Approval Flow with Address Validation */}
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
