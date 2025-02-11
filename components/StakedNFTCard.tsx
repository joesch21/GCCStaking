import { TransactionButton } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import Image from "next/image";
import { STAKING_CONTRACT } from "../utils/contracts";

type StakedNFTCardProps = {
    tokenId: bigint;
    metadata?: { name?: string };
    onUnstaked: () => void;
};

export const StakedNFTCard: React.FC<StakedNFTCardProps> = ({ tokenId, metadata, onUnstaked }) => {
    return (
        <div style={{ textAlign: "center", padding: "10px", border: "1px solid white", borderRadius: "10px", marginBottom: "10px" }}>
            
            {/* ✅ Load image from local compressed folder */}
            <Image 
                src={`/compressed/thumb_${tokenId.toString()}.jpg`}
                alt={metadata?.name || `NFT ${tokenId.toString()}`}
                width={100}
                height={100}
                priority
            />

            <p><strong>Staked NFT ID:</strong> {tokenId.toString()}</p>
            <p><strong>Name:</strong> {metadata?.name || `NFT ${tokenId.toString()}`}</p>

            <TransactionButton
                transaction={() => prepareContractCall({
                    contract: STAKING_CONTRACT,
                    method: "withdraw",
                    params: [[tokenId]]
                })}
                onTransactionConfirmed={onUnstaked}
            >
                Withdraw NFT
            </TransactionButton>
        </div>
    );
};
