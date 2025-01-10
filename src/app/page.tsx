import { ConnectEmbed } from "@/app/thirdweb";
import { client } from "./client";
import { chain } from "./chain";
import { Staking } from "../../components/Staking";

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center", // Center vertically for mobile too
        margin: "20px auto",
        padding: "20px",
        width: "100%",          // Make the width responsive
        maxWidth: "400px",      // Limit max size for larger screens
        boxSizing: "border-box", 
        textAlign: "center",     // Center text for all screens
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>Gimp Staking</h1>
      
      {/* Connect Wallet Component */}
      <ConnectEmbed client={client} chain={chain} />

      {/* NFT Staking Section */}
      <Staking />

    </div>
  );
}
