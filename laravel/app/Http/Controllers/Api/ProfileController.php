<?php

namespace App\Http\Controllers\Api;

use Storage;
use App\Http\Controllers\Controller;
use Illuminate\Support\Str;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\NftsToken;

class ProfileController extends Controller
{
    //

    public function uploadIcon(Request $request){
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:102400',
        ]);

        $user = $request->user();

        if ($request->hasFile('photo') && $user) {

            if($user->icon){
                Storage::delete('icon/'. $user->icon);
            }

            $file = $request->file('photo');
            $id = Str::uuid()->toString();

            $fileName = $id . '.' . $file->getClientOriginalExtension();
            $filePath = $file->storeAs('', $fileName, 'icon');
            $url = Storage::url($filePath);

            $user->icon = $fileName;
            $user->save();

            return response('OK');
        }
        return response('Error');

    }

    public function uploadBackdrop(Request $request){
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:102400',
        ]);

        $user = $request->user();

        if ($request->hasFile('photo') && $user) {
            if($user->backdrop){
                Storage::delete('backdrop/'. $user->backdrop);
            }
            $file = $request->file('photo');
            $id = Str::uuid()->toString();
            $fileName = $id . '.' . $file->getClientOriginalExtension();
            $filePath = $file->storeAs('', $fileName, 'backdrop');
            $url = Storage::url($filePath);
            $user->backdrop = $fileName;
            $user->save();

            return response('OK');
        }

        return response('Error');
    }

    public function getIcon(Request $request){
        $user = $request->user();
        $image_path = "";

        if($user->icon){
            $image_path = 'icon/' . $user->icon;
        }else{
            $image_path = 'icon/' . "default.png";
        }

        $file = Storage::get($image_path);
        $type = Storage::mimeType($image_path);
        $response = new Response($file, 200);
        $response->header('Content-Type', $type);
        return $response;
    }

    public function getBackdrop(Request $request){
        $user = $request->user();
        $image_path = "";

        if($user->backdrop){
            $image_path = 'backdrop/' . $user->backdrop;
        }else{
            $image_path = 'backdrop/' . "default.png";
        }
        $file = Storage::get($image_path);
        $type = Storage::mimeType($image_path);
        $response = new Response($file, 200);
        $response->header('Content-Type', $type);
        return $response;
    }


    public function getProfile(Request $request){
        $user = $request->user();
        $user_profile = User::find($user->id);

        return response()->json([
            'name' => $user_profile->name,
            'email' => $user_profile->email,
            'biography' => $user_profile->biography,
        ], 200);
    }

    public function getBoughtNFTs(Request $request){
        $user = $request->user();
        $boughtNFTs = NftsToken::where('owner', $user->id)->get();

        return $boughtNFTs;
    }
}
