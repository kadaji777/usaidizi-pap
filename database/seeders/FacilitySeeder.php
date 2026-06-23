<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FacilitySeeder extends Seeder
{
    public function run()
    {
        $facilities = [
            // Hospitals
            ['name' => 'Kajiado County Referral Hospital', 'type' => 'hospital', 'county' => 'Kajiado', 'sub_county' => 'Kajiado Central', 'landmark' => 'Near Kajiado CBD', 'phone' => '0709123456'],
            ['name' => 'Machakos Level 5 Hospital', 'type' => 'hospital', 'county' => 'Machakos', 'sub_county' => 'Machakos Town', 'landmark' => 'Machakos Town', 'phone' => '0709123461'],
            ['name' => 'Kitengela Sub-County Hospital', 'type' => 'hospital', 'county' => 'Kajiado', 'sub_county' => 'Kitengela', 'landmark' => 'Kitengela Town', 'phone' => '0709123460'],
            ['name' => 'Ngong Sub-County Hospital', 'type' => 'hospital', 'county' => 'Kajiado', 'sub_county' => 'Ngong', 'landmark' => 'Ngong Town', 'phone' => '0709123458'],
            ['name' => 'Kangundo Level 4 Hospital', 'type' => 'hospital', 'county' => 'Machakos', 'sub_county' => 'Kangundo', 'landmark' => 'Kangundo Town', 'phone' => '0709123462'],
            ['name' => 'Loitoktok Sub-County Hospital', 'type' => 'hospital', 'county' => 'Kajiado', 'sub_county' => 'Loitoktok', 'landmark' => 'Loitoktok Town', 'phone' => '0709123457'],
            ['name' => 'Matuu Level 4 Hospital', 'type' => 'hospital', 'county' => 'Machakos', 'sub_county' => 'Matuu', 'landmark' => 'Matuu Town', 'phone' => '0709123463'],
            // Police Stations
            ['name' => 'Kajiado Police Station', 'type' => 'police', 'county' => 'Kajiado', 'sub_county' => 'Kajiado Central', 'landmark' => 'Opposite Kajiado Stadium', 'phone' => '0709123466'],
            ['name' => 'Machakos Police Station', 'type' => 'police', 'county' => 'Machakos', 'sub_county' => 'Machakos Town', 'landmark' => 'Machakos CBD', 'phone' => '0709123471'],
            ['name' => 'Kitengela Police Station', 'type' => 'police', 'county' => 'Kajiado', 'sub_county' => 'Kitengela', 'landmark' => 'Kitengela Town Centre', 'phone' => '0709123467'],
            ['name' => 'Ngong Police Station', 'type' => 'police', 'county' => 'Kajiado', 'sub_county' => 'Ngong', 'landmark' => 'Ngong Town', 'phone' => '0709123468'],
            ['name' => 'Kangundo Police Station', 'type' => 'police', 'county' => 'Machakos', 'sub_county' => 'Kangundo', 'landmark' => 'Kangundo Town', 'phone' => '0709123472'],
            // Pharmacies
            ['name' => 'Kajiado Central Pharmacy', 'type' => 'pharmacy', 'county' => 'Kajiado', 'sub_county' => 'Kajiado Central', 'landmark' => 'Near Kajiado Hospital', 'phone' => '0709123476'],
            ['name' => 'Machakos Pharmacy', 'type' => 'pharmacy', 'county' => 'Machakos', 'sub_county' => 'Machakos Town', 'landmark' => 'Opposite Machakos Bus Park', 'phone' => '0709123481'],
            ['name' => 'Kitengela Pharmacy', 'type' => 'pharmacy', 'county' => 'Kajiado', 'sub_county' => 'Kitengela', 'landmark' => 'Kitengela Mall', 'phone' => '0709123477'],
            ['name' => 'Ngong Pharmacy', 'type' => 'pharmacy', 'county' => 'Kajiado', 'sub_county' => 'Ngong', 'landmark' => 'Ngong Town', 'phone' => '0709123478'],
            ['name' => 'Kangundo Pharmacy', 'type' => 'pharmacy', 'county' => 'Machakos', 'sub_county' => 'Kangundo', 'landmark' => 'Kangundo Town', 'phone' => '0709123482'],
        ];

        DB::table('facilities')->insert($facilities);
    }
}