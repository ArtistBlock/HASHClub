"use client";

import { useReadContract } from "thirdweb/react";
import { contract } from "../contract";
import { useState, useEffect } from "react";

export function NftCard({ owner, index }: { owner: string; index: number }) {
    const { data: tokenId, isLoading: isTokenIdLoading, error } = useReadContract({
        contract,
        method: "tokenOfOwnerByIndex",
        params: [owner, BigInt(index)],
    });

    const { data: metadataUri, isLoading: isMetadataUriLoading } = useReadContract({
        contract,
        method: "tokenURI",
        params: [tokenId as bigint],
        queryOptions: {
            enabled: !!tokenId,
        }
    });

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isImageLoading, setIsImageLoading] = useState(true);

    useEffect(() => {
        const fetchImage = async () => {
            if (metadataUri) {
                setIsImageLoading(true);
                try {
                    const response = await fetch(metadataUri);
                    const metadata = await response.json();
                    if (metadata.image) {
                        setImageUrl(metadata.image);
                    }
                } catch (e) {
                    console.error("Error fetching NFT metadata:", e);
                } finally {
                    setIsImageLoading(false);
                }
            }
        };
        fetchImage();
    }, [metadataUri]);


    if (isTokenIdLoading || isMetadataUriLoading) {
        return <div className="nft-card">Loading NFT data...</div>;
    }

    if (!tokenId) {
        console.error("Error fetching tokenId:", error);
        return <div className="nft-card">Error loading NFT.</div>;
    }

    console.log("NFT Metadata URI:", metadataUri); // Added for debugging

    return (
        <div className="nft-card">
            <h4>Token #{(tokenId as bigint).toString()}</h4>
            {isImageLoading ? (
                <p>Loading image...</p>
            ) : (
                imageUrl && <img src={imageUrl} alt={`NFT with id ${tokenId}`} width="200" />
            )}
        </div>
    );
}