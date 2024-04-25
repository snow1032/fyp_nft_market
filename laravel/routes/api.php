<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\IPFSController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\NFTsController;
use App\Http\Controllers\Api\EthereumController;
use Illuminate\Auth\Middleware\Authorize;
use PharIo\Manifest\Author;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    //profile
    Route::post('/profile/upload_icon', [ProfileController::class, 'uploadIcon']);
    Route::get('/profile/icon', [ProfileController::class, 'getIcon']);
    Route::post('/profile/upload_backdrop', [ProfileController::class, 'uploadBackdrop']);
    Route::get('/profile/backdrop', [ProfileController::class, 'getBackdrop']);
    Route::post('/profile/profile_data', [ProfileController::class, 'getProfile']);
    Route::post('/profile/update_profile_data', [ProfileController::class, 'updateProfile']);
    Route::post('/profile/getBoughtNFTs', [ProfileController::class, 'getBoughtNFTs']);

    //ETH and NFTs
    Route::post('/eth/getBalance', [EthereumController::class, 'getBalance']);
    Route::post('/eth/sendTransaction', [EthereumController::class, 'sendTransaction']);

    Route::post('/nft/createContract', [NFTsController::class, 'createContract']);
    Route::post('/nft/mintNFTs', [NFTsController::class, 'mintNFTs']);
    Route::post('/nft/buyNFTs', [NFTsController::class, 'buyNFTs']);
    Route::post('/nft/buyNFTsForReact', [NFTsController::class, 'buyNFTsForReact']);
    Route::get('/nft/collectionNFT', [NFTsController::class, 'collectionNFT']);
    Route::post('/nft/sellMyNFTs', [NFTsController::class, 'sellMyNFTs']);


    
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    header('Content-Type: application/json');
    print_r($request->user());
    return $request->user();
});

// Route::get('/user', function () {
//     auth()->user();
//     print_r(auth());
//     // return auth()->user();
// })->middleware('auth:sanctum');

Route::post('/ipfs/upload', [IPFSController::class, 'uploadFile']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/login_with_addr', [AuthController::class, 'loginWithAddress']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/nft/getNFTs', [NFTsController::class, 'getNFTs']);
Route::get('/nft/getAllNFTs', [NFTsController::class, 'getAllNFTs']);
Route::get('/nft/imageURL', [NFTsController::class, 'NFTsImage']);
Route::get('/nft/get_nft_details', [NFTsController::class, 'getNftDetails']);
Route::post('/nft/creatorCollection', [NFTsController::class, 'creatorCollection']);
Route::post('/nft/getOwnerAddress', [NFTsController::class, 'getOwnerAddress']);
Route::post('/nft/getTranscation', [NFTsController::class, 'getTranscation']);
Route::post('/nft/getTransactionHistory', [NFTsController::class, 'getTransactionHistory']);
