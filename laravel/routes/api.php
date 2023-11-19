<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\IPFSController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\NFTsController;
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

    Route::post('/ipfs/upload', [IPFSController::class, 'uploadFile']);

    //profile
    Route::post('/profile/upload_icon', [ProfileController::class, 'uploadIcon']);
    Route::get('/profile/icon', [ProfileController::class, 'getIcon']);
    Route::post('/profile/upload_backdrop', [ProfileController::class, 'uploadBackdrop']);
    Route::get('/profile/backdrop', [ProfileController::class, 'getBackdrop']);
    Route::post('/profile/profile_data',[ProfileController::class, 'getProfile']);
});

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });


Route::post('/login', [AuthController::class, 'login']);
Route::post('/login_with_addr', [AuthController::class, 'loginWithAddress']);
Route::post('/register', [AuthController::class, 'register']);

Route::post('/eth/getBalance', [NFTsController::class, 'getBalance']);

