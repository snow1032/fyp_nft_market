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
use Illuminate\Support\Facades\Auth;


class NFTsController extends Controller
{
    private static $web3;
    private static $contractAddress;
    private static $contract;

    public function __construct()
    {
        self::$web3 = new Web3('http://localhost:8545');
        self::$contractAddress = "0xa55321f62c22dB5E507cd80334767510bdf98471";
        $abi = Storage::get('NFTs_abi.json');
        // print_r($abi);
        $bytecode = Storage::get('bytecode.txt');

        // Fix the typo here, change $web3 to self::$web3
        self::$contract = new Contract(self::$web3->provider, $abi);
    }

    public function createContract(Request $request)
    {

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
        $contract->bytecode($bytecode)->new(
            $name,
            $symbol,
            [
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

    public function mintNFTs(Request $request)
    {
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
        $nft->owner = $user->id;
        $nft->status = "1";

        NFTsController::$contract->at(NFTsController::$contractAddress)->send('mintUniqueTokenTo', $address, $tokenID, $tokenURL, [

            'from' => $address,
            'to' => $address,
            'gas' => '0x200b20'

        ], function ($err, $result) use ($address, $tokenID, $tokenURL, $nft) {
            if ($err !== null) {
                // print_r($err);
                throw $err;
            } else {
                $nft->save();
                echo true;
            }
        });
    }


    public function getNFTs(Request $request)
    {
        header("Content-Type: application/json");
        $amount = $request->input("amount");
        // $nfts = NFTsToken::all();
        $nfts = NFTsToken::where('status', 1)->get();

        foreach ($nfts as $nft) {
            $creater = User::find($nft->creator);
            $nft["creator_name"] = $creater->name;
        }

        if ($amount != null) {
            return array_slice($nfts->toArray(), 0, $amount);
        }
        return response()->json($nfts, 200);
    }

    public function getAllNFTs(Request $request)
    {
        header("Content-Type: application/json");
        $amount = $request->input("amount");
        $nfts = NFTsToken::all();
        foreach ($nfts as $nft) {
            $creater = User::find($nft->creator);
            $nft["creator_name"] = $creater->name;
            $nft["creator_address"] = $creater->address;
        }

        if ($amount != null) {
            return array_slice($nfts->toArray(), 0, $amount);
        }
        return response()->json($nfts, 200);
    }




    public function creatorCollection(Request $request)
    {
        $user = $request->input("creator");
        $nfts = NFTsToken::where('creator', $user)->get();
        foreach ($nfts as $nft) {
            $creater = User::find($nft->creator);
            $nft["creator_name"] = $creater->name;
        }
        return response()->json($nfts, 200);
    }

    public function collectionNFT(Request $request)
    {
        $user = $request->user();
        $amount = $request->input("amount");
        $nfts = null;

        if ($amount != null) {
            $nfts = NFTsToken::take($amount)->get();
            print_r($nfts);
        } else {
            // $nfts = NFTsToken::all();
            $nfts = NFTsToken::where('owner', $user->id)->where('status', 0)->get();
            foreach ($nfts as $nft) {
                $creater = User::find($nft->creator);
                $nft["creator_name"] = $creater->name;
            }
        }

        return response()->json($nfts, 200);
    }

    public function NFTsImage(Request $request)
    {
        $url = $request->input('url');
        $image_path = 'NFTs/' . $url;
        $file = Storage::get($image_path);
        $type = Storage::mimeType($image_path);
        $response = new Response($file, 200);
        $response->header('Content-Type', $type);
        return $response;
    }

    public function getNftDetails(Request $request)
    {
        $id = $request->input('id');
        $nft = NftsToken::find($id);
        $user = User::find($nft->owner);
        // $nft["owner_name"] = $user->name;
        return response()->json($nft, 200);
    }

    public function getOwnerAddress(Request $request)
    {
        $id = $request->input('owner');
        $ownerAddress = User::where('id', $id)->get('address');

        return response()->json($ownerAddress, 200);
        // return $ownerAddress;
    }


    public function buyNFTs(Request $request)
    {
        //connect eth
        header('Content-Type: application/json');
        $web3 = new Web3('http://localhost:8545');
        $eth = $web3->eth;

        $user = $request->user();
        $id = $request->input('id');
        $nft = NftsToken::find($id);

        if ($nft->status == 1 && $nft->owner == $user->id) {
            return array("status" => false);
        }

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
                        if ($this->transferNFTs($sellerAddr, $buyerAddr, $nft->tokenID)) {
                            $nft->owner = $user->id;
                            $nft->save();
                            return array("status" => true);
                        }
                        return array("status" => false);
                    });
                } else {
                    return array("status" => false);
                }
            }
        });
    }

    public function buyNFTsForReact(Request $request)
    {
        //connect eth
        $web3 = new Web3('http://localhost:8545');
        $eth = $web3->eth;

        $user = $request->user();
        $id = $request->input('id');
        $nft = NftsToken::find($id);

        if ($nft->status == 1 && $nft->owner == $user->id) {
            return array("status" => false, "message" => "purchase NFTs failed");
        }

        $buyerAddr = $user->address; // buyer
        $sellerAddr = User::find($nft->creator)->address; // seller
        // print_r($buyerAddr);
        if ($this->transferNFTs($sellerAddr, $buyerAddr, $nft->tokenID)) {
            $nft->owner = $user->id;
            $nft->status = 0;
            $nft->save();
            return array("status" => true);
        }
    }

    public function transferNFTs($from, $to, $tokenID)
    {
        // $from = "0xF7A06c687C9fC4b7549F207088F38eB666Fd8Eb2";
        // $to = "0x6f55c34c800C6EAEAc43E5260889941318299081";
        // $tokenId = "dabc45ef0273497d865a7df70d45fb28";

        NFTsController::$contract->at(NFTsController::$contractAddress)->send("safeTransferFrom", $from, $to, $tokenID, [
            'from' => $from,
            'to' => $to,
            'tokenId' => $tokenID,
            'gas' => '0x200b20',
        ], function ($err, $result) use ($to, $tokenID) {
            echo $result;
            if ($err !== null) {
                // print_r($err);
                // print_r($err->getMessage());
                // throw $err;
                return true;
            } else {
                //approve
                // NFTsController::$contract->at(NFTsController::$contractAddress)->send(
                //     "approve",
                //     $to,
                //     $tokenID,
                //     function ($err, $result) {
                //         if ($err !== null) {
                //             throw $result;
                //         } else {
                //             return true;
                //         }
                //     }
                // );

                return true;
            }
        });
        return true;
    }


    public function sellMyNFTs(Request $request)
    {
        $user = $request->user();
        $id = $request->input('id');
        $nft = NftsToken::find($id);
        if ($nft->owner == $user->id) {
            $nft->status = 1;
            $nft->save();
            return response()->json(["status" => true], 200);
        }
        return response()->json(["status" => false], 200);
    }


    private function guidv4($data = null)
    {
        $data = $data ?? random_bytes(16);
        assert(strlen($data) == 16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
        return vsprintf('%s%s%s%s%s%s%s%s', str_split(bin2hex($data), 4));
    }

    private function wei2eth($wei)
    {
        return bcdiv($wei, "1000000000000000000", 18);
    }

    private function bcdechex($dec)
    {
        $hex = '';
        do {
            $last = bcmod($dec, 16);
            $hex = dechex($last) . $hex;
            $dec = bcdiv(bcsub($dec, $last), 16);
        } while ($dec > 0);
        return $hex;
    }

    public function getTranscation(Request $request)
    {
        $web3 = new Web3('http://localhost:8545');
        $eth = $web3->eth;
        $txHash = $request->input('txHash');
        $eth->getTransactionReceipt($txHash, function ($err, $result) {
            if ($err !== null) {
                echo $err->getMessage();
            } else {
                echo json_encode($result);
            }
        });
    }

    public function getTransactionHistory(Request $request)
    {
        $web3 = new \Web3\Web3('http://localhost:8545');
        $eth = $web3->eth;
    
        $contractAddress = $request->input('contractAddress');
        $tokenId = $request->input('tokenId');
    
        $filter = [
            'address' => $contractAddress,
            'topics' => [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer event signature
                null,
                null,
                $tokenId, // Filter by token ID
            ],
        ];
    
        $eth->getLogs($filter, function ($err, $logs) {
            if ($err !== null) {
                return response()->json(['error' => $err->getMessage()], 500);
            } else {
                if (empty($logs)) {
                    return response()->json(['message' => 'No NFT transactions found for the given token ID'], 200);
                } else {
                    $nftTransactions = [];
                    foreach ($logs as $log) {
                        $nftTransactions[] = [
                            'transactionHash' => $log->transactionHash->toString(),
                            'blockNumber' => $log->blockNumber->toString(),
                            'from' => $log->topics[1]->toString(),
                            'to' => $log->topics[2]->toString(),
                            'tokenId' => $log->topics[3]->toString(),
                            // Add other relevant properties as needed
                        ];
                    }
                    return response()->json($nftTransactions);
                }
            }
        });
    }
}
