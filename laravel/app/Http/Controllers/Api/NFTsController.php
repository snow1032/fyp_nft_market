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

        // Create a new Web3 instance
        $web3 = new Web3('http://localhost:8545');

        // Set the sender's address and private key
        $from_address = '0x9cAB06d6362724F483670acf3D719995508C5434';
        $from_address_private_key = '0xf9ca041906f897d5381e8d153c2a94cf28b2c9ae09e99f3c41911105fc620edb';

        // Get the eth object from the web3 instance
        $eth = $web3->eth;

        // Get the balance asynchronously
        $eth->getBalance($from_address, function ($err, $resp) {
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
            echo json_encode($response);
        });

    }

    
    public function sendTransaction(Request $request){

        $web3 = new Web3('http://localhost:8545');
        $eth = $web3->eth;

        $senderAddress = "0xAb3C2B405BA95059797Ff01fad40587F4300491C";

        $recipientAddress = "0xeC76b4EeB4b90008aBA2d8145F1908c174604EE0";

        $amount = Utils::toWei('1', 'ether');
        $gasLimit = 21000;

        $eth->sendTransaction([
            'from' => $senderAddress,
            'to' => $recipientAddress,
            'value' => '0x' . $this->bcdechex($amount),
            'gas' => '0x' . dechex($gasLimit),

        ], function ($err, $transaction) use ($eth, $senderAddress, $recipientAddress) {
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
