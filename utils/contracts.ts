import { chain } from "@/app/chain";
import { client } from "@/app/client";
import { getContract } from "thirdweb";
import { stakingABI } from "./stakingABI";

const nftContractAddress = "0x36cda97E72911E85781486a5C182baeC87071d20";
const rewardTokenContractAddress = "0x07b49c3751ac1Aba1A2B11f2704e974Af6E401A7";
const stakingContractAddress = "0x4830A50c3C27439954EEB58145e2A3c7357F16b6";

export const NFT_CONTRACT = getContract({
    client: client,
    chain: chain,
    address: nftContractAddress
});

export const REWARD_TOKEN_CONTRACT = getContract({
    client: client,
    chain: chain,
    address: rewardTokenContractAddress
});

export const STAKING_CONTRACT = getContract({
    client: client,
    chain: chain,
    address: stakingContractAddress,
    abi: stakingABI
});