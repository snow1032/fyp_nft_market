<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Web3\Web3;
use Web3\Contract;
use Web3\Utils;
use Storage;
use File;
use Illuminate\Support\Str;
use App\Models\NftsToken;
use Illuminate\Http\Response;


class NFTsController extends Controller
{
    private static $web3;
    private static $contractAddress;
    private static $contract;

    public function __construct()
    {
        self::$web3 = new Web3('http://localhost:8545');
        self::$contractAddress = "0x2673932bEDCb9BC10762034ED56312d5a68491c6";
        $abi = Storage::get('NFTs_abi.json');
        $bytecode = Storage::get('bytecode.txt');
        
        // Fix the typo here, change $web3 to self::$web3
        self::$contract = new Contract(self::$web3->provider, $abi);
    }

    public function createContract(Request $request){

        $user = $request->user();
        header('Content-Type: application/json');

        $web3 = new Web3('http://localhost:8545');

        $fromAccount = $user->address;
        $name = "NFTs";
        $symbol = "NFT";
        // $tokenID = 10000;
        // $tokenURL = 'http://url.com';

        $abi = Storage::get('NFTs_abi.json');
        $bytecode = Storage::get('bytecode.txt');
        
        $contract = new Contract($web3->provider, $abi);
        $contract->bytecode($bytecode)->new($name, $symbol, [
            'from' => $fromAccount,
            'gas' => '0x200b20'
            ],
            function ($err, $result) use ($contract, $name, $symbol, $fromAccount) {
                if ($err !== null) {
                    throw $err;
                }
        
                if ($result) {
                    
                    echo "\nTransaction has made:) id: " . $result . "\n";
        
                    // Assuming you want to get the transaction receipt after the transaction is mined
                    $contract->eth->getTransactionReceipt($result, function ($err, $transaction) use ($contract, $fromAccount) {
                        if ($err !== null) {
                            throw $err;
                        }
                        // Handle the transaction receipt, e.g., print or process the data
                        var_dump($transaction);
                        echo $contractAddress;
                        // $contract->at($contractAddress)->send('mintUniqueTokenTo', $fromAccount, $tokenID, $tokenURL, [
                        //     'from' => $fromAccount,
                        //     'to' => $fromAccount,
                        //     'gas' => '0x200b20'
                        // ], function ($err, $result) use ($contract, $contractAddress, $tokenID, $fromAccount){
                        //     if ($err !== null) {
                        //         throw $err;
                        //     }
                            
                        //     var_dump($result);
                        // });

                    });
                }
            }
        );

    }

    public function mintNFTs(Request $request){
        header('Content-Type: application/json');
        $request->validate([
            'name' => 'required|string',
            'media' => 'required|image|mimes:jpeg,png,jpg,gif|max:102400',
            'royalties' => 'required|between:0,99.99',
            'price' => 'required|numeric',
            'description' => 'required|string'
        ]);

        //handle file
        $file = $request->file('media');
        $id = Str::uuid()->toString();
        $fileName = $id . '.' . $file->getClientOriginalExtension();
        $filePath = $file->storeAs('', $fileName, 'NFTs');
        $url = Storage::url($filePath);

        $user = $request->user();
        $address = $user->address;
        $tokenURL = $fileName;
        $tokenID = $this->guidv4();

        //create NFTs contract 
        $nft = new NftsToken();
        $nft->name = $request->input('name');
        $nft->tokenID = $tokenID;
        $nft->royalties = 0;
        $nft->url = $tokenURL;
        $nft->price = $request->input('price');
        $nft->description = $request->input('description');
        $nft->creator = $user->id;
        
        NFTsController::$contract->at(NFTsController::$contractAddress)->send('mintUniqueTokenTo',$address, $tokenID, $tokenURL, [
            'from' => $address,
            'to' => $address,
            'gas' => '0x200b20'

        ], function ($err, $result) use ($address, $tokenID, $tokenURL, $nft){
            if ($err !== null) {
                echo "Error";
                throw $err;
            }
            
            $nft->save();
            echo true;
        });
        

    }

    public function getNFTs(Request $request){
        $amount = $request->input("amount");
        $nfts = null;

        if($amount != null){
            $nfts = NFTsToken::take($amount)->get();
        }else{
            $nfts = NFTsToken::all();
        }

        return response()->json($nfts, 200);
    }

    public function NFTsImage(Request $request){
        $url = $request->input('url');
        $image_path = 'NFTs/' . $url;
        $file = Storage::get($image_path);
        $type = Storage::mimeType($image_path);
        $response = new Response($file, 200);
        $response->header('Content-Type', $type);
        return $response;
    }

    public function getNftDetails(Request $request){
        $id = $request->input('id');
        $nft = NftsToken::find($id);
        return response()->json($nft, 200);
    }

    private function guidv4($data = null) {
        $data = $data ?? random_bytes(16);
        assert(strlen($data) == 16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
        return vsprintf('%s%s%s%s%s%s%s%s', str_split(bin2hex($data), 4));
    }

    
}
