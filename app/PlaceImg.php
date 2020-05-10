<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PlaceImg extends Model
{  
    //
    protected $table = 'place_imgs';
    protected $fillable=['place_no','use_yn','report_no'];
}