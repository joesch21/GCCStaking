import { chain } from "@/app/chain";
import { client } from "@/app/client";
import { getContract } from "thirdweb";
import { stakingABI } from "./stakingABI";

const nftContractAddress = "0x4bA7161d0FAF245c0c8bA83890c121a3D9Fe3AC9";
const rewardTokenContractAddress = "0x092aC429b9c3450c9909433eB0662c3b7c13cF9A";
const stakingContractAddress = "0x250965c2D14856CCe89406eF5F2f4f7e17453aB1";

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