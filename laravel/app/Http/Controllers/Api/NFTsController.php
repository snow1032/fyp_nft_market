<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Web3\Web3;
use Web3\Contract;
use Web3\Utils;
use Storage;
use File;


class NFTsController extends Controller
{

    public function callContract(Request $request){
        header('Content-Type: application/json');

        $web3 = new Web3('http://localhost:8545');

        $fromAccount = '0x17C5e57b4A7e9a609EAEA9F192b0Df4A09828C7f';

        $name = "BlueCat";
        $symbol = "BCat";
        $tokenID = 10000;
        $tokenURL = 'http://url.com';
        

        $abi = Storage::get('NFTs_abi.json');
        $bytecode = Storage::get('bytecode.txt');
        
        $contract = new Contract($web3->provider, $abi);
        $contract->bytecode($bytecode)->new($name, $symbol, [
            'from' => $fromAccount,
            'gas' => '0x200b20'
            ],
            function ($err, $result) use ($contract, $name, $symbol, $fromAccount, $tokenID, $tokenURL) {
                if ($err !== null) {
                    throw $err;
                }
        
                if ($result) {
                    echo "\nTransaction has made:) id: " . $result . "\n";
        
                    // Assuming you want to get the transaction receipt after the transaction is mined
                    $contract->eth->getTransactionReceipt($result, function ($err, $transaction) use ($contract, $fromAccount, $tokenID, $tokenURL) {
                        if ($err !== null) {
                            throw $err;
                        }
        
                        // Handle the transaction receipt, e.g., print or process the data
                        //var_dump($transaction);

                        $contractAddress = $transaction->contractAddress;
                        
                        $contract->at($contractAddress)->send('mintUniqueTokenTo', $fromAccount, $tokenID, $tokenURL, [
                            'from' => $fromAccount,
                            'to' => $fromAccount,
                            'gas' => '0x200b20'
                        ], function ($err, $result) use ($contract, $contractAddress, $tokenID, $fromAccount){
                            if ($err !== null) {
                                throw $err;
                            }
                            
                            var_dump($result);
                        });

                    });
                }
            }
        );


        //$contract->at($contractAddress)->call('mintUniqueTokenTo', 

        // echo $abi;

    }

}
