import { useState } from "react";
import { ethers } from 'ethers';




const startPayment = async ({ ether, address }) => {
    try {
        if (!window.etherem) {
            throw new Error("Metamask not found");
        }
        await window.ethereum.send("eth_requestAccounts");
        console.log({ ether, address });
    } catch (err) {
        console.log(err);
    }
}


const  transactionObject = {
    startPayment: startPayment

};

module.exports = {
    startPayment: startPayment
};

    // const transaction = {
    //     requestAccounts: requestAccounts
    // };


