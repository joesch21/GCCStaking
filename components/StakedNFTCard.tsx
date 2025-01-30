import { TransactionButton } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { STAKING_CONTRACT } from "../utils/contracts";

type StakedNFTCardProps = {
    tokenId: bigint;
    onUnstaked: () => void;
};

export const StakedNFTCard: React.FC<StakedNFTCardProps> = ({ tokenId, onUnstaked }) => {
    return (
        <div style={{ textAlign: "center", padding: "10px", border: "1px solid white", borderRadius: "10px", marginBottom: "10px" }}>
            <p><strong>Staked NFT ID:</strong> {tokenId}</p>

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
