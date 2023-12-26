<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NFTsToken extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'nfts_token';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'url', 'creator', 'owner', 'tokenID', 'price', 'royalties', 'description','cid',
    ];

    /**
     * Get the user who created the NFT.
     */
    public function creatorUser()
    {
        return $this->belongsTo(User::class, 'creator');
    }

    /**
     * Get the current owner of the NFT.
     */
    public function ownerUser()
    {
        return $this->belongsTo(User::class, 'owner');
    }
}

