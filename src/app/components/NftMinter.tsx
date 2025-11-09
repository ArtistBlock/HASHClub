"use client";

import { TransactionButton, useActiveAccount, useReadContract, useSendAndConfirmTransaction } from "thirdweb/react";
import { getContract } from "thirdweb";
import { prepareContractCall } from "thirdweb";

import { useState, useEffect } from "react";
import styles from "./NftMinter.module.css";
import { ABI } from "../abi";
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
        abi: ABI,
    });

    const { data: userStatus, refetch } = useReadContract({
        contract,
        method: "getUserStatus",
        params: [account.address || ""],
    });

    const [earnedHASH, dolphinAvailable, sharkAvailable, whaleAvailable, hasDolphin, hasShark, hasWhale] = userStatus || [];

    const { mutate: mintDolphin } = useSendAndConfirmTransaction();
    const { mutate: mintShark } = useSendAndConfirmTransaction();
    const { mutate: mintWhale } = useSendAndConfirmTransaction();

    const { data: balance, isLoading: isBalanceLoading, refetch: refetchBalance } = useReadContract({
        contract,
        method: "balanceOf" as any,
        params: [account.address],
    });

    const [dolphinImageUrl, setDolphinImageUrl] = useState<string | null>(null);
    const [sharkImageUrl, setSharkImageUrl] = useState<string | null>(null);
    const [whaleImageUrl, setWhaleImageUrl] = useState<string | null>(null);
    const [areIconsLoading, setAreIconsLoading] = useState(true);

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
                {userStatus ? (
                    <div>
                        <p><strong>Total Earned:</strong> {earnedHASH ? (earnedHASH / 10n**18n).toString() : '0'} HASH</p>
                    </div>
                ) : (
                    <>
                        <p>No stats available.</p>
                    </>
                )}
            </div>

            <div className="mint-panel">
                <h2>Mint Achievement NFTs</h2>
                {areIconsLoading ? (
                    <p>Loading NFT icons...</p>
                ) : userStatus && (
                    <div>
                        <div className={styles.flexContainer}>
                            {dolphinImageUrl && <img src={dolphinImageUrl} alt="Dolphin NFT" width="100" className={styles.imageMarginRight} />}
                            <strong>Dolphin Tier (1,000 HASH)</strong>
                            <button
                                onClick={() => mintDolphin(prepareContractCall({ contract, method: "mintDolphin", params: [] }), { onSuccess: () => { refetch(); refetchBalance(); } })}
                                disabled={!dolphinAvailable || hasDolphin}
                                className={dolphinAvailable ? "button" : "button-locked"}
                              >
                                {hasDolphin ? "✅ Dolphin" : 
                                 dolphinAvailable ? "🎯 Claim Dolphin" : 
                                 `🐬 ${earnedHASH ? (earnedHASH / 10n**18n).toString() : '0'}/1000 HASH`}
                              </button>
                        </div>
                        <hr className={styles.horizontalRuleMargin} />
                        <div className={styles.flexContainer}>
                            {sharkImageUrl && <img src={sharkImageUrl} alt="Shark NFT" width="100" className={styles.imageMarginRight} />}
                            <strong>Shark Tier (5,000 HASH)</strong>
                            <button
                                onClick={() => mintShark(prepareContractCall({ contract, method: "mintShark", params: [] }), { onSuccess: () => { refetch(); refetchBalance(); } })}
                                disabled={!sharkAvailable || hasShark}
                                className={sharkAvailable ? "button" : "button-locked"}
                              >
                                {hasShark ? "✅ Shark" :
                                 sharkAvailable ? "🎯 Claim Shark" :
                                 `🦈 ${earnedHASH ? (earnedHASH / 10n**18n).toString() : '0'}/5000 HASH`}
                              </button>
                        </div>
                        <hr className={styles.horizontalRuleMargin} />
                        <div className={styles.flexContainer}>
                            {whaleImageUrl && <img src={whaleImageUrl} alt="Whale NFT" width="100" className={styles.imageMarginRight} />}
                            <strong>Whale Tier (25,000 HASH)</strong>
                            <button
                                onClick={() => mintWhale(prepareContractCall({ contract, method: "mintWhale", params: [] }), { onSuccess: () => { refetch(); refetchBalance(); } })}
                                disabled={!whaleAvailable || hasWhale}
                                className={whaleAvailable ? "button" : "button-locked"}
                              >
                                {hasWhale ? "✅ Whale" :
                                 whaleAvailable ? "🎯 Claim Whale" :
                                 `🐋 ${earnedHASH ? (earnedHASH / 10n**18n).toString() : '0'}/25000 HASH`}
                              </button>
                        </div>
                    </div>
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