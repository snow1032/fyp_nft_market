<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\IPFSController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\NFTsController;
use App\Http\Controllers\Api\EthereumController;
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

Route::middleware('auth:sanctum')->group(function(){

    Route::post('/logout', [AuthController::class, 'logout']);

   

    //profile
    Route::post('/profile/upload_icon', [ProfileController::class, 'uploadIcon']);
    Route::get('/profile/icon', [ProfileController::class, 'getIcon']);
    Route::post('/profile/upload_backdrop', [ProfileController::class, 'uploadBackdrop']);
    Route::get('/profile/backdrop', [ProfileController::class, 'getBackdrop']);
    Route::post('/profile/profile_data',[ProfileController::class, 'getProfile']);
    
    
    //ETH and NFTs
    Route::post('/eth/getBalance', [EthereumController::class, 'getBalance']);
    Route::post('/eth/sendTransaction', [EthereumController::class, 'sendTransaction']);

    Route::post('/nft/createContract', [NFTsController::class, 'createContract']);
    Route::post('/nft/mintNFTs', [NFTsController::class, 'mintNFTs']);
    
});

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

 Route::post('/ipfs/upload', [IPFSController::class, 'uploadFile']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/login_with_addr', [AuthController::class, 'loginWithAddress']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/nft/getNFTs', [NFTsController::class, 'getNFTs']);
Route::get('/nft/imageURL', [NFTsController::class, 'NFTsImage']);
Route::get('/nft/get_nft_details', [NFTsController::class, 'getNftDetails']);




