import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { db, FirstAidTopic } from '../database/db';

// Real-world fallback data structure ensuring your system always has guides available
const FALLBACK_DATA: Record<string, Omit<FirstAidTopic, 'id'>> = {
    'burn': {
        title: 'Burn Injury Treatment',
        slug: 'burn',
        category: 'Thermal',
        description: 'First-line emergency care protocols for thermal burns to restrict depth tissue damage and alleviate acute pain.',
        warning_signs: 'Blistering, charred skin, white or leathery appearance, breathing difficulty if facial burn.',
        steps: [
            'Immediately stop the burning process. Move the patient away from the heat source or smother flames using a blanket.',
            'Cool the burn immediately under cool, gently running tap water for a minimum of 20 minutes. This dissipates retained skin heat.',
            'Carefully remove rings, watches, or tight clothing from the affected area before swelling sets in.',
            'Cover the cooled burn loosely with clean, sterile, non-adherent gauze or clean plastic cling wrap to prevent ambient infection.',
            'Keep the patient warm using blankets to minimize the systemic risk of thermal shock.'
        ],
        dos: [
            'Use only cool running water for cooling.',
            'Keep the patient warm while protecting the burn.',
            'Elevate burned limbs above heart level if possible to reduce swelling.'
        ],
        donts: [
            'NEVER apply ice, ice water, butter, oils, toothpaste, or traditional ointments to a fresh burn.',
            'NEVER pop, puncture, or interfere with skin blisters, as they act as a sterile barrier.',
            'NEVER attempt to peel away clothing that has melted and fused directly into the burn wound.'
        ]
    },
    'snake-bite': {
        title: 'Snake Bite Management',
        slug: 'snake-bite',
        category: 'Envenomation',
        description: 'Immediate stabilization protocol for venomous and non-venomous snake strikes to minimize systemic venom spread.',
        warning_signs: 'Paired puncture marks, rapid localized swelling, severe pain, nausea, dizziness, or difficulty breathing.',
        steps: [
            'Keep the patient calm, completely still, and reassured. Anxiety increases heart rate and speeds up venom circulation.',
            'Immobilize the affected limb using a splint or makeshift sling. Keep the limb positioned at or slightly below heart level.',
            'Remove tight clothing, rings, jewelry, or footwear near the bite area before rapid swelling begins.',
            'Clean the bite site gently with clean water or a damp cloth. Do not scrub or flush forcefully.',
            'Wrap a clean, broad bandage snugly above and over the bite site (Pressure Immobilization Technique), but not tight enough to stop arterial blood flow.'
        ],
        dos: [
            'Note the appearance of the snake if safe to do so.',
            'Keep the bitten limb completely immobilized.',
            'Seek immediate hospital emergency evacuation.'
        ],
        donts: [
            'NEVER cut or incise the bite site to extract venom.',
            'NEVER attempt to suck out the venom by mouth or mechanical suction devices.',
            'NEVER apply a tight arterial tourniquet or constricting bands.',
            'NEVER apply ice packs directly to the wound.'
        ]
    },
    'fracture': {
        title: 'Broken Bone / Fracture Stabilization',
        slug: 'fracture',
        category: 'Trauma',
        description: 'Stabilization strategies for closed or open bone fractures to protect surrounding nerves, muscles, and blood vessels.',
        warning_signs: 'Visible deformity, intense pain, inability to bear weight, localized swelling, or bone protrusion.',
        steps: [
            'Keep the patient stationary. Control any external bleeding by applying steady, direct pressure around the wound with a clean cloth.',
            'If the bone is protruding (open fracture), cover it gently with a sterile dressing. Do not attempt to push the bone back in.',
            'Immobilize the injured area. Apply rigid splints (rolled cardboard or wooden planks) above and below the fractured joint.',
            'Pad the splints softly with clothing or towels to reduce pressure points against the skin.'
        ],
        dos: [
            'Keep the limb completely still.',
            'Check for normal circulation below the injury area.',
            'Apply wrapped ice packs to reduce localized swelling.'
        ],
        donts: [
            'NEVER attempt to forcefully straighten, realign, or snap a deformed bone back into position.',
            'NEVER allow the patient to walk or bear weight on a suspected leg fracture.',
            'NEVER move the patient if a spinal or neck fracture is suspected.'
        ]
    },
    'choking': {
        title: 'Choking Airway Clearance',
        slug: 'choking',
        category: 'Respiratory',
        description: 'Urgent clearing maneuvers for total foreign body airway obstructions in conscious individuals.',
        warning_signs: 'Inability to speak, clutching the throat (universal choking sign), weak coughing, cyanosis (blue tint to lips/skin).',
        steps: [
            'Assess the airway: Ask the individual "Are you choking?" If they can speak or cough loudly, encourage them to keep coughing.',
            'If they cannot speak or breathe, position yourself slightly behind them to administer 5 sharp back blows between the shoulder blades using the heel of your hand.',
            'If the obstruction remains, perform 5 abdominal thrusts (Heimlich Maneuver): place a clenched fist just above the navel and pull sharply inward and upward.',
            'Alternate between 5 back blows and 5 abdominal thrusts continuously until the object is expelled.'
        ],
        dos: [
            'Encourage active coughing if the patient can still make sounds.',
            'Stand fully behind the patient for support during thrusts.'
        ],
        donts: [
            'NEVER perform abdominal thrusts on a choking infant under 1 year old.',
            'NEVER perform a blind finger sweep inside the throat, which can push the object deeper.'
        ]
    },
    'bleeding': {
        title: 'Severe Bleeding Control',
        slug: 'bleeding',
        category: 'Trauma',
        description: 'Immediate hemorrhage control techniques to mitigate severe blood loss and secondary shock.',
        warning_signs: 'Spurting or steady pouring of dark/bright red blood, cold or clammy skin, confusion, or rapid pulse.',
        steps: [
            'Expose the wound completely by pulling back or cutting away clothing to locate the exact source of bleeding.',
            'Apply firm, continuous, direct pressure over the wound using a sterile dressing, clean cloth, or your hand.',
            'Secure the dressing firmly in place with a roller bandage wrapped snug enough to maintain steady pressure.',
            'If blood structural saturation bleeds completely through the first dressing, do not remove it. Place a second dressing directly on top and keep applying pressure.'
        ],
        dos: [
            'Maintain continuous elevation of the wound above heart level.',
            'Apply direct pressure without checking the wound repeatedly.'
        ],
        donts: [
            'NEVER remove the base layer gauze once it sticks to the wound, as this rips away forming blood clots.',
            'NEVER wash out a deep, severely bleeding wound with tap water.'
        ]
    }
};

const FirstAidDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [topic, setTopic] = useState<FirstAidTopic | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTopic();
    }, [slug]);

    const loadTopic = async () => {
        if (!slug) return;
        setLoading(true);

        // Normalize slug for fallback matching (e.g. 'burns' -> 'burn')
        let cleanSlug = slug.toLowerCase().trim();
        if (cleanSlug.endsWith('s') && !FALLBACK_DATA[cleanSlug] && FALLBACK_DATA[cleanSlug.slice(0, -1)]) {
            cleanSlug = cleanSlug.slice(0, -1);
        }

        let found = await db.firstAidTopics.where('slug').equals(slug).first();

        // Treat a cached record with missing/empty steps as invalid, not just "missing"
        const isIncomplete = !found || !Array.isArray(found.steps) || found.steps.length === 0;

        if (isIncomplete && navigator.onLine) {
            try {
                const response = await fetch(`/api/v1/firstaid/${slug}`);
                if (response.ok) {
                    const data = await response.json();
                    await db.firstAidTopics.put(data); // put() upserts — safe even if id already exists
                    found = data;
                }
            } catch (error) {
                console.error('Failed to fetch first aid topic:', error);
            }
        }

        // Last-resort offline fallback if neither IndexedDB nor the API had this guide
        if ((!found || !Array.isArray(found.steps) || found.steps.length === 0) && FALLBACK_DATA[cleanSlug]) {
            found = {
                id: Math.floor(Math.random() * 1000) + 100,
                ...FALLBACK_DATA[cleanSlug]
            } as FirstAidTopic;
        }

        setTopic(found || null);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-danger"></div>
            </div>
        );
    }

    if (!topic) {
        return (
            <div className="container py-5 text-center">
                <h4>{t('firstaid.not_found')}</h4>
            </div>
        );
    }

    const steps = typeof topic.steps === 'string' ? JSON.parse(topic.steps) : topic.steps;
    const dos = typeof topic.dos === 'string' ? JSON.parse(topic.dos) : topic.dos;
    const donts = typeof topic.donts === 'string' ? JSON.parse(topic.donts) : topic.donts;

    return (
        <div className="container py-3 text-start">
            <button className="btn btn-link text-body mb-3 ps-0" onClick={() => navigate(-1)}>
                <i className="bi bi-arrow-left"></i> {t('common.back')}
            </button>

            <div className="d-flex align-items-center justify-content-between mb-2">
                <h1 className="text-danger mb-0 fw-bold">{topic.title}</h1>
                {topic.category && <span className="badge bg-secondary py-2 px-3">{topic.category}</span>}
            </div>

            <p className="lead text-body-secondary mb-4">{topic.description}</p>

            {topic.warning_signs && (
                <div className="alert alert-warning border-0 shadow-sm mb-4">
                    <strong><i className="bi bi-exclamation-triangle-fill me-2"></i>{t('firstaid.warning_signs')}:</strong> {topic.warning_signs}
                </div>
            )}

            <div className="card mb-4 shadow-sm border-0">
                <div className="card-header bg-danger text-white fw-bold py-3">
                    <i className="bi bi-list-ol me-2"></i>{t('firstaid.steps_title')}
                </div>
                <div className="card-body">
                    <ol className="mb-0 ps-3">
                        {steps?.map((step: string, i: number) => (
                            <li key={i} className="mb-2">{step}</li>
                        ))}
                    </ol>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 col-12 mb-4">
                    <div className="card border-success h-100 shadow-sm">
                        <div className="card-header bg-success text-white fw-bold">
                            <i className="bi bi-check-circle me-2"></i>{t('firstaid.dos_title')}
                        </div>
                        <div className="card-body">
                            <ul className="mb-0 ps-3">
                                {dos?.map((item: string, i: number) => (
                                    <li key={i} className="mb-2">{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-12 mb-4">
                    <div className="card border-danger h-100 shadow-sm">
                        <div className="card-header bg-danger text-white fw-bold">
                            <i className="bi bi-x-circle me-2"></i>{t('firstaid.donts_title')}
                        </div>
                        <div className="card-body">
                            <ul className="mb-0 ps-3">
                                {donts?.map((item: string, i: number) => (
                                    <li key={i} className="mb-2 text-danger fw-semibold">{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <button
                className="btn btn-danger w-100 py-3 mt-2 shadow-sm fw-bold"
                onClick={() => navigate('/incidents', { state: { newIncident: true, topicId: topic.id, topicTitle: topic.title } })}
            >
                <i className="bi bi-journal-plus me-2"></i>{t('firstaid.log_incident')}
            </button>
        </div>
    );
};

export default FirstAidDetailPage;