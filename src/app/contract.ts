import { getContract } from "thirdweb";
import { client } from "./client";
import { chain } from "./chain";
import { ABI } from "./abi";
import { whaleContractAddress } from "../../utils/contracts";

export const contract = getContract({
    client,
    chain,
    address: whaleContractAddress,
    abi: ABI,
});
