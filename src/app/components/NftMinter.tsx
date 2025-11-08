"use client";

import { TransactionButton, useActiveAccount, useReadContract, getContract } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { NftCard } from "./NftCard";
import { useState, useEffect } from "react";
import { ABI } from "../abi"; // Reverted import
import { client } from "../client";
import { chain } from "../chain";
import { whaleContractAddress } from "../../../utils/contracts";

const DOLPHIN_METADATA_URI = "https://bafkreibslmgaovzo24fpa3nulmaak3qfiwcfbba4uhcxx4m5me3aeypxd4.ipfs.dweb.link/";
const SHARK_METADATA_URI = "https://bafkreib4kaiiqkbisq3lt7gxtwph7yovynobsxcbtnubdwcafccz2wdekm.ipfs.dweb.link/";
const WHALE_METADATA_URI = "https://bafkreif2mmnb37tf33fso4ruz6spzzbxjjptznghfkqk7aam3fqusvvtgy.ipfs.dweb.link/";

function MinterContent({ account }: { account: any }) {
    const contract = getContract({
        client,
        chain,
        address: whaleContractAddress,
        abi: ABI, // Reverted ABI access
    });

    const { data: stats, isLoading: isStatsLoading, error, refetch: refetchStats } = useReadContract({
        contract,
        method: "getUserStats" as any,
        params: [account.address],
    });

    console.log("Stats data from useReadContract:", stats); // Debugging line
    console.log("Error from useReadContract (getUserStats):", error); // Debugging line

    const { data: balance, isLoading: isBalanceLoading, refetch: refetchBalance } = useReadContract({
        contract,
        method: "balanceOf" as any,
        params: [account.address],
    });

    const userStats = stats ? {
        totalEarned: stats[0],
        currentStakingRewards: stats[1],
        lastSynced: stats[2],
        dolphinEligible: stats[3],
        sharkEligible: stats[4],
        whaleEligible: stats[5],
        dolphinMinted: stats[6],
        sharkMinted: stats[7],
        whaleMinted: stats[8],
    } : null;

    const [dolphinImageUrl, setDolphinImageUrl] = useState<string | null>(null);
    const [sharkImageUrl, setSharkImageUrl] = useState<string | null>(null);
    const [whaleImageUrl, setWhaleImageUrl] = useState<string | null>(null);
    const [areIconsLoading, setAreIconsLoading] = useState(true);

    console.log("isIconsLoading:", areIconsLoading);
    console.log("userStats:", userStats);

    useEffect(() => {
        const fetchIcons = async () => {
            setAreIconsLoading(true);
            try {
                const fetchAndSetImage = async (metadataUri: string, setter: (url: string) => void) => {
                    const response = await fetch(metadataUri);
                    const metadata = await response.json();
                    if (metadata.image) {
                        setter(metadata.image);
                    }
                };

                await Promise.all([
                    fetchAndSetImage(DOLPHIN_METADATA_URI, setDolphinImageUrl),
                    fetchAndSetImage(SHARK_METADATA_URI, setSharkImageUrl),
                    fetchAndSetImage(WHALE_METADATA_URI, setWhaleImageUrl),
                ]);

            } catch (e) {
                console.error("Error fetching NFT icons metadata:", e);
            } finally {
                setAreIconsLoading(false);
            }
        };
        fetchIcons();
    }, []);


    return (
        <div className="container">
            <div className="user-panel">
                <h2>User Panel</h2>
                {isStatsLoading ? (
                    <p>Loading stats...</p>
                ) : userStats ? (
                    <div>
                        <p><strong>Total Earned:</strong> {userStats.totalEarned ? (userStats.totalEarned / 10n**18n).toString() : '0'} HASH</p>
                        <p><strong>Current Staking Rewards:</strong> {userStats.currentStakingRewards ? (userStats.currentStakingRewards / 10n**18n).toString() : '0'} HASH</p>
                    </div>
                ) : (
                    <>
                        <p>No stats available.</p>
                        {stats === null && error && <p style={{ color: "red" }}>Error: {error.message}</p>}
                    </>
                )}
                <TransactionButton
                    transaction={() => prepareContractCall({
                        contract,
                        method: "syncRewards",
                        params: [],
                    })}
                    onTransactionConfirmed={() => refetchStats()}
                    className="button"
                >
                    Sync Rewards
                </TransactionButton>
            </div>

            <div className="mint-panel">
                <h2>Mint Achievement NFTs</h2>
                {areIconsLoading ? (
                    <p>Loading NFT icons...</p>
                ) : userStats && (
                    <div>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                            {dolphinImageUrl && <img src={dolphinImageUrl} alt="Dolphin NFT" width="100" style={{ marginRight: "10px" }} />}
                            <strong>Dolphin Tier (1,000 HASH)</strong>
                            {!userStats.dolphinMinted ? (
                                <TransactionButton
                                    transaction={() => prepareContractCall({
                                        contract,
                                        method: "mintDolphin",
                                        params: [],
                                    })}
                                    onTransactionConfirmed={() => {
                                        refetchStats();
                                        refetchBalance();
                                    }}
                                    disabled={!userStats.dolphinEligible}
                                    className="button"
                                >
                                    Mint Dolphin
                                </TransactionButton>
                            ) : <p style={{ marginLeft: "10px" }}>Already minted!</p>}
                        </div>
                        <hr style={{margin: "10px 0"}} />
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                            {sharkImageUrl && <img src={sharkImageUrl} alt="Shark NFT" width="100" style={{ marginRight: "10px" }} />}
                            <strong>Shark Tier (5,000 HASH)</strong>
                            {!userStats.sharkMinted ? (
                                <TransactionButton
                                    transaction={() => prepareContractCall({
                                        contract,
                                        method: "mintShark",
                                        params: [],
                                    })}
                                    onTransactionConfirmed={() => {
                                        refetchStats();
                                        refetchBalance();
                                    }}
                                    disabled={!userStats.sharkEligible}
                                    className="button"
                                >
                                    Mint Shark
                                </TransactionButton>
                            ) : <p style={{ marginLeft: "10px" }}>Already minted!</p>}
                        </div>
                        <hr style={{margin: "10px 0"}} />
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                            {whaleImageUrl && <img src={whaleImageUrl} alt="Whale NFT" width="100" style={{ marginRight: "10px" }} />}
                            <strong>Whale Tier (25,000 HASH)</strong>
                            {!userStats.whaleMinted ? (
                                <TransactionButton
                                    transaction={() => prepareContractCall({
                                        contract,
                                        method: "mintWhale",
                                        params: [],
                                    })}
                                    onTransactionConfirmed={() => {
                                        refetchStats();
                                        refetchBalance();
                                    }}
                                    disabled={!userStats.whaleEligible}
                                    className="button"
                                >
                                    Mint Whale
                                </TransactionButton>
                            ) : <p style={{ marginLeft: "10px" }}>Already minted!</p>}
                        </div>
                    </div>
                )}
            </div>

            <div className="nft-gallery">
                <h2>Your NFT Collection</h2>
                {isBalanceLoading ? (
                    <p>Loading NFTs...</p>
                ) : balance && Number(balance) > 0 ? (
                    <div className="nft-gallery-grid">
                        {Array.from({ length: Number(balance) }).map((_, index) => (
                            <NftCard key={index} owner={account.address} index={index} />
                        ))}
                    </div>
                ) : (
                    <p>You don't own any NFTs from this collection yet.</p>
                )}
            </div>
        </div>
    );
}


export function NftMinterComponent() {
    const account = useActiveAccount();

    if (!account) {
        return <div className="container">Please connect your wallet.</div>;
    }

    return <MinterContent account={account} />;
}