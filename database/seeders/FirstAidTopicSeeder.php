<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FirstAidTopicSeeder extends Seeder
{
    public function run()
    {
        $topics = [
            [
                'title' => 'Burns',
                'slug' => 'burns',
                'category' => 'burns',
                'description' => 'First aid for thermal burns, including fire, hot liquids, and contact burns.',
                'steps' => json_encode(['Stop the burning process', 'Cool the burn with running water for 20 minutes', 'Remove jewelry and tight clothing', 'Cover with sterile gauze', 'Seek medical attention for severe burns']),
                'dos' => json_encode(['Do cool the burn with running water', 'Do remove constrictive items', 'Do cover with clean cloth', 'Do seek medical help']),
                'donts' => json_encode(["Don't use ice", "Don't break blisters", "Don't apply creams", "Don't use cotton balls"]),
                'warning_signs' => 'Deep burns, burns on face/hands, difficulty breathing',
                'version' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Fractures',
                'slug' => 'fractures',
                'category' => 'fractures',
                'description' => 'First aid for broken bones and suspected fractures.',
                'steps' => json_encode(['Keep the person still', 'Immobilize the injured area', 'Apply cold pack wrapped in cloth', 'Splint if trained', 'Get medical help immediately']),
                'dos' => json_encode(['Do keep the person still', 'Do apply ice wrapped in cloth', 'Do treat for shock', 'Do seek medical attention']),
                'donts' => json_encode(["Don't try to straighten the bone", "Don't move unnecessarily", "Don't apply direct ice", "Don't give food or drink"]),
                'warning_signs' => 'Deformity, bone protruding, severe pain, swelling',
                'version' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Choking',
                'slug' => 'choking',
                'category' => 'choking',
                'description' => 'First aid for someone who is choking and cannot breathe.',
                'steps' => json_encode(['Ask "Are you choking?"', 'Encourage coughing', 'Perform abdominal thrusts (Heimlich)', 'Stand behind and wrap arms', 'Make fist above navel and pull inward']),
                'dos' => json_encode(['Do encourage coughing', 'Do perform abdominal thrusts', 'Do call for emergency help', 'Do perform CPR if unconscious']),
                'donts' => json_encode(["Don't perform thrusts on infants under 1", "Don't leave the person alone", "Don't give water or food"]),
                'warning_signs' => 'Cannot speak, cough, or breathe; clutching throat; blue/gray skin',
                'version' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Seizures',
                'slug' => 'seizures',
                'category' => 'seizures',
                'description' => 'First aid for epileptic seizures and convulsions.',
                'steps' => json_encode(['Stay calm and time the seizure', 'Clear the area of hard objects', 'Place something soft under the head', 'Turn the person gently onto their side', 'Stay with them until seizure ends']),
                'dos' => json_encode(['Do time the seizure', 'Do protect from injury', 'Do roll onto side', 'Do stay calm and reassure']),
                'donts' => json_encode(["Don't hold the person down", "Don't put anything in their mouth", "Don't give water or food", "Don't restrain movements"]),
                'warning_signs' => 'Seizure lasting more than 5 minutes, repeated seizures, breathing difficulty',
                'version' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Severe Bleeding',
                'slug' => 'severe-bleeding',
                'category' => 'bleeding',
                'description' => 'First aid for life-threatening bleeding from wounds.',
                'steps' => json_encode(['Put on gloves if available', 'Apply direct pressure with clean cloth', 'Elevate above heart if possible', 'Add more cloth if soaked through', 'Apply tourniquet only as last resort']),
                'dos' => json_encode(['Do apply firm direct pressure', 'Do elevate the injury', 'Do add more layers', 'Do call for emergency help']),
                'donts' => json_encode(["Don't remove blood-soaked cloths", "Don't apply tourniquet unless trained", "Don't probe the wound", "Don't give food or drink"]),
                'warning_signs' => 'Blood spurting, bleeding that won\'t stop, signs of shock',
                'version' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('first_aid_topics')->insert($topics);
    }
}