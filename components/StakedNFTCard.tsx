import { TransactionButton } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { STAKING_CONTRACT } from "../utils/contracts";

type StakedNFTCardProps = {
    tokenId: bigint;
    onUnstaked: () => void;
};

export const StakedNFTCard: React.FC<StakedNFTCardProps> = ({ tokenId, onUnstaked }) => {
    return (
        <div style={{ textAlign: "center", maxWidth: "300px" }}>
            <p>{`Staked NFT ID: ${tokenId}`}</p>

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
