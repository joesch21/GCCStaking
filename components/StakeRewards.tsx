import { TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { REWARD_TOKEN_CONTRACT, STAKING_CONTRACT } from "../utils/contracts";
import { prepareContractCall, toEther } from "thirdweb";
import { useEffect } from "react";
import { balanceOf } from "thirdweb/extensions/erc721";

// ✅ Address Validation Function
const isValidEthereumAddress = (address?: string): address is `0x${string}` => {
    return typeof address === "string" && /^0x[a-fA-F0-9]{40}$/.test(address);
};

// ✅ Safe Address Function
const safeAddress = (address?: string) => isValidEthereumAddress(address) ? address : "0x0000000000000000000000000000000000000000";

export const StakeRewards = () => {
    const account = useActiveAccount();

    // ✅ Fixed: Validating the address before passing it
    const {
        data: tokenBalance,
        isLoading: isTokenBalanceLoading,
        refetch: refetchTokenBalance,
    } = useReadContract(
        balanceOf,
        {
            contract: REWARD_TOKEN_CONTRACT,
            owner: safeAddress(account?.address),
        }
    );
    
    const {
        data: stakedInfo,
        refetch: refetchStakedInfo,
    } = useReadContract({
        contract: STAKING_CONTRACT,
        method: "getStakeInfo",
        params: [safeAddress(account?.address)],
    });

    useEffect(() => {
        refetchStakedInfo();
        const interval = setInterval(() => {
            refetchStakedInfo();
        }, 1000);
        return () => clearInterval(interval);
    }, [refetchStakedInfo]);

    return (
        <div style={{ width: "100%", margin: "20px 0", display: "flex", flexDirection: "column" }}>
            {/* ✅ Fixed: Only display balance if valid */}
            {!isTokenBalanceLoading && tokenBalance && (
                <p>Wallet Balance: {toEther(BigInt(tokenBalance.toString()))}</p>
            )}
            
            <h2 style={{ marginBottom: "20px"}}>
                Stake Rewards: {stakedInfo && toEther(BigInt(stakedInfo[1]?.toString() || "0"))}
            </h2>
            
            <TransactionButton
                transaction={() => (
                    prepareContractCall({
                        contract: STAKING_CONTRACT,
                        method: "claimRewards",
                    })
                )}
                onTransactionConfirmed={() => {
                    alert("Rewards claimed!");
                    refetchStakedInfo();
                    refetchTokenBalance();
                }}
                style={{
                    border: "none",
                    backgroundColor: "#333",
                    color: "#fff",
                    padding: "10px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    width: "100%",
                    fontSize: "12px"
                }}
            >
                Claim Rewards
            </TransactionButton>
        </div>
    );
};
