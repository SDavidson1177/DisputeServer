// Import necessary packages
import { HttpJsonRpcConnector, LotusClient } from "filecoin.js";
import {useEffect, useState} from 'react'
import BigNumber from "bignumber.js";
import { useForm } from "react-hook-form";

// Use the local node URL to create a connection to your Lotus node
const localNodeUrl = "/rpc/v0";
const adminAuthToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.HQqs47ezEiD67HbbIy6eVkJpBAqlOogyYvQwL-UKZdI"
const localConnector = new HttpJsonRpcConnector({ url: localNodeUrl });

// // lotusClient exposes all Lotus APIs
const lotusClient = new LotusClient(localConnector);

async function storeFile(data){
    try {
        console.log(data.file[0].name);
        await fetch("/api", {
            method: "GET",
            headers: {"Content-Type" : "application/json"}
        });
    } catch (error) {
      console.log(error);
    }
}

// UI for vendor submit license as well as the evidence
// for whatever service they provide
export function VendorUI() {
    const [balance, setBalance] = useState(0);
    const [wallet, setWallet] = useState("");

    const { register, handleSubmit } = useForm();

    const getVersion = async () => {
        let version;
        try {
            version = await lotusClient.common.version();
        } catch (e) {

        }
        console.log(version);
    }

    const getBalance = async (data) => {
        try {
            let b = await lotusClient.wallet.balance(data.wallet_id);
            setWallet(data.wallet_id);
            setBalance(b);
        } catch (e) {
            console.log(e);
            setBalance(0);
            setWallet("");
        }
    }
    
    useEffect(() => {
        getVersion();
    });

    return(
        <>
            <h1>Vendor UI</h1>
            <h2>Selected Wallet: {wallet}</h2>
            <h2>Current Balance: {balance}</h2>
            <div id="query-balance">
                <h2>Select Wallet</h2>
                <form onSubmit={handleSubmit(getBalance)}>
                    <label>Wallet ID: <input {...register("wallet_id")}/></label>
                    <input type="submit" />
                </form>
            </div>
            <div id="submit-license">
                <h2>Submit License For Verification</h2>
                <form method="POST" onSubmit={handleSubmit(storeFile)} encType="multipart/form-data">
                    <input type="file"
                        id="license" name="license"
                        {...register("file")}>
                    </input>
                    <input type="submit" />
                </form>
            </div>
            <div id="submit-evidence">
                <h2>Submit Evidence of Work</h2>
                <form>
                    <input type="file"
                        id="evidence" name="evidence"
                        accept="image/png, image/jpeg">
                    </input>
                    <label> Client Address
                        <input type="text"></input>
                    </label>
                </form>
            </div>
        </>
    );
}