<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Web3\Web3;
use Web3\Contract;
use Web3\Utils;
use Storage;
use File;
use App\Models\User;
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
        self::$contractAddress = "0x18B99084046faD9428339Bd337d94f58DEC305fA";
        $abi = Storage::get('NFTs_abi.json');
        // print_r($abi);
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
            'cid' => 'required|string',
            'cidV1' => 'required|string', // 'cidV1' => 'required|string
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
        // print_r($user);
        $address = $user->address;
        $tokenURL = $fileName;
        $tokenID = $this->guidv4();

        //create NFTs contract 
        $nft = new NftsToken();
        $nft->name = $request->input('name');
        $nft->tokenID = $tokenID;
        $nft->cid = $request->input('cid');
        $nft->cidV1 = $request->input('cidV1');
        $nft->royalties = 0;
        $nft->url = $tokenURL;
        $nft->price = $request->input('price');
        $nft->description = $request->input('description');
        $nft->creator = $user->id;
        // $nft->status = "0";

        
        NFTsController::$contract->at(NFTsController::$contractAddress)->send('mintUniqueTokenTo',$address, $tokenID, $tokenURL, [
            'from' => $address,
            'to' => $address,
            'gas' => '0x200b20'

        ], function ($err, $result) use ($address, $tokenID, $tokenURL, $nft){
            if ($err !== null) {
                // print_r($err);
                throw $err;
            }else{
                $nft->save();
                echo true;
            }
        });
        

    }

    public function getNFTs(Request $request){
        $amount = $request->input("amount");
        $nfts = null;

        if($amount != null){
            $nfts = NFTsToken::take($amount)->get();
            print_r($nfts);
        }else{
            // $nfts = NFTsToken::all();
            $nfts = NFTsToken::where('status', 1)->get();
        }

        return response()->json($nfts, 200);
    }

    public function collectionNFT(Request $request){
        $user = $request->user();
        $amount = $request->input("amount");
        $nfts = null;

        if($amount != null){
            $nfts = NFTsToken::take($amount)->get();
            print_r($nfts);
        }else{
            // $nfts = NFTsToken::all();
            $nfts = NFTsToken::where('owner', $user->id)->where('status', 0)->get();
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



    public function buyNFTs(Request $request){
        //connect eth
        $web3 = new Web3('http://localhost:8545');
        $eth = $web3->eth;
    
        $user = $request->user();
        $id = $request->input('id');
        $nft = NftsToken::find($id);
        $nft_price = Utils::toWei((string) $nft->price, 'ether');
    
        $gasLimit = 21000;
    
        $eth->getBalance($user->address, function ($err, $resp) use ($nft, $nft_price, $user, $eth, $gasLimit, $id) {
            if ($err !== null) {
                echo $err->getMessage();
            } else {
                if ($this->wei2eth($resp) > $this->wei2eth($nft_price)) {
                    $buyerAddr = $user->address; // buyer
                    $sellerAddr = User::find($nft->creator)->address; // seller
    
                    // trading
                    $eth->sendTransaction([
                        'from' => $buyerAddr,
                        'to' => $sellerAddr,
                        'value' => '0x' . $this->bcdechex($nft_price),
                        'gas' => '0x' . dechex($gasLimit),
                    ], function ($err, $transaction) use ($eth, $buyerAddr, $sellerAddr, $nft, $user) {
                        if ($err !== null) {
                            echo 'Error: ' . $err->getMessage();
                            return;
                        }
                        //echo 'Tx hash: ' . $transaction . PHP_EOL;
                        if($this->transferNFTs($sellerAddr, $buyerAddr, $nft->tokenID)){
                            $nft->owner = $user->id;
                            $nft->save();
                            echo true;
                        }
                        echo false;
                    });
                } else {
                    echo false;
                }
            }
        });
    }

    private function transferNFTs($from, $to, $tokenID){
        // $from = "0xF7A06c687C9fC4b7549F207088F38eB666Fd8Eb2";
        // $to = "0x6f55c34c800C6EAEAc43E5260889941318299081";
        // $tokenId = "dabc45ef0273497d865a7df70d45fb28";

        NFTsController::$contract->at(NFTsController::$contractAddress)->send("safeTransferFrom", $from, $to, $tokenID, [
            'from' => $from,
            'to' => $to,
            'tokenId' => $tokenID,
            'gas' => '0x200b20',
        ], function($err, $result){
            if ($err !== null) {
                // print_r($err);
                throw $err;
            } else {
                return true; 
            }
        });
        return true;
        
    }



    private function guidv4($data = null) {
        $data = $data ?? random_bytes(16);
        assert(strlen($data) == 16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
        return vsprintf('%s%s%s%s%s%s%s%s', str_split(bin2hex($data), 4));
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
