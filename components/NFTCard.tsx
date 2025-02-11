import { useState, useEffect } from "react";
import { TransactionButton } from "thirdweb/react";
import { NFT, prepareContractCall } from "thirdweb";
import { NFT_CONTRACT, STAKING_CONTRACT } from "../utils/contracts";
import { approve, isApprovedForAll } from "thirdweb/extensions/erc721";

type NFTCardProps = {
    nft: NFT;
    onStaked: () => void;
};

export const NFTCard: React.FC<NFTCardProps> = ({ nft, onStaked }) => {
    const [isApproved, setIsApproved] = useState(false);

    useEffect(() => {
        if (!nft.owner) return;
        isApprovedForAll({
            contract: NFT_CONTRACT,
            owner: nft.owner as `0x${string}`,
            operator: STAKING_CONTRACT.address as `0x${string}`
        }).then(setIsApproved);
    }, [nft]);

    return (
        <div style={{
            textAlign: "center",
            padding: "10px",
            border: "1px solid white",
            borderRadius: "10px",
            marginBottom: "10px"
        }}>
            <p><strong>NFT ID:</strong> {nft.id.toString()}</p>
            <p><strong>Name:</strong> {nft.metadata?.name || "Unknown NFT"}</p>

            {!isApproved ? (
                <TransactionButton
                    transaction={() =>
                        approve({
                            contract: NFT_CONTRACT,
                            to: STAKING_CONTRACT.address as `0x${string}`,
                            tokenId: nft.id
                        })
                    }
                    onTransactionConfirmed={() => setIsApproved(true)}
                >
                    Approve NFT
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
                    onTransactionConfirmed={onStaked}
                >
                    Stake NFT
                </TransactionButton>
            )}
        </div>
    );
};
