<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Web3\Web3;
use Web3\Contract;
use Web3\Utils;


class NFTsController extends Controller
{
    public function getBalance(Request $request)
    {
        $user = $request->user();
        // Create a new Web3 instance
        $web3 = new Web3('http://localhost:8545');

        // Set the sender's address
        $user_address = $user->address;

        // Get the eth object from the web3 instance
        $eth = $web3->eth;

        // Get the balance asynchronously
        $eth->getBalance($user_address, function ($err, $resp) {
            // Initialize response array
            $response = [];

            if ($err !== null) {
                // If there is an error, set the error message in the response
                $response['error'] = $err->getMessage();
            } else {
                // If successful, set the balance in the response
                $response['balance'] = $this->wei2eth($resp);
            }

            // Encode the response as JSON and return it
            header('Content-Type: application/json');
            echo json_encode($response);
            
        });

    }

    
    public function sendTransaction(Request $request){

        $request->validate([
            'recipientAddress' => 'required|string',
            'amount' => 'required|numeric|min:0'
        ]);
        $user = $request->user();
        $senderAddr = $user->address;
        $recipientAddr = $request->recipientAddress;
        $web3 = new Web3('http://localhost:8545');
        $eth = $web3->eth;


        $amount = Utils::toWei((string) $request->amount, 'ether');
        $gasLimit = 21000;

        $eth->sendTransaction([
            'from' => $senderAddr,
            'to' => $recipientAddr,
            'value' => '0x' . $this->bcdechex($amount),
            'gas' => '0x' . dechex($gasLimit),

        ], function ($err, $transaction) use ($eth,$senderAddr, $recipientAddr) {
            if ($err !== null) {
                echo 'Error: ' . $err->getMessage();
                return;
            }
            echo 'Tx hash: ' . $transaction . PHP_EOL;
        });

    }


    private function wei2eth($wei){
        return bcdiv($wei, "1000000000000000000", 18);
    }

    private function bcdechex($dec) {
        $hex = '';
        do {    
            $last = bcmod($dec, 16);
            $hex = dechex($last).$hex;
            $dec = bcdiv(bcsub($dec, $last), 16);
        } while($dec>0);
        return $hex;
    }


}
