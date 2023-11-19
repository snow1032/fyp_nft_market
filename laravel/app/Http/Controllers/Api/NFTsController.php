<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Web3\Web3;



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


    private function wei2eth($wei){
        return bcdiv($wei, "1000000000000000000", 18);
    }

}
