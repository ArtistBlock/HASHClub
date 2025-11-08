import { client } from "./client";
import { chain } from "./chain";
import { ConnectButton } from "@/app/thirdweb";
import { NftMinterComponent } from "./components/NftMinter";

export default function Home() {
  return (
    <main className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>HASH Achievement NFTs</h1>
        <ConnectButton client={client} chain={chain} />
      </div>
      <NftMinterComponent />
    </main>
  );
}
