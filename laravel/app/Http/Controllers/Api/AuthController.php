<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Passport\RefreshToken;
use Laravel\Passport\Token;


class AuthController extends Controller
{
/**
 * @OA\Post(
 *     path="/login",
 *     @OA\Parameter(
 *         name="email",
 *         required=true,
 *         in="query",
 *         @OA\Schema(
 *             type="string"
 *         )
 *     ),
 *     @OA\Parameter(
 *         name="password",
 *         required=true,
 *         in="query",
 *         @OA\Schema(
 *             type="string"
 *         )
 *     ),
 *     @OA\Response(
 *         response="200",
 *         description="login function",
 *         @OA\MediaType(
 *             mediaType="application/json",
 *             @OA\Schema(
 *                 @OA\Property(
 *                     property="user",
 *                     type="string"
 *                 ),
 *                 @OA\Property(
 *                     property="token",
 *                     type="string"
 *                 )
 *             )
 *         )
 *     )
 * )
 */
    public function login(Request $request){
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required',
        ]);

        if(!Auth::attempt($credentials)){
            return response([
                'message' => 'Provided email or password is incorrect'
            ], 422);
        }

        $user = Auth::user();
        // print_r($user);
        $token = $user->createToken('main')->plainTextToken;
        print_r($token);
        return response(compact('user', 'token'));
    }



    public function loginWithAddress(Request $request){
        $request->validate([
            'address' => 'required',
            'password' => 'required',
        ]);
        
        $user = User::where('address',$request->input('address'))->first();
        if($user && (Hash::check($request->input('password'), $user->password))){
            $token = $user->createToken('main')->plainTextToken;
            Auth::login($user);
            return response(compact('user', 'token'));
            // login success
        }
        return response("false");
    }

    /**
     * @OA\Post(
     *     path="/register",
     *     summary="Register a new user",
     *     @OA\RequestBody(
     *         description="User registration data",
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="name",
     *                 type="string",
     *                 maxLength=255
     *             ),
     *             @OA\Property(
     *                 property="email",
     *                 type="string",
     *                 format="email",
     *                 maxLength=255
     *             ),
     *             @OA\Property(
     *                 property="password",
     *                 type="string",
     *                 minLength=8
     *             ),
     *             @OA\Property(
     *                 property="confirm_password",
     *                 type="string",
     *                 minLength=8
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="Registration successful",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="status",
     *                 type="boolean",
     *                 example=true
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response="default",
     *         description="Error response",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="status",
     *                 type="boolean",
     *                 example=false
     *             )
     *         )
     *     )
     * )
     */
    public function register(Request $request){
        
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = new User();
        $user->name = $request->input('name');
        $user->email = $request->input('email');
        $user->address = $request->input('address');
        $user->password = Hash::make($request->input('password'));
        $user->save();

        Auth::login($user);

        return response()->json(['status' => true], 200);
    }

/**
 * @OA\Post(
 *     path="/logout",
 *     summary="Logout the user",
 *     @OA\Response(
 *         response="200",
 *         description="Logout operation response",
 *         @OA\JsonContent(
 *             @OA\Property(
 *                 property="status",
 *                 type="boolean",
 *                 example=true
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response="default",
 *         description="Error response",
 *         @OA\JsonContent(
 *             @OA\Property(
 *                 property="status",
 *                 type="boolean",
 *                 example=false
 *             )
 *         )
 *     )
 * )
 */

    public function logout(Rquest $request){
        try{
            $user = $request->user();
            $user->currentAccessToken()->delete();
            return response()->json(['status' => true], 200);
        }catch (Exception $ex){
            return response()->json(['status' => false], 200);
        }
    }

}
