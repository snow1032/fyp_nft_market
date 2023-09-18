<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Cloutier\PhpIpfsApi\IPFS;

class IPFSController extends Controller
{
    protected $ipfs;

    public function __construct()
    {
        $this->ipfs = new IPFS('localhost', '8080', '5001');
    }

    /**
     * @OA\Post(
     *     path="/upload",
     *     summary="Upload a file to ipfs server",
     *     @OA\RequestBody(
     *         required=true,
     *         description="Upload a file to ipfs server",
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"file"},
     *                 @OA\Property(
     *                     property="file",
     *                     description="Upload a file to ipfs server",
     *                     type="file",
     *                     format="binary"
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="File uploaded successfully",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="cid",
     *                 type="string",
     *                 description="The Content Identifier (CID) for the uploaded file"
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response="500",
     *         description="Failed to upload file",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="error",
     *                 type="string",
     *                 description="The error message indicating the failure to upload the file"
     *             )
     *         )
     *     )
     * )
     */
    public function uploadFile(Request $request)
    {
        $file = $request->file('file');
        $response = $this->ipfs->add(file_get_contents($file));
        
        if($response){
            return response()->json(['cid' => $response]);
        }
        return response()->json(['error' => 'Failed to upload file'], 500);
    }

}
