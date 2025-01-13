import { ConnectEmbed } from "@/app/thirdweb";
import { client } from "./client";
import { chain } from "./chain";
import { Staking } from "../../components/Staking";
import { isMobile } from "react-device-detect";
import styles from "./page.module.css";


export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: "20px auto",
        padding: "20px",
        width: "100%",
        maxWidth: isMobile ? "100%" : "400px", // ✅ Adjusted for mobile
        boxSizing: "border-box", 
        textAlign: "center",
      }}
    >
      {/* ✅ Adjusted Header for Mobile and Desktop */}
      <h1 style={{ 
        fontSize: isMobile ? "1.5rem" : "2rem", 
        marginBottom: "20px" 
      }}>
        Gimp NFT Membership Rewards - {isMobile ? "Use MetaMask Mobile App" : "Desktop Only ATM - Please install MetaMask extension"}
      </h1>
      
      {/* ✅ Updated Connect Wallet Section */}
      <ConnectEmbed client={client} chain={chain} />

      {/* ✅ Conditionally Hide Staking on Mobile Without Metamask */}
      {isMobile ? (
        <p style={{ color: "orange" }}>
          Please use the MetaMask mobile browser for staking.
        </p>
      ) : (
        <Staking />
      )}
    </div>
  );
}
