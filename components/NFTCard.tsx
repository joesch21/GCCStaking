import { MediaRenderer, TransactionButton } from "thirdweb/react";
import { NFT, prepareContractCall } from "thirdweb";
import { NFT_CONTRACT, STAKING_CONTRACT } from "../utils/contracts";
import { useState } from "react";
import { approve } from "thirdweb/extensions/erc721";
import { client } from "@/app/client";

type OwnedNFTsProps = {
    nft: NFT;
    onStaked: () => void;
};

export const NFTCard = ({ nft, onStaked }: OwnedNFTsProps) => {
    const [isApproved, setIsApproved] = useState(false);

    const resolveImageUrl = (image?: string) => {
        if (!image) return "/fallback.png";
        return image.startsWith("ipfs://") ? image.replace("ipfs://", "https://ipfs.io/ipfs/") : image;
    };

    return (
        <div style={{ textAlign: "center", padding: "10px", border: "1px solid white", borderRadius: "10px" }}>
            <p>{nft.metadata?.name || `NFT ID: ${nft.id}`}</p>
            <MediaRenderer client={client} src={resolveImageUrl(nft.metadata?.image)} />

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
