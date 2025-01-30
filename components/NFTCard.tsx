import { TransactionButton } from "thirdweb/react";
import { NFT, prepareContractCall } from "thirdweb";
import { NFT_CONTRACT, STAKING_CONTRACT } from "../utils/contracts";
import { useState } from "react";
import { approve } from "thirdweb/extensions/erc721";

type OwnedNFTsProps = {
    nft: NFT;
    onStaked: () => void;
};

export const NFTCard = ({ nft, onStaked }: OwnedNFTsProps) => {
    const [isApproved, setIsApproved] = useState(false);

    return (
        <div style={{ 
            textAlign: "center", 
            padding: "10px", 
            border: "1px solid white", 
            borderRadius: "10px", 
            marginBottom: "10px" 
        }}>
            <p><strong>NFT ID:</strong> {nft.id}</p>
            <p><strong>Name:</strong> {nft.metadata?.name || "Unknown NFT"}</p>

            {!isApproved ? (
                <TransactionButton
                    transaction={() => approve({
                        contract: NFT_CONTRACT,
                        to: STAKING_CONTRACT.address as `0x${string}`,
                        tokenId: nft.id
                    })}
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
                    onTransactionConfirmed={onStaked}
                >
                    Stake NFT
                </TransactionButton>
            )}
        </div>
    );
};
