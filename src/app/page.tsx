import { ConnectEmbed } from "@/app/thirdweb";
import { client } from "./client";
import { chain } from "./chain";
import { Staking } from "../../components/Staking";
import { isMobile } from "react-device-detect";

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
        maxWidth: "400px",
        boxSizing: "border-box", 
        textAlign: "center",
      }}
    >
      {/* Dynamic Message for Desktop and Mobile */}
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>
        Gimp Staking - {isMobile ? "Use MetaMask Mobile App" : "Desktop Only - Please install MetaMask extension"}
      </h1>
      
      {/* Connect Wallet Component */}
      <ConnectEmbed client={client} chain={chain} />

      {/* NFT Staking Section */}
      <Staking />
    </div>
  );
}
