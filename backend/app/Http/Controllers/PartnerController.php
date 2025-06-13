<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Partner;

class PartnerController extends Controller
{
    public function displayAll(){
      $partners = Partner::all();
      return response()->json($partners);
    }
}
