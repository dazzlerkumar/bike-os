export type ItemState = "unanswered" | "ok" | "issue" | "na";
export type IssueSeverity =
  | "cosmetic"
  | "fix_before_delivery"
  | "get_in_writing";
export type ItemType = "check" | "number_entry" | "photo_suggested";

export interface BikeSetup {
  drive: "chain" | "belt" | "shaft" | "all";
  brakes: "abs" | "cbs" | "neither" | "all";
  tyres: "tubeless" | "tube" | "all";
  cooling: "air" | "oil" | "liquid" | "all";
  start: "electric_only" | "electric_kick" | "all";
  fuelSystem: "carburettor" | "fuel_injection" | "all";
}

export const defaultBikeSetup: BikeSetup = {
  drive: "all",
  brakes: "all",
  tyres: "all",
  cooling: "all",
  start: "all",
  fuelSystem: "all",
};

export interface AppliesToRule {
  drive?: Array<"chain" | "belt" | "shaft">;
  brakes?: Array<"abs" | "cbs" | "neither">;
  tyres?: Array<"tubeless" | "tube">;
  cooling?: Array<"air" | "oil" | "liquid">;
  start?: Array<"electric_only" | "electric_kick">;
  fuelSystem?: Array<"carburettor" | "fuel_injection">;
}

export interface ChecklistItemDef {
  id: string;
  zoneId: string;
  order: number;
  label: string;
  hint: string;
  type: ItemType;
  inputPlaceholder?: string;
  inputUnit?: string;
  appliesTo?: AppliesToRule;
  defaultSeverity?: IssueSeverity;
  dealerHint?: string;
}

export function itemAppliesToSetup(
  item: ChecklistItemDef,
  setup: BikeSetup,
): boolean {
  if (!item.appliesTo) return true;
  const rule = item.appliesTo;
  if (
    rule.drive &&
    setup.drive !== "all" &&
    !rule.drive.includes(setup.drive)
  ) {
    return false;
  }
  if (
    rule.brakes &&
    setup.brakes !== "all" &&
    !rule.brakes.includes(setup.brakes)
  ) {
    return false;
  }
  if (
    rule.tyres &&
    setup.tyres !== "all" &&
    !rule.tyres.includes(setup.tyres)
  ) {
    return false;
  }
  if (
    rule.cooling &&
    setup.cooling !== "all" &&
    !rule.cooling.includes(setup.cooling)
  ) {
    return false;
  }
  if (
    rule.start &&
    setup.start !== "all" &&
    !rule.start.includes(setup.start)
  ) {
    return false;
  }
  if (
    rule.fuelSystem &&
    setup.fuelSystem !== "all" &&
    !rule.fuelSystem.includes(setup.fuelSystem)
  ) {
    return false;
  }
  return true;
}

export interface ZoneDef {
  id: string;
  order: number;
  title: string;
  shortTitle: string;
  description: string;
  items: ChecklistItemDef[];
}

export interface PhotoItem {
  id: string;
  dataUrl: string;
  timestamp: number;
}

export interface ItemAnswer {
  state: ItemState;
  value?: string;
  note?: string;
  severity?: IssueSeverity;
  photos: PhotoItem[];
  updatedAt: number;
}

export interface InspectionRecord {
  id: string;
  createdAt: number;
  updatedAt: number;
  closedAt?: number;
  bikeModel?: string;
  dealerName?: string;
  setup: BikeSetup;
  answers: Record<string, ItemAnswer>;
}

export const PDI_ZONES: ZoneDef[] = [
  {
    id: "paperwork",
    order: 1,
    title: "Paperwork & Identity",
    shortTitle: "Paperwork",
    description:
      "Verify vehicle identification numbers, legal insurance, and delivery documents before physical inspection.",
    items: [
      {
        id: "paperwork-chassis",
        zoneId: "paperwork",
        order: 1,
        label: "Chassis / VIN matches invoice and insurance",
        hint: "Inspect stamping on headstock/frame. Verify every letter and digit exactly matches tax invoice and insurance cover note.",
        type: "number_entry",
        inputPlaceholder: "Enter 17-digit chassis VIN",
        defaultSeverity: "fix_before_delivery",
        dealerHint:
          "Do not accept delivery until VIN mismatch is resolved in writing on official letterhead.",
      },
      {
        id: "paperwork-engine",
        zoneId: "paperwork",
        order: 2,
        label: "Engine number matches papers",
        hint: "Find engine stamp near crankcase. Match against registration papers and dealer invoice.",
        type: "number_entry",
        inputPlaceholder: "Enter engine serial number",
        defaultSeverity: "fix_before_delivery",
        dealerHint:
          "Have dealer inspect and re-issue documentation if digits differ.",
      },
      {
        id: "paperwork-insurance",
        zoneId: "paperwork",
        order: 3,
        label: "Insurance active, start date and cover correct",
        hint: "Ensure policy starts from delivery day, covers third-party and own damage, and nominee details are correct.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
        dealerHint:
          "Request active policy receipt with valid cover-note ID before riding out.",
      },
      {
        id: "paperwork-registration",
        zoneId: "paperwork",
        order: 4,
        label: "Registration or temporary receipt in hand",
        hint: "Verify road tax receipt, temporary registration certificate, and ask expected date for permanent RC card.",
        type: "check",
        defaultSeverity: "get_in_writing",
        dealerHint: "Ask for expected permanent RC date in writing.",
      },
      {
        id: "paperwork-manual-warranty",
        zoneId: "paperwork",
        order: 5,
        label: "Owner's manual, service book, warranty card with dealer stamp",
        hint: "Confirm dealer PDI stamp, battery warranty card, and free service coupons are intact in the booklet.",
        type: "check",
        defaultSeverity: "get_in_writing",
        dealerHint:
          "Ensure the dealer stamp and handover date are stamped in the service booklet.",
      },
      {
        id: "paperwork-keys",
        zoneId: "paperwork",
        order: 6,
        label: "Two original keys and key tag / code card",
        hint: "Check that both keys turn smoothly in ignition, fuel cap, and seat lock. Note down the small aluminium key code tag.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
        dealerHint:
          "Dealers must provide two coded keys. Request duplicate if second key is missing.",
      },
      {
        id: "paperwork-bill",
        zoneId: "paperwork",
        order: 7,
        label: "Itemised final bill, no unexplained charges",
        hint: "Verify ex-showroom price, RTO taxes, and insurance. Accessories and handling fees must be clearly itemised.",
        type: "check",
        defaultSeverity: "get_in_writing",
        dealerHint: "Question any non-standard handling or logistic surcharge.",
      },
    ],
  },
  {
    id: "front",
    order: 2,
    title: "Front Section",
    shortTitle: "Front",
    description:
      "Inspect front wheel, tyre manufacture date, suspension fork, brake assembly, and lights.",
    items: [
      {
        id: "front-headlight",
        zoneId: "front",
        order: 1,
        label: "Headlight low and high beam & pass switch",
        hint: "Test low beam, high beam, passing flash, and LED daytime running lights (DRL). Check clear beam cutoff.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "front-indicators",
        zoneId: "front",
        order: 2,
        label: "Front indicators and hazard flashers",
        hint: "Test left and right turn blinkers and hazard button. Check indicators are mounted tightly with undamaged lenses.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "front-tyre-pressure",
        zoneId: "front",
        order: 3,
        label: "Front tyre pressure matches specification",
        hint: "Showrooms frequently over-inflate tyres for shipping. Cold spec is usually 25 to 32 psi.",
        type: "number_entry",
        inputPlaceholder: "e.g. 29",
        inputUnit: "psi",
      },
      {
        id: "front-tyre-age",
        zoneId: "front",
        order: 4,
        label: "Front tyre manufacture date (DOT code)",
        hint: "Find the 4-digit oval DOT stamp on the sidewall (e.g. '2426' means 24th week of 2026). Tyre should not be older than 6 months.",
        type: "number_entry",
        inputPlaceholder: "WWYY (e.g. 2026)",
        defaultSeverity: "get_in_writing",
        dealerHint: "Tyres older than 9 months should be replaced by dealer.",
      },
      {
        id: "front-tyre-condition",
        zoneId: "front",
        order: 5,
        label: "No cuts, bulges or flat spots on front tyre",
        hint: "Check tyre tread, sidewalls, and bead seating. Ensure no transit tie-down flat spots or cracks.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "front-brake-lever",
        zoneId: "front",
        order: 6,
        label: "Front brake lever feels firm and returns quickly",
        hint: "Lever should have firm resistance with no sponginess and return instantly to resting position without sticking.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
        dealerHint:
          "Spongy levers indicate air in the brake line; demand bleeding before taking delivery.",
      },
      {
        id: "front-brake-fluid",
        zoneId: "front",
        order: 7,
        label: "Front brake fluid level and clarity",
        hint: "Inspect handlebar master cylinder sight glass. Fluid must be golden-amber and between MIN and MAX marks.",
        type: "check",
        appliesTo: { brakes: ["abs", "cbs"] },
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "front-fork-stanchions",
        zoneId: "front",
        order: 8,
        label: "Front fork chrome stanchions have no oil residue",
        hint: "Pump the front suspension vigorously against the front brake. Chrome legs must remain completely dry with no ring of oil.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
        dealerHint:
          "Fork seal leak must be replaced immediately before handover.",
      },
      {
        id: "front-wheel-spin",
        zoneId: "front",
        order: 9,
        label: "Front wheel spins freely and runs true",
        hint: "With front wheel off the ground on main stand, spin wheel. Rim must run straight without wobble or caliper binding.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
    ],
  },
  {
    id: "left-side",
    order: 3,
    title: "Left Side",
    shortTitle: "Left",
    description:
      "Check left body panels, mirror, side stand sensor, battery box, and drivetrain.",
    items: [
      {
        id: "left-paint-panels",
        zoneId: "left-side",
        order: 1,
        label: "Left body panels and tank free of scratches and dents",
        hint: "Crouch and inspect paint under daylight. Look for hairline scratches, clearcoat swirls, paint drips, or tie-down chafing.",
        type: "photo_suggested",
        defaultSeverity: "cosmetic",
        dealerHint: "Request panel replacement or buffing before signing.",
      },
      {
        id: "left-panel-gaps",
        zoneId: "left-side",
        order: 2,
        label: "Left panel gaps even, no loose plastic cladding",
        hint: "Press gently along panel edges. Joints must be flush without rattling tabs or missing fasteners.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "left-mirror-footpeg",
        zoneId: "left-side",
        order: 3,
        label: "Left mirror, rider footpeg and grab rail tight",
        hint: "Ensure mirror stalk ball joint is snug. Footpeg should fold smoothly with spring return.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "left-side-stand",
        zoneId: "left-side",
        order: 4,
        label: "Side stand and engine cut-off sensor work",
        hint: "Side stand should pivot cleanly. Sensor should prevent starter or cut engine when deployed in gear.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "left-battery-terminals",
        zoneId: "left-side",
        order: 5,
        label: "Battery terminals secure, no acid residue",
        hint: "Check battery enclosure if accessible. Terminals should be tight, corrosion-free, and protected by rubber boot.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "left-chain-drive",
        zoneId: "left-side",
        order: 6,
        label: "Drive chain tension and lubrication",
        hint: "Mid-span chain slack should measure 20 to 30 mm. Chain should be clean and coated with fresh lubricant, free of rust.",
        type: "check",
        appliesTo: { drive: ["chain"] },
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "left-belt-shaft",
        zoneId: "left-side",
        order: 7,
        label: "Drive belt or shaft housing condition",
        hint: "Inspect drive belt teeth for cracks and alignment, or shaft drive bevel box for oil weeping.",
        type: "check",
        appliesTo: { drive: ["belt", "shaft"] },
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "left-rear-shock",
        zoneId: "left-side",
        order: 8,
        label: "Left rear suspension damper has no oil mist",
        hint: "Inspect rear shock spring and damper body for wet oil streaks or damaged rubber bushings.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
    ],
  },
  {
    id: "engine-fluids",
    order: 4,
    title: "Engine & Fluids",
    shortTitle: "Engine",
    description:
      "Verify engine oil, coolant levels, cold start behaviour, idle sound, and exhaust.",
    items: [
      {
        id: "engine-oil-level",
        zoneId: "engine-fluids",
        order: 1,
        label: "Engine oil level at upper mark and clean",
        hint: "With bike upright on level ground, check sight glass or dipstick. Oil should be translucent amber and reach upper line.",
        type: "number_entry",
        inputPlaceholder: "Level: at MAX / Mid / Low",
        defaultSeverity: "fix_before_delivery",
        dealerHint:
          "Top-up with OEM manufacturer recommended oil before running.",
      },
      {
        id: "engine-coolant",
        zoneId: "engine-fluids",
        order: 2,
        label: "Coolant level between MIN and MAX marks",
        hint: "Check translucent expansion bottle. Coolant should be cleanly visible between the indicator lines with no foam.",
        type: "check",
        appliesTo: { cooling: ["liquid"] },
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "engine-leaks",
        zoneId: "engine-fluids",
        order: 3,
        label: "No fluid leaks under crankcase or sump",
        hint: "Examine engine underbelly, drain plug, and oil filter gasket. Ground under bike must be bone dry.",
        type: "photo_suggested",
        defaultSeverity: "fix_before_delivery",
        dealerHint:
          "Any crankcase oil leak must be rectified before taking delivery.",
      },
      {
        id: "engine-cold-start",
        zoneId: "engine-fluids",
        order: 4,
        label: "Cold start fires up cleanly without throttle",
        hint: "Engine should crank cleanly and start on the first push without cranking prolonged starter motor.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "engine-kick-start",
        zoneId: "engine-fluids",
        order: 5,
        label: "Kick starter engages and springs back",
        hint: "Kick pedal should rotate smoothly, provide solid compression resistance, and return quickly without jamming.",
        type: "check",
        appliesTo: { start: ["electric_kick"] },
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "engine-idle",
        zoneId: "engine-fluids",
        order: 6,
        label: "Idle RPM is steady without abnormal mechanical noise",
        hint: "Listen close to the engine block. No metallic ticking, piston slap, or rattling cam chain at idle.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "engine-exhaust",
        zoneId: "engine-fluids",
        order: 7,
        label: "Exhaust headers tight, no white or blue smoke",
        hint: "Check exhaust flange bolts. Brief condensation vapor is normal when cold; blue or thick white smoke indicates trouble.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "engine-air-filter",
        zoneId: "engine-fluids",
        order: 8,
        label: "Air filter housing sealed and secure",
        hint: "Airbox cover seated properly with all rubber intake snorkel connections fastened.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
    ],
  },
  {
    id: "rear",
    order: 5,
    title: "Rear Section",
    shortTitle: "Rear",
    description:
      "Check rear tyre DOT, pressure, tail lamp, brake lights, and rear wheel alignment.",
    items: [
      {
        id: "rear-tail-brake",
        zoneId: "rear",
        order: 1,
        label: "Tail lamp and brake light activate from both levers",
        hint: "Tail lamp illuminates with ignition. Test brake light separately using front hand brake and rear foot brake.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "rear-indicators",
        zoneId: "rear",
        order: 2,
        label: "Rear indicators and license plate illuminator",
        hint: "Check left and right rear blinkers and white license plate lamp. Inspect tail tidy for solid mounting.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "rear-tyre-pressure",
        zoneId: "rear",
        order: 3,
        label: "Rear tyre pressure matches manual",
        hint: "Measure cold rear pressure. Standard spec is usually 32 to 36 psi (or up to 41 psi for pillion riding).",
        type: "number_entry",
        inputPlaceholder: "e.g. 33",
        inputUnit: "psi",
      },
      {
        id: "rear-tyre-age",
        zoneId: "rear",
        order: 4,
        label: "Rear tyre manufacture date (DOT code)",
        hint: "Inspect 4-digit date code on tyre sidewall. Both front and rear tyres should have matching production age.",
        type: "number_entry",
        inputPlaceholder: "WWYY (e.g. 2026)",
        defaultSeverity: "get_in_writing",
      },
      {
        id: "rear-brake",
        zoneId: "rear",
        order: 5,
        label: "Rear brake pedal free play and progressive bite",
        hint: "Rear pedal should have 15 to 20 mm free travel before applying progressive stopping pressure.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "rear-wheel-spin",
        zoneId: "rear",
        order: 6,
        label: "Rear wheel spins freely with no caliper drag",
        hint: "In neutral on centre stand, spin rear wheel. Wheel should rotate smoothly without brake pad friction locking.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
    ],
  },
  {
    id: "right-side",
    order: 6,
    title: "Right Side",
    shortTitle: "Right",
    description:
      "Inspect right bodywork, exhaust shield, rear brake fluid reservoir, and foot controls.",
    items: [
      {
        id: "right-paint-panels",
        zoneId: "right-side",
        order: 1,
        label: "Right side panels, tank, and silencer free of blemishes",
        hint: "Check right fairings, exhaust canister surface, and engine clutch cover for scratches or scrapes.",
        type: "photo_suggested",
        defaultSeverity: "cosmetic",
        dealerHint: "Note any clearcoat scratch on the delivery register.",
      },
      {
        id: "right-exhaust-shield",
        zoneId: "right-side",
        order: 2,
        label: "Exhaust heat shield firmly mounted",
        hint: "Gently wiggle chrome or matte silencer shield. Rubber grommets and mounting bolts must not rattle.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "right-footpeg-controls",
        zoneId: "right-side",
        order: 3,
        label: "Right footpeg and rear brake pedal assembly tight",
        hint: "Check footpeg bracket bolts and rear master cylinder pushrod linkage locknut.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "right-rear-brake-fluid",
        zoneId: "right-side",
        order: 4,
        label: "Rear brake fluid reservoir level in range",
        hint: "Inspect rear brake fluid cup near swingarm pivot. Fluid level should be between LOWER and UPPER marks.",
        type: "check",
        appliesTo: { brakes: ["abs", "cbs"] },
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "right-pillion-pegs",
        zoneId: "right-side",
        order: 5,
        label: "Pillion footrests and exhaust clearance",
        hint: "Test passenger footrest detents. Ensure right peg does not foul against exhaust muffler when folded down.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
    ],
  },
  {
    id: "controls-cockpit",
    order: 7,
    title: "Controls & Cockpit",
    shortTitle: "Cockpit",
    description:
      "Verify instrument cluster self-test, odometer reading, throttle return, clutch action, and locks.",
    items: [
      {
        id: "controls-cluster-lights",
        zoneId: "controls-cockpit",
        order: 1,
        label: "Cluster boot sequence clear, no persistent warning icons",
        hint: "Turn ignition ON. Cluster needles/LCD should complete sweep. Check engine and oil warning icons must extinguish after start.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
        dealerHint:
          "Any engine check warning lamp requires OBD diagnostic scan before handover.",
      },
      {
        id: "controls-odometer-reading",
        zoneId: "controls-cockpit",
        order: 2,
        label: "Odometer baseline reading recorded",
        hint: "Record the starting mileage on the instrument display for your vehicle logbook.",
        type: "number_entry",
        inputPlaceholder: "e.g. 5",
        inputUnit: "km",
      },
      {
        id: "controls-odometer-limit",
        zoneId: "controls-cockpit",
        order: 3,
        label: "Odometer reading is minimal (under 15 km)",
        hint: "Factory testing and transit mileage is usually 1 to 15 km. If odometer exceeds 25 km, ask for explanation.",
        type: "check",
        defaultSeverity: "get_in_writing",
        dealerHint:
          "If reading exceeds 25 km, demand written justification from dealer.",
      },
      {
        id: "controls-throttle",
        zoneId: "controls-cockpit",
        order: 4,
        label: "Throttle snaps back freely at full handlebar lock",
        hint: "Turn handlebars to full left and full right locks; twist and release throttle. Grip must snap back sharply without binding.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
        dealerHint:
          "Sticky throttle is a severe safety hazard; must be corrected immediately.",
      },
      {
        id: "controls-clutch",
        zoneId: "controls-cockpit",
        order: 5,
        label: "Clutch lever free play and smooth cable travel",
        hint: "Clutch lever should have 10 to 15 mm free play before resistance. Lever should feel smooth throughout travel.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "controls-horn",
        zoneId: "controls-cockpit",
        order: 6,
        label: "Horn operates loud and crisp",
        hint: "Press horn button with engine off and idling; sound must be clear and unobstructed.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "controls-switches",
        zoneId: "controls-cockpit",
        order: 7,
        label: "All handlebar switches click with positive tactile detent",
        hint: "Test engine kill switch, turn indicator push-cancel button, and menu toggle buttons.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "controls-locks",
        zoneId: "controls-cockpit",
        order: 8,
        label: "Handlebar steering lock, fuel cap, and seat lock work",
        hint: "Test key in steering lock, open and close fuel lid, and unlock seat. Seat should latch shut with a positive click.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "controls-charging-port",
        zoneId: "controls-cockpit",
        order: 9,
        label: "USB socket or 12V power port charges phone",
        hint: "Connect your phone charging cable to verify 5V power output.",
        type: "check",
        defaultSeverity: "get_in_writing",
      },
    ],
  },
  {
    id: "fuel-extras",
    order: 8,
    title: "Fuel & Extras",
    shortTitle: "Extras",
    description:
      "Check fuel supply, emergency toolkit, medical pouch, accessories, and warranty coupons.",
    items: [
      {
        id: "fuel-level",
        zoneId: "fuel-extras",
        order: 1,
        label: "Enough fuel in tank to safely reach a fuel station",
        hint: "Showrooms provide 1 to 2 litres. Confirm fuel gauge leaves enough range to reach the nearest petrol station.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
        dealerHint:
          "Ask dealer to add emergency fuel if low fuel indicator flashes.",
      },
      {
        id: "fuel-toolkit",
        zoneId: "fuel-extras",
        order: 2,
        label: "Tool kit and first aid kit present under seat",
        hint: "Verify OEM tool pouch (spark plug spanner, screwdriver) and factory medical kit are under the seat.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "fuel-accessories",
        zoneId: "fuel-extras",
        order: 3,
        label: "Paid accessories installed and match final invoice",
        hint: "Check crash guards, bash plate, seat cover, visor, and pannier mounts match the bill specifications.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "fuel-free-service",
        zoneId: "fuel-extras",
        order: 4,
        label: "First free service date and kilometre threshold noted",
        hint: "Record 1st service window (typically 500-750 km or 30-45 days) to avoid voiding warranty.",
        type: "number_entry",
        inputPlaceholder: "e.g. 750 km / 30 days",
      },
      {
        id: "fuel-freebies",
        zoneId: "fuel-extras",
        order: 5,
        label: "Promised helmet and delivery goodies delivered",
        hint: "Verify delivery of ISI-certified helmet, complimentary bike cover, or gift vouchers promised at booking.",
        type: "check",
        defaultSeverity: "get_in_writing",
      },
    ],
  },
  {
    id: "test-ride",
    order: 9,
    title: "Test Ride (Dynamic)",
    shortTitle: "Test Ride",
    description:
      "Verify on-road alignment, clutch engagement, gear shifts, braking performance, and ABS light cut-off.",
    items: [
      {
        id: "ride-alignment",
        zoneId: "test-ride",
        order: 1,
        label: "Bike tracks straight with no pulling to left or right",
        hint: "On flat pavement at 20 km/h, ease your grip on the handlebars; motorcycle should hold a straight line.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
        dealerHint:
          "Pulling indicates misalignment of forks or rear axle chain adjusters.",
      },
      {
        id: "ride-vibration",
        zoneId: "test-ride",
        order: 2,
        label: "No abnormal vibration or front-end wobble at 30-40 km/h",
        hint: "Ride at steady 30-40 km/h in 3rd gear. Check for handlebar buzz or rim wobble.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "ride-transmission",
        zoneId: "test-ride",
        order: 3,
        label: "Clutch bites smoothly and gears shift cleanly",
        hint: "Gear shift lever clicks cleanly up and down; finding neutral when stationary is effortless.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "ride-brakes",
        zoneId: "test-ride",
        order: 4,
        label: "Brakes stop smoothly without squeal or pulsation",
        hint: "Apply front and rear brakes progressively. No brake shudder, scraping sounds, or disc pulsing.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "ride-warm-idle",
        zoneId: "test-ride",
        order: 5,
        label: "Engine idle is steady after warm-up without stalling",
        hint: "After 2 minutes of riding, bring bike to a stop. Engine should settle smoothly at ~1300-1500 RPM.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "ride-cluster-check",
        zoneId: "test-ride",
        order: 6,
        label: "ABS light turns off above 5 km/h; no warning lights",
        hint: "ABS indicator lamp should extinguish as soon as bike accelerates past walking pace.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
      {
        id: "ride-sidestand-cutoff",
        zoneId: "test-ride",
        order: 7,
        label: "Side-stand cut-off kills engine when placed in gear",
        hint: "With engine running and side-stand down, pull clutch and tap into 1st gear; engine must cut immediately.",
        type: "check",
        defaultSeverity: "fix_before_delivery",
      },
    ],
  },
  {
    id: "handover",
    order: 10,
    title: "Final Handover",
    shortTitle: "Handover",
    description:
      "Capture delivery baseline photos, save dealer emergency contact numbers, and record signed commitments.",
    items: [
      {
        id: "handover-photos",
        zoneId: "handover",
        order: 1,
        label: "Baseline photos of bike, odometer, and chassis plate taken",
        hint: "Take 4 corner photos of the bike in the showroom bay alongside odometer display for permanent record.",
        type: "photo_suggested",
      },
      {
        id: "handover-contacts",
        zoneId: "handover",
        order: 2,
        label: "Service advisor phone & 24x7 Roadside Assistance saved",
        hint: "Store the dealer service helpline and national 24/7 breakdown recovery toll-free number.",
        type: "check",
      },
      {
        id: "handover-signed-fixes",
        zoneId: "handover",
        order: 3,
        label: "Any pending fixes written and signed on delivery note",
        hint: "Ensure any cosmetic rectifications or pending accessories are endorsed on the dealer's delivery receipt copy.",
        type: "check",
        defaultSeverity: "get_in_writing",
        dealerHint:
          "Never leave showroom on verbal promises; ensure signed endorsement on delivery receipt.",
      },
    ],
  },
];
