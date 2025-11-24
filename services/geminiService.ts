
import { GoogleGenAI, Type } from '@google/genai';
import type { Boq, BoqItem, ProductDetails, Room, ValidationResult, GroundingSource } from '../types';
import { productDatabase } from '../data/productData';

// Support both standard node process.env and Vite's import.meta.env
const API_KEY = process.env.API_KEY || (import.meta as any).env.VITE_API_KEY;

if (!API_KEY) {
  console.error("API_KEY is missing. Please set VITE_API_KEY in your environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const databaseString = JSON.stringify(productDatabase.map(p => ({ brand: p.brand, model: p.model, description: p.description, category: p.category, price: p.price })));


/**
 * Generates a Bill of Quantities (BOQ) based on user requirements.
 */
export const generateBoq = async (answers: Record<string, any>): Promise<Boq> => {
    const model = 'gemini-2.5-pro';

    const requiredSystems = answers.requiredSystems || ['display', 'video_conferencing', 'audio', 'connectivity_control', 'infrastructure', 'acoustics'];
    
    const categoryMap: Record<string, string[]> = {
        display: ["Display"],
        video_conferencing: ["Video Conferencing & Cameras"],
        audio: ["Audio - Microphones", "Audio - DSP & Amplification", "Audio - Speakers"],
        connectivity_control: ["Video Distribution & Switching", "Control System & Environmental"],
        infrastructure: ["Cabling & Infrastructure", "Mounts & Racks"],
        acoustics: ["Acoustic Treatment"],
    };

    const allowedCategories = requiredSystems.flatMap((system: string) => categoryMap[system] || []);
    allowedCategories.push("Accessories & Services"); // Always include this category

    const requirements = Object.entries(answers)
      .map(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          return `${key}: ${value.join(', ')}`;
        }
        if (value) {
            return `${key}: ${value}`;
        }
        return null;
      })
      .filter(Boolean)
      .join('; ');

    const prompt = `You are a world-class, senior AV Solutions Architect (CTS-D certified). Your task is to create a 100% technically flawless, logical, and production-ready Bill of Quantities (BOQ) based on the client's detailed requirements.

**Custom Product Database (PRIORITY SOURCE):**
A JSON list of available products is provided. 

**Client Requirements:** "${requirements}"

**CORE LOGIC & RULES (STRICT ADHERENCE REQUIRED):**

1.  **DATABASE PRIORITY & PRICING PROTOCOL (STRICT THREE-TIER SYSTEM):**
    *   **TIER 1 (Perfect Match):** For every requirement, search the 'Custom Product Database' first. If a suitable product exists AND has a price > 0, you MUST use it. 
        *   Set 'source' to 'database'.
        *   Set 'priceSource' to 'database'.
    *   **TIER 2 (DB Match, AI Pricing):** If a suitable product is in the DB but price is 0, null, or missing, use the DB Item details (Brand, Model, Desc) but use your AI knowledge/Web data to ESTIMATE a current realistic market price (MSRP) in USD. **NEVER return 0.**
        *   Set 'source' to 'database'.
        *   Set 'priceSource' to 'estimated'.
    *   **TIER 3 (Web Fallback):** ONLY if no suitable product exists in the database for a specific requirement, generate a specific, commercially available product from the web. Estimate its price.
        *   Set 'source' to 'web'.
        *   Set 'priceSource' to 'estimated'.

2.  **PRODUCTION-READY COMPLETENESS (AVIXA STANDARDS):**
    *   **Signal Flow Integrity:** Every signal path must be complete (Source -> Cable -> Transmitter -> Receiver -> Display).
    *   **Cable Logic:** 
        *   Use 'rackDistance', 'tableLength', and 'roomDimensions' to calculate cable lengths.
        *   **Formula:** (Distance from Source to Sink) + (Vertical Run up/down wall ~10ft) + (Service Loop ~5ft).
        *   If distance > 15m (50ft) for HDMI, you MUST specify HDBaseT or AV-over-IP Tx/Rx kits.
        *   For every piece of rack equipment, add a "CAT6 Patch Cord (3ft)".
        *   If 'plenumRequirement' is 'plenum_required', specify CMP/Plenum rated cables.
    *   **Mounting & Infrastructure:**
        *   If a display is listed, a compatible mount MUST be listed. Check 'wallReinforcement'. If 'no', add "Backing/Reinforcement" or specific toggle anchors.
        *   If a projector is listed, a screen and mount MUST be listed.
        *   If a rack is required, include "Rack Blank Panels", "Rack Shelves", "Power Distribution Unit (PDU)", and "Cable Management Bars".
    *   **Audio Logic:**
        *   Speakers: Calculate quantity based on room area. Standard ceiling coverage is ~1 speaker per 100-150 sq ft for 10ft ceilings.
        *   Amplification: Ensure amplifier power matches speaker load + 20% headroom.

3.  **MANDATORY CONSUMABLES:**
    *   Always include a line item for "Installation Consumables (Connectors, Labels, Zip Ties, Velcro)" estimated at $100-$300 depending on system size.

4.  **Scope Enforcement:**
    *   ONLY generate items for categories in this list: ${allowedCategories.join(', ')}.

**OUTPUT FORMAT:**
Return ONLY a valid JSON array of objects:
- category: string (Exact category from allowed list)
- itemDescription: string (Concise technical description including key specs like length, resolution, power)
- brand: string
- model: string
- quantity: number
- unitPrice: number (REALISTIC USD PRICE. NO ZEROS.)
- totalPrice: number (quantity * unitPrice)
- source: string ('database' or 'web')
- priceSource: string ('database' or 'estimated')
    `;

    const responseSchema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            itemDescription: { type: Type.STRING },
            brand: { type: Type.STRING },
            model: { type: Type.STRING },
            quantity: { type: Type.NUMBER },
            unitPrice: { type: Type.NUMBER },
            totalPrice: { type: Type.NUMBER },
            source: { type: Type.STRING, enum: ['database', 'web'] },
            priceSource: { type: Type.STRING, enum: ['database', 'estimated'] },
          },
          required: ['category', 'itemDescription', 'brand', 'model', 'quantity', 'unitPrice', 'totalPrice', 'source', 'priceSource'],
        },
    };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: [{ 
                role: 'user', 
                parts: [
                    { text: prompt },
                    { text: `Custom Product Database: ${databaseString}` }
                ]
            }],
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2, // Low temperature for strict logic
            },
        });

        const jsonText = response.text.trim();
        const boq: BoqItem[] = JSON.parse(jsonText);
        
        const categoryOrder = [
            "Display", "Video Conferencing & Cameras", "Video Distribution & Switching", "Audio - Microphones", "Audio - DSP & Amplification",
            "Audio - Speakers", "Control System & Environmental", "Acoustic Treatment", "Cabling & Infrastructure", "Mounts & Racks", "Accessories & Services",
        ];

        const sortedBoq = boq.sort((a, b) => {
            const indexA = categoryOrder.indexOf(a.category);
            const indexB = categoryOrder.indexOf(b.category);
            return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
        });

        // Double check calculation
        return sortedBoq.map((item: BoqItem) => ({
            ...item,
            totalPrice: item.quantity * item.unitPrice
        }));

    } catch (error) {
        console.error('Error generating BOQ:', error);
        throw error;
    }
};

/**
 * Refines an existing BOQ based on a user-provided prompt.
 */
export const refineBoq = async (currentBoq: Boq, refinementPrompt: string): Promise<Boq> => {
    const model = 'gemini-2.5-pro';
    const prompt = `Refine the following Bill of Quantities (BOQ) based on the user's request.

    Current BOQ (JSON):
    ${JSON.stringify(currentBoq, null, 2)}

    User Request: "${refinementPrompt}"

    **INSTRUCTIONS:**
    1.  **Database Check:** When adding/swapping items, check the Custom Product Database first.
    2.  **Three-Tier Logic:**
        *   Use 'database' source and 'database' priceSource if item exists with price.
        *   Use 'database' source and 'estimated' priceSource if item exists with NO price (0).
        *   Use 'web' source and 'estimated' priceSource if item is not in DB.
    3.  **Technical Consistency:** Ensure the system remains functional.
    4.  **Field Requirement:** Ensure 'source' and 'priceSource' are populated correctly for all items.
    
    Return the complete, updated JSON array.
    `;
    
    const responseSchema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            itemDescription: { type: Type.STRING },
            brand: { type: Type.STRING },
            model: { type: Type.STRING },
            quantity: { type: Type.NUMBER },
            unitPrice: { type: Type.NUMBER },
            totalPrice: { type: Type.NUMBER },
            source: { type: Type.STRING, enum: ['database', 'web'] },
            priceSource: { type: Type.STRING, enum: ['database', 'estimated'] },
          },
          required: ['category', 'itemDescription', 'brand', 'model', 'quantity', 'unitPrice', 'totalPrice', 'source', 'priceSource'],
        },
    };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: [{ 
                role: 'user', 
                parts: [
                    { text: prompt },
                    { text: `Custom Product Database: ${databaseString}` }
                ]
            }],
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        const boq = JSON.parse(jsonText);
        
        return boq.map((item: BoqItem) => ({
            ...item,
            totalPrice: item.quantity * item.unitPrice
        }));
    } catch (error) {
        console.error('Error refining BOQ:', error);
        throw error;
    }
};

/**
 * Generates a photorealistic visualization of a room based on requirements and BOQ.
 */
export const generateRoomVisualization = async (answers: Record<string, any>, boq: Boq): Promise<string> => {
    const model = 'imagen-4.0-generate-001';

    // Create a concise summary of key, visible components
    const coreComponents = boq.filter(item => 
        ['Display', 'Video Conferencing & Cameras', 'Audio - Speakers', 'Control System & Environmental'].includes(item.category)
    );
    const equipmentManifest = coreComponents.map(item => `- ${item.quantity}x ${item.itemDescription} (${item.brand})`).join('\n');

    const prompt = `
      Create a photorealistic, high-quality architectural rendering of a modern corporate ${answers.roomType || 'meeting room'}.
      Room Style: Clean, professional, well-lit.
      Seating: ${answers.seatingArrangement || 'conference table'}.
      Key Technology to feature:
      ${equipmentManifest}
      Perspective: Wide-angle, showing the main display wall and table.
      Final Image: Must be 16:9 landscape. Do NOT add any text, logos, or labels.
    `;

    try {
        const response = await ai.models.generateImages({
            model: model,
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated by the API.");
        }
    } catch (error) {
        console.error('Error generating room visualization:', error);
        throw error;
    }
};

/**
 * Validates a BOQ against requirements and best practices.
 */
export const validateBoq = async (boq: Boq, requirements: string): Promise<ValidationResult> => {
    const model = 'gemini-2.5-pro';
    const prompt = `You are an expert AV system design auditor. Analyze the provided Bill of Quantities (BOQ) against the user's requirements with extreme scrutiny. Your primary goal is to identify critical design flaws.

    User Requirements: "${requirements}"

    Current BOQ (JSON):
    ${JSON.stringify(boq, null, 2)}

    Perform the following analysis:
    1.  **Ecosystem Conflict Check (HIGHEST PRIORITY):** Does the BOQ mix core control, audio, and video components from competing ecosystems (e.g., a Crestron control processor with Q-SYS video distribution, or an Extron controller with AMX touch panels)? This is a critical design failure. Flag any such conflicts as a major warning.
    2.  **Completeness Check:** Are there any crucial components missing for a fully functional system? (e.g., mounts for displays, a managed network switch for an AV-over-IP system, power distribution units, a control processor if a touch panel is listed).
    3.  **Networking Check:** If AV-over-IP components are listed, is a specific, brand-name managed network switch also listed? A 'generic' switch is a failure.
    4.  **Environmental Check:** Based on the room type (e.g., Auditorium, Town Hall, Boardroom), have **acoustic treatment** and **specialized lighting** been considered? If they appear to be missing but should be present, list them under 'missingComponents' and add a warning.
    5.  **Compatibility Check:** Are there any less obvious component incompatibilities? Flag any potential mismatches.

    Provide your findings in a structured JSON format. Be strict: if there are any warnings or missing components, 'isValid' MUST be false.
    - isValid: boolean
    - warnings: string[] (List of critical design flaws and incompatibilities).
    - suggestions: string[] (Recommendations for improvement).
    - missingComponents: string[] (Specific components you believe are missing).
    `;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            isValid: { type: Type.BOOLEAN },
            warnings: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            },
            suggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            },
            missingComponents: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            },
        },
        required: ['isValid', 'warnings', 'suggestions', 'missingComponents'],
    };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error('Error validating BOQ:', error);
        return {
            isValid: false,
            warnings: ['AI validation failed to run. Please check the BOQ manually.'],
            suggestions: [],
            missingComponents: [],
        };
    }
};

/**
 * Generates a technical schematic diagram for a room based on requirements and BOQ.
 */
export const generateRoomSchematic = async (answers: Record<string, any>, boq: Boq): Promise<string> => {
    const model = 'imagen-4.0-generate-001';

    // Create a concise summary of key components for the schematic
    const coreComponents = boq.filter(item => 
      !['Cabling & Infrastructure', 'Mounts & Racks', 'Acoustic Treatment', 'Accessories & Services'].includes(item.category)
    );
    const equipmentManifest = coreComponents.map(item => `- ${item.quantity}x ${item.brand} ${item.model}`).join('\n');
    
    const prompt = `
      TASK: Create a professional AV system schematic diagram (functional block diagram).

      STYLE:
      - 2D technical drawing.
      - Black and white line art on a clean white background.
      - Minimalist, clear, and organized.
      - Use standard rectangular blocks for equipment.
      - Label each block with its model name (e.g., "Crestron CP4N", "Shure MXA920"). Text must be legible.
      - Use clear, straight lines with arrows to show logical signal flow.
      - DO NOT add color, shading, or isometric perspectives.

      SYSTEM CONTEXT:
      - This is for a corporate ${answers.roomType || 'meeting room'}.
      
      EQUIPMENT LIST (Must be included and connected logically):
      ${equipmentManifest}
    `;

    try {
        const response = await ai.models.generateImages({
            model: model,
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated by the API for the schematic.");
        }
    } catch (error) {
        console.error('Error generating room schematic:', error);
        throw error;
    }
};

/**
 * Fetches product details using Google Search grounding.
 */
export const fetchProductDetails = async (productName: string): Promise<ProductDetails> => {
    const model = 'gemini-2.5-flash';
    const prompt = `Give me a one-paragraph technical and functional overview for the product: "${productName}". The description should be suitable for a customer proposal.
    After the description, on a new line, write "IMAGE_URL:" followed by a direct URL to a high-quality, front-facing image of the product if you can find one.
    `;
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const text = response.text;
        let description = text;
        let imageUrl = '';

        const imageUrlMatch = text.match(/\nIMAGE_URL:\s*(.*)/);
        if (imageUrlMatch && imageUrlMatch[1]) {
            imageUrl = imageUrlMatch[1].trim();
            description = text.substring(0, imageUrlMatch.index).trim();
        }

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        
        const sources: GroundingSource[] = groundingChunks
            ?.filter((chunk): chunk is { web: { uri: string; title: string } } => !!chunk.web)
            .map(chunk => ({ web: chunk.web! })) || [];

        return {
            description,
            imageUrl,
            sources,
        };
    } catch (error) {
        console.error(`Error fetching product details for "${productName}":`, error);
        throw new Error(`Failed to fetch product details for "${productName}".`);
    }
};
