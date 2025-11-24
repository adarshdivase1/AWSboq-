
import type { QuestionnaireSection } from '../types';

export const questionnaire: QuestionnaireSection[] = [
  {
    title: '1. Scope Definition',
    questions: [
      {
        id: 'requiredSystems',
        text: 'Which systems are required for this room? (Uncheck to exclude from BOQ)',
        type: 'multiple-choice',
        options: [
          { label: 'Display System', value: 'display' },
          { label: 'Video Conferencing System', value: 'video_conferencing' },
          { label: 'Audio System', value: 'audio' },
          { label: 'Connectivity & Control System', value: 'connectivity_control' },
          { label: 'Infrastructure (Racks, Mounts, Power, Network)', value: 'infrastructure' },
          { label: 'Acoustic Treatment', value: 'acoustics' },
        ],
      },
    ],
  },
  {
    title: '2. Room Fundamentals',
    questions: [
      {
        id: 'roomType',
        text: 'What is the primary function of this room?',
        type: 'select',
        options: [
          { label: 'Conference Room', value: 'conference' },
          { label: 'Huddle Room', value: 'huddle' },
          { label: 'Boardroom', value: 'boardroom' },
          { label: 'Classroom / Training Room', value: 'classroom' },
          { label: 'Divisible Room', value: 'divisible_room' },
          { label: 'Auditorium', value: 'auditorium' },
          { label: 'Town Hall / All-Hands Space', value: 'town_hall' },
          { label: 'Cafeteria / Multipurpose Space', value: 'cafeteria' },
          { label: 'Experience Center', value: 'experience_center' },
          { label: 'NOC / Command Center', value: 'noc' },
          { label: 'Executive Office', value: 'executive_office' },
          { label: 'Lobby / Digital Signage', value: 'lobby' },
        ],
      },
      { id: 'roomLength', text: 'Room Length (in feet)', type: 'number' },
      { id: 'roomWidth', text: 'Room Breadth/Width (in feet)', type: 'number' },
      { id: 'roomHeight', text: 'Room Height (in feet)', type: 'number' },
      { id: 'capacity', text: 'How many people will the room typically accommodate?', type: 'number' },
      { id: 'tableLength', text: 'What is the approximate length of the table (in feet)? (Crucial for cable runs)', type: 'number' },
      {
        id: 'seatingArrangement',
        text: 'What is the primary seating arrangement?',
        type: 'select',
        options: [
          { label: 'Long Boardroom/Rectangle Table', value: 'boardroom_long' },
          { label: 'U-Shape or V-Shape', value: 'u_shape' },
          { label: 'Classroom Style (Rows on flat floor)', value: 'classroom_rows_flat' },
          { label: 'Tiered Classroom Style (Rows on sloped floor)', value: 'classroom_rows_tiered' },
          { label: 'Theater/Auditorium Style (Raked/Elevated Seating)', value: 'auditorium_tiered' },
          { label: 'Cabaret Style (Round Tables on flat floor)', value: 'cabaret_rounds_flat' },
          { label: 'Tiered Cabaret Style (Round Tables on sloped floor)', value: 'cabaret_rounds_tiered' },
          { label: 'Flexible/Movable Furniture', value: 'flexible_furniture' },
          { label: 'Limited/No Seating (Open Space)', value: 'open_space' },
        ],
      },
       {
        id: 'naturalLightLevel',
        text: 'What is the level of natural/ambient light in the room?',
        type: 'select',
        options: [
          { label: 'Low (no windows or fully blacked out)', value: 'low' },
          { label: 'Medium (some windows with blinds/shades)', value: 'medium' },
          { label: 'High (large windows, significant daylight)', value: 'high' },
        ],
      },
    ],
  },
  {
    title: '3. Display & Playback Systems',
    questions: [
      {
        id: 'mainDisplayTechnology',
        text: 'What is the technology for the MAIN display(s)?',
        type: 'select',
        options: [
          { label: 'Single Large Format Display (LFD)', value: 'single_lfd' },
          { label: 'Dual Large Format Displays (LFDs)', value: 'dual_lfd' },
          { label: 'Single Projector and Screen', value: 'single_projector' },
          { label: 'Dual Projectors and Screens', value: 'dual_projector' },
          { label: 'Video Wall (specify config below)', value: 'video_wall' },
          { label: 'Direct View LED / Active LED', value: 'direct_view_led' },
        ],
      },
      {
        id: 'videoWallConfig',
        text: 'If Video Wall, specify configuration (e.g., 2x2, 3x3)',
        type: 'text',
      },
      {
        id: 'interactiveDisplay',
        text: 'Is an interactive/touch capability required for the main display?',
        type: 'select',
        options: [
          { label: 'Yes, interactive capability is essential', value: 'yes' },
          { label: 'No, a standard non-touch display is sufficient', value: 'no' },
        ],
      },
       {
        id: 'displayBrands',
        text: 'Any preferred MAIN display brands?',
        type: 'multiple-choice',
        options: [
          { label: 'Samsung', value: 'Samsung' },
          { label: 'LG', value: 'LG' },
          { label: 'Sony', value: 'Sony' },
          { label: 'BenQ', value: 'BenQ' },
          { label: 'ViewSonic', value: 'ViewSonic' },
          { label: 'Sharp', value: 'Sharp' },
          { label: 'Newline', value: 'Newline' },
          { label: 'NEC', value: 'NEC' },
          { label: 'Dell', value: 'Dell' },
          { label: 'DTEN', value: 'DTEN' },
          { label: 'AVOCOR', value: 'AVOCOR' },
          { label: 'Epson (Projectors)', value: 'Epson' },
          { label: 'Christie (Projectors)', value: 'Christie' },
          { label: 'Absen (Video Walls)', value: 'Absen' },
        ],
      },
      {
        id: 'secondaryDisplays',
        text: 'Are any secondary/supplemental displays needed?',
        type: 'multiple-choice',
        options: [
            { label: 'Confidence/Stage Monitors for Presenter', value: 'confidence_monitor' },
            { label: 'Repeater Displays (for long or wide rooms)', value: 'repeater_displays' },
            { label: 'Stage Lip / Front Row Displays', value: 'stage_lip_displays' },
            { label: 'Digital Signage / Information Displays in-room', value: 'digital_signage' },
        ],
      },
      {
        id: 'secondaryDisplayBrands',
        text: 'Any preferred SECONDARY display brands?',
        type: 'multiple-choice',
        options: [
          { label: 'Samsung', value: 'Samsung' },
          { label: 'LG', value: 'LG' },
          { label: 'Sony', value: 'Sony' },
          { label: 'ViewSonic', value: 'ViewSonic' },
          { label: 'NEC', value: 'NEC' },
          { label: 'Dell', value: 'Dell' },
        ],
      },
      {
        id: 'playbackSources',
        text: 'What media playback sources are needed?',
        type: 'multiple-choice',
        options: [
            { label: 'PC/Laptop Audio/Video', value: 'pc_laptop_playback' },
            { label: 'Dedicated Media Player (e.g., BrightSign)', value: 'media_player' },
            { label: 'Blu-ray Player', value: 'bluray_player' },
            { label: 'Wireless Streaming (Apple TV, Chromecast, etc.)', value: 'wireless_streaming_device' },
            { label: 'Bluetooth Audio Receiver', value: 'bluetooth_audio' },
        ],
      },
      {
        id: 'playbackSourceBrands',
        text: 'Any preferred playback source brands?',
        type: 'multiple-choice',
        options: [
          { label: 'Brightsign', value: 'Brightsign' },
          { label: 'Apple (Apple TV)', value: 'Apple' },
          { label: 'Google (Chromecast)', value: 'Google' },
          { label: 'Sony (Blu-ray)', value: 'Sony' },
          { label: 'Panasonic (Blu-ray)', value: 'Panasonic' },
        ],
      },
    ],
  },
  {
    title: '4. Video Conferencing',
    questions: [
      {
        id: 'conferencing',
        text: 'Will video conferencing be used in this room?',
        type: 'select',
        options: [
          { label: 'Yes, this is a primary function', value: 'primary_vc' },
          { label: 'Yes, but for occasional use', value: 'occasional_vc' },
          { label: 'No, this room is for local presentation only', value: 'no_vc' },
        ],
      },
      {
        id: 'vcArchitecture',
        text: 'What is the preferred system architecture?',
        type: 'select',
        options: [
          { label: 'All-in-One Solution (e.g., Video Bar with integrated camera, mics, speakers)', value: 'all_in_one' },
          { label: 'Component-Based System (Separate camera, mics, DSP, etc. for best performance)', value: 'component_based' },
        ],
      },
      {
        id: 'vcPlatform',
        text: 'What video conferencing platforms will be used?',
        type: 'multiple-choice',
        options: [
          { label: 'Bring Your Own Device (BYOD) - Users connect laptops', value: 'byod' },
          { label: 'Dedicated Room System (e.g., Microsoft Teams Room, Zoom Room)', value: 'dedicated_room_system' },
        ],
      },
      {
        id: 'vcBrands',
        text: 'Any preferred video conferencing system brands?',
        type: 'multiple-choice',
        options: [
            { label: 'Yealink', value: 'Yealink' },
            { label: 'Poly', value: 'Poly' },
            { label: 'Logitech', value: 'Logitech' },
            { label: 'Cisco', value: 'Cisco' },
            { label: 'Neat', value: 'Neat' },
            { label: 'Jabra', value: 'Jabra' },
            { label: 'MAXHUB', value: 'MAXHUB' },
            { label: 'Huddly', value: 'Huddly' },
            { label: 'DTEN', value: 'DTEN' },
            { label: 'Peoplelink', value: 'Peoplelink' },
            { label: 'Microsoft (Teams)', value: 'Microsoft' },
            { label: 'QSC', value: 'QSC' },
            { label: 'Liberty', value: 'Liberty' },
        ]
      },
      {
        id: 'cameraNeeds',
        text: 'What are the camera requirements for video conferencing?',
        type: 'select',
        options: [
          { label: 'Standard PTZ (Pan-Tilt-Zoom) camera', value: 'ptz_standard' },
          { label: 'Auto-framing / Speaker Tracking Camera', value: 'speaker_tracking' },
          { label: 'Multiple cameras for different views', value: 'multi_camera' },
          { label: 'No camera needed', value: 'no_camera' },
        ],
      },
    ],
  },
  {
    title: '5. Audio System',
    questions: [
      {
        id: 'microphoneType',
        text: 'What type of microphones are preferred for participants?',
        type: 'multiple-choice',
        options: [
          { label: 'Ceiling microphones (for a clean table)', value: 'ceiling_mics' },
          { label: 'Tabletop microphones (wired or wireless)', value: 'table_mics' },
          { label: 'Microphone integrated into a soundbar/video bar', value: 'bar_mics' },
          { label: 'Throwable Microphone (e.g., Catchbox)', value: 'throwable_mic' },
          { label: 'No microphones needed', value: 'no_mics' },
        ],
      },
      {
        id: 'presenterMicrophone',
        text: 'Does a presenter need a dedicated microphone?',
        type: 'multiple-choice',
        options: [
          { label: 'Yes, a wireless handheld microphone', value: 'wireless_handheld' },
          { label: 'Yes, a wireless lavalier/lapel microphone', value: 'wireless_lavalier' },
          { label: 'Yes, a microphone at a lectern', value: 'lectern_mic' },
          { label: 'No dedicated presenter mic needed', value: 'no_presenter_mic' },
        ],
      },
      {
        id: 'bgmPaSystem',
        text: 'Is a Background Music (BGM) and/or Public Address (PA) system required?',
        type: 'select',
        options: [
            { label: 'Not Required', value: 'none' },
            { label: 'Background Music (BGM) only', value: 'bgm_only' },
            { label: 'Public Address (PA) for announcements only', value: 'pa_only' },
            { label: 'Both BGM and PA are required', value: 'both' },
        ]
      },
      {
        id: 'speakerType',
        text: 'What type of speakers are preferred for the room?',
        type: 'multiple-choice',
        options: [
          { label: 'In-Ceiling Speakers (discreet, even coverage)', value: 'ceiling_speakers' },
          { label: 'Surface-Mount / On-Wall Speakers', value: 'wall_speakers' },
          { label: 'Soundbar (mounted with display)', value: 'soundbar' },
          { label: 'Pendant Speakers (for high/open ceilings)', value: 'pendant_speakers' },
          { label: 'Line Array Speakers (for large venues)', value: 'line_array' },
          { label: 'Integrated in Video Bar', value: 'bar_integrated_speakers' },
        ],
      },
      {
        id: 'audioZoningRequired',
        text: 'Is audio zoning required (separate volume control for different areas)?',
        type: 'select',
        options: [
          { label: 'No, a single audio zone is sufficient', value: 'no' },
          { label: 'Yes, multiple audio zones are needed', value: 'yes' },
        ]
      },
      {
        id: 'audioBrands',
        text: 'Any preferred audio brands (mics, speakers, DSPs)?',
        type: 'multiple-choice',
        options: [
            { label: 'Shure', value: 'Shure' },
            { label: 'Biamp', value: 'Biamp' },
            { label: 'QSC', value: 'QSC' },
            { label: 'Sennheiser', value: 'Sennheiser' },
            { label: 'JBL', value: 'JBL' },
            { label: 'Audio-Technica', value: 'Audio-Technica' },
            { label: 'Yamaha', value: 'Yamaha' },
            { label: 'Fohhn', value: 'Fohhn' },
            { label: 'BSS', value: 'BSS' },
            { label: 'Clearcom', value: 'Clearcom' },
            { label: 'Dali', value: 'Dali' },
            { label: 'Studio Master', value: 'Studio Master' },
            { label: 'Logic', value: 'Logic' },
            { label: 'Gigatronics', value: 'Gigatronics' },
        ]
      },
    ],
  },
  {
    title: '6. Connectivity & Control',
    questions: [
      {
        id: 'connectivity',
        text: 'How will users connect their devices to present?',
        type: 'multiple-choice',
        options: [
          { label: 'Wireless Presentation (e.g., Barco ClickShare, Crestron AirMedia)', value: 'wireless' },
          { label: 'Wired connections (specify locations and types below)', value: 'wired' },
        ],
      },
      {
        id: 'connectivityPoints',
        text: 'Where should wired connections be located?',
        type: 'multiple-choice',
        options: [
            { label: 'Tabletop Box (Cubby/Grommet)', value: 'tabletop_box' },
            { label: 'Floor Box', value: 'floor_box' },
            { label: 'Wall Plate', value: 'wall_plate' },
            { label: 'Lectern / Podium Plate', value: 'lectern_plate' },
        ],
      },
      {
        id: 'requiredWiredInputs',
        text: 'Which wired input ports are required in the room?',
        type: 'multiple-choice',
        options: [
            { label: 'HDMI Input', value: 'hdmi_input' },
            { label: 'USB-C (with video & power delivery)', value: 'usbc_video_power' },
            { label: 'USB-A (for peripherals)', value: 'usba_peripheral' },
            { label: 'DisplayPort Input', value: 'displayport_input' },
            { label: 'RJ-45 Network Jack', value: 'network_jack' },
            { label: 'AC Power Outlet', value: 'ac_power' },
        ],
      },
       {
        id: 'matrixSwitcherRequired',
        text: 'Is a dedicated matrix switcher required for complex routing?',
        type: 'select',
        options: [
          { label: 'Yes, a matrix switcher is necessary', value: 'yes' },
          { label: 'No, simple source selection is sufficient', value: 'no' },
        ],
      },
      {
        id: 'connectivityBrands',
        text: 'Any preferred connectivity or infrastructure brands?',
        type: 'multiple-choice',
        options: [
          { label: 'Crestron', value: 'Crestron' },
          { label: 'Extron', value: 'Extron' },
          { label: 'Lightware', value: 'Lightware' },
          { label: 'Kramer', value: 'Kramer' },
          { label: 'ATEN', value: 'ATEN' },
          { label: 'Barco (ClickShare)', value: 'Barco' },
          { label: 'Airtame', value: 'Airtame' },
          { label: 'Apple (AirPlay)', value: 'Apple' },
          { label: 'Inogeni', value: 'Inogeni' },
          { label: 'Magewell', value: 'Magewell' },
          { label: 'Atlona', value: 'Atlona' },
          { label: 'C2G', value: 'C2G' },
          { label: 'BlackBox', value: 'BlackBox' },
          { label: 'Belden', value: 'Belden' },
          { label: 'Panduit', value: 'Panduit' },
          { label: 'Liberty', value: 'Liberty' },
          { label: 'Brightsign', value: 'Brightsign' },
          { label: 'Gigatronics', value: 'Gigatronics' },
        ]
      },
      {
        id: 'controlSystem',
        text: 'How should the room AV system be controlled?',
        type: 'multiple-choice',
        options: [
          { label: 'Simple remote or auto-source switching', value: 'remote' },
          { label: 'Wall-mounted keypad for basic functions', value: 'keypad' },
          { label: 'Tabletop touch panel for full control', value: 'touch_panel' },
          { label: 'Control via PC/Software Interface', value: 'pc_software_control' },
          { label: 'Integration with Building Management System (BMS)', value: 'bms_integration' },
        ],
      },
      {
        id: 'controlBrands',
        text: 'Any preferred control system brands?',
        type: 'multiple-choice',
        options: [
            { label: 'Crestron', value: 'Crestron' },
            { label: 'Extron', value: 'Extron' },
            { label: 'AMX', value: 'AMX' },
            { label: 'Kramer', value: 'Kramer' },
            { label: 'QSC', value: 'QSC' },
            { label: 'CUE', value: 'CUE' },
            { label: 'Lutron', value: 'Lutron' },
        ]
      },
    ],
  },
  {
    title: '7. Infrastructure (Racks, Mounts, Power, Network)',
    questions: [
        {
            id: 'rackDistance',
            text: 'Distance from Display/Table to Rack (feet)? (Critical for signal extension)',
            type: 'number',
        },
        {
            id: 'wallConstruction',
            text: 'What is the primary wall construction material for mounting?',
            type: 'select',
            options: [
                { label: 'Standard Drywall / Gypsum', value: 'drywall' },
                { label: 'Concrete / Masonry', value: 'concrete' },
                { label: 'Glass Wall', value: 'glass' },
                { label: 'Architectural Wood/Panels', value: 'wood_panel' },
                { label: 'Not mounting on walls (e.g., using floor stands)', value: 'none' },
            ],
        },
        {
            id: 'wallReinforcement',
            text: 'Is the display wall reinforced (plywood backing)?',
            type: 'select',
            options: [
                { label: 'Yes, reinforced', value: 'yes' },
                { label: 'No, standard drywall (Requires toggles/backing)', value: 'no' },
                { label: 'Concrete/Block', value: 'concrete' },
                { label: 'Unknown', value: 'unknown' },
            ],
        },
        {
            id: 'ceilingConstruction',
            text: 'What is the ceiling construction type?',
            type: 'select',
            options: [
                { label: 'Acoustic Drop Tile (T-Bar Grid)', value: 'acoustic_drop_tile' },
                { label: 'Drywall / Gypsum Board', value: 'drywall' },
                { label: 'Open / Exposed Structure (Trusses, Concrete)', value: 'open_exposed' },
                { label: 'Wood / Architectural Ceiling', value: 'wood_architectural' },
            ],
        },
        {
            id: 'plenumRequirement',
            text: 'Is the ceiling space used for air return (Plenum)? (Requires fire-rated cables)',
            type: 'select',
            options: [
                { label: 'Yes, Plenum (CMP) rated cables are mandatory', value: 'plenum_required' },
                { label: 'No, standard (CMR) cables are acceptable', value: 'non_plenum' },
                { label: 'Unknown (Assume Plenum for safety)', value: 'unknown' },
            ],
        },
        {
            id: 'floorType',
            text: 'What is the floor construction (for floor box installation)?',
            type: 'select',
            options: [
                { label: 'Concrete Slab (Core drilling required)', value: 'concrete_floor' },
                { label: 'Raised Access Floor', value: 'raised_floor' },
                { label: 'Wood / Carpet on Wood', value: 'wood_floor' },
                { label: 'No floor boxes needed', value: 'na' },
            ],
        },
        {
            id: 'mainDisplayMountType',
            text: 'What type of mount is needed for the MAIN display?',
            type: 'select',
            options: [
                { label: 'Fixed / Low-Profile Wall Mount', value: 'fixed_wall' },
                { label: 'Tilting Wall Mount', value: 'tilting_wall' },
                { label: 'Articulating Arm Wall Mount', value: 'articulating_wall' },
                { label: 'Push-Pull / Serviceable Video Wall Mount', value: 'video_wall_mount_push_pull' },
                { label: 'Recessed In-Wall Mount', value: 'recessed_wall' },
                { label: 'Ceiling Mount', value: 'ceiling_mount' },
                { label: 'Mobile Cart / Floor Stand', value: 'mobile_cart' },
                { label: 'Glass Wall Mount', value: 'glass_mount' },
                { label: 'No specific mount needed (e.g., display has stand)', value: 'none' },
            ],
        },
        {
            id: 'secondaryDisplayMountType',
            text: 'What type of mount is needed for SECONDARY displays?',
            type: 'select',
            options: [
                { label: 'N/A - No secondary displays', value: 'na' },
                { label: 'Fixed / Low-Profile Wall Mount', value: 'fixed_wall' },
                { label: 'Ceiling Mount (Pole)', value: 'ceiling_mount_pole' },
                { label: 'Floor Stand (for confidence monitors)', value: 'floor_stand' },
                { label: 'Mobile Cart / Stand', value: 'mobile_cart' },
            ],
        },
        {
            id: 'rackRequired',
            text: 'Is an equipment rack required?',
            type: 'select',
            options: [
                { label: 'Yes, a full-size floor-standing rack (42U)', value: '42u_rack' },
                { label: 'Yes, a half-size floor-standing rack (24U)', value: '24u_rack' },
                { label: 'Yes, a small credenza or wall-mount rack (12U)', value: '12u_rack' },
                { label: 'No, equipment will be mounted behind display or in furniture', value: 'no_rack' },
            ],
        },
        {
            id: 'rackLocation',
            text: 'If a rack is required, where will it be located?',
            type: 'select',
            options: [
                { label: 'N/A - No rack needed', value: 'na' },
                { label: 'Inside the room (in a credenza or corner)', value: 'in_room' },
                { label: 'In a separate, dedicated AV closet / Rack Room', value: 'av_closet' },
            ],
        },
        {
          id: 'mountAndRackBrands',
          text: 'Are there any preferred Mount & Rack brands?',
          type: 'multiple-choice',
          options: [
            { label: 'Chief', value: 'Chief' },
            { label: 'Milestone', value: 'Milestone' },
            { label: 'B-Tech AV Mounts', value: 'B-Tech' },
            { label: 'Heckler Design', value: 'Heckler' },
            { label: 'LUMI', value: 'LUMI' },
            { label: 'Drita', value: 'Drita' },
            { label: 'Valrack', value: 'Valrack' },
            { label: 'Middle Atlantic', value: 'Middle Atlantic' },
            { label: 'Panduit', value: 'Panduit' },
            { label: 'Rittal', value: 'Rittal' },
            { label: 'APC', value: 'APC' },
            { label: 'Gigatronics', value: 'Gigatronics' },
          ]
        },
        {
            id: 'powerInfrastructure',
            text: 'What is the state of the power infrastructure?',
            type: 'select',
            options: [
                { label: 'Sufficient outlets at all key locations', value: 'sufficient' },
                { label: 'Power may need to be extended to some locations', value: 'extend_power' },
            ],
        },
        {
            id: 'upsRequirement',
            text: 'Is an Uninterruptible Power Supply (UPS) required for reliability?',
            type: 'select',
            options: [
                { label: 'No UPS required', value: 'none' },
                { label: 'Yes, for the main equipment rack', value: 'ups_for_rack' },
                { label: 'Yes, for the rack and main displays', value: 'ups_for_rack_and_displays' },
            ],
        },
        {
            id: 'networkInfrastructure',
            text: 'What is the state of the network infrastructure?',
            type: 'select',
            options: [
                { label: 'Dedicated network drops are available for AV', value: 'available' },
                { label: 'Network drops need to be coordinated with IT', value: 'coordinate' },
            ],
        },
    ]
  },
  {
    title: '8. Room Acoustics',
    questions: [
       {
        id: 'acousticNeeds',
        text: 'How would you describe the acoustic environment?',
        type: 'select',
        options: [
            { label: 'Good (minimal echo, quiet)', value: 'good' },
            { label: 'Standard (some echo, typical office noise)', value: 'standard' },
            { label: 'Poor (very echoey, noisy, hard surfaces)', value: 'poor' },
        ]
      },
      {
        id: 'acousticTreatmentType',
        text: 'What type of acoustic treatment is desired/required?',
        type: 'multiple-choice',
        options: [
            { label: 'Acoustic Wall Panels', value: 'wall_panels' },
            { label: 'Ceiling Baffles or Clouds', value: 'ceiling_baffles' },
            { label: 'Bass Traps (for corners)', value: 'bass_traps' },
            { label: 'Acoustic Carpet / Rugs', value: 'acoustic_flooring' },
        ],
      },
       {
        id: 'primaryNoiseSources',
        text: 'What are the primary sources of noise in or near the room?',
        type: 'multiple-choice',
        options: [
            { label: 'Loud HVAC system', value: 'hvac' },
            { label: 'Noise from adjacent rooms or hallways', value: 'adjacent_rooms' },
            { label: 'Exterior noise (traffic, etc.)', value: 'exterior_noise' },
            { label: 'In-room equipment noise (projectors, racks)', value: 'equipment_noise' },
        ],
      },
    ],
  },
  {
    title: '9. Lighting & Environment Control',
    questions: [
        {
          id: 'lightingControl',
          text: 'Is integrated control of the room\'s lighting required?',
          type: 'select',
          options: [
            { label: 'No, lighting is separate', value: 'no' },
            { label: 'Basic On/Off/Dimming Control', value: 'dimming' },
            { label: 'Full Integration (Scenes, Presets, etc.)', value: 'full_integration' },
          ],
        },
        {
            id: 'existingLightingFixtures',
            text: 'What type of lighting fixtures are installed?',
            type: 'select',
            options: [
              { label: 'Dimmable LED', value: 'dimmable_led' },
              { label: 'Non-Dimmable LED', value: 'nondimmable_led' },
              { label: 'Dimmable Fluorescent', value: 'dimmable_fluorescent' },
              { label: 'Non-Dimmable Fluorescent', value: 'nondimmable_fluorescent' },
              { label: 'Incandescent / Halogen', value: 'incandescent' },
              { label: 'Unknown / Other', value: 'unknown' },
            ],
        },
        {
            id: 'shadeControl',
            text: 'Is integrated control of window shades/blinds required?',
            type: 'select',
            options: [
                { label: 'No, shades are manual or not present', value: 'no' },
                { label: 'Yes, motorized shade control is required', value: 'yes' },
            ],
        },
    ],
  },
  {
    title: '10. Additional Features & Services',
    questions: [
        {
          id: 'roomScheduling',
          text: 'Is a room scheduling panel required outside the room?',
          type: 'select',
          options: [
            { label: 'Yes, a scheduling panel is needed', value: 'yes' },
            { label: 'No, not required', value: 'no' },
          ],
        },
        {
          id: 'lectureCapture',
          text: 'Is there a requirement to record or stream meetings?',
          type: 'select',
          options: [
            { label: 'Yes, recording and/or streaming is needed', value: 'yes' },
            { label: 'No, not required', value: 'no' },
          ],
        },
        {
          id: 'assistedListening',
          text: 'Is an Assisted Listening System (ALS) required for accessibility?',
          type: 'select',
          options: [
            { label: 'Yes, an ALS is required', value: 'yes' },
            { label: 'No, not required', value: 'no' },
          ],
        },
         {
          id: 'intercomSystemRequired',
          text: 'Is a production intercom system required?',
          type: 'select',
          options: [
            { label: 'No, not required', value: 'no' },
            { label: 'Yes, a production intercom is required', value: 'yes' },
          ],
        },
        {
          id: 'userTrainingRequired',
          text: 'Is formal user training required upon project completion?',
          type: 'select',
          options: [
            { label: 'No, a user guide/documentation is sufficient', value: 'no' },
            { label: 'Yes, a remote (video call) training session', value: 'remote_training' },
            { label: 'Yes, an on-site training session for users', value: 'onsite_training' },
          ],
        },
        { id: 'other', text: 'Are there any other specific requirements?', type: 'text' },
    ],
  },
];
