<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Place extends Model
{
    //
    protected $fillable=['place_name','mapX','mapY','use_yn'];
}
