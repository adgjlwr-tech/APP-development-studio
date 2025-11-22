import { GoogleGenAI } from "@google/genai";

// Helper to get the API key safely
const getApiKey = (): string => {
  const key = process.env.API_KEY;
  if (!key) {
    console.error("API Key is missing");
    throw new Error("API Key is missing");
  }
  return key;
};

export const generateColoringBookImages = async (
  theme: string,
  onProgress: (completed: number, total: number) => void
): Promise<{ cover: string; pages: string[] }> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  // We need 1 cover + 5 pages
  const totalImages = 6;
  let completed = 0;

  const updateProgress = () => {
    completed++;
    onProgress(completed, totalImages);
  };

  // 1. Generate Cover Art
  // We ask for a border or central motif, leaving space for text which we add in the PDF/UI
  const coverPrompt = `A black and white coloring book cover illustration. Theme: ${theme}. 
  Style: Thick clean black outlines, white background, vector line art, kid-friendly, cute, simple. 
  Composition: A decorative central scene or border frame. Leave some negative space at the top and bottom for text. 
  No shading, no grayscale, no colors.`;

  // 2. Generate 5 Unique Pages
  // We vary the prompt slightly to ensure diversity
  const pagePrompts = [
    `A simple coloring page for kids. Theme: ${theme}. Scene: Action shot or main character. Style: Thick black outlines, white background, no shading.`,
    `A simple coloring page for kids. Theme: ${theme}. Scene: A peaceful or funny moment. Style: Thick black outlines, white background, no shading.`,
    `A simple coloring page for kids. Theme: ${theme}. Scene: Detailed background or environment focus. Style: Thick black outlines, white background, no shading.`,
    `A simple coloring page for kids. Theme: ${theme}. Scene: Group of characters or objects. Style: Thick black outlines, white background, no shading.`,
    `A simple coloring page for kids. Theme: ${theme}. Scene: Close up or portrait style. Style: Thick black outlines, white background, no shading.`
  ];

  const generateSingleImage = async (prompt: string): Promise<string> => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
      });

      // Extract base64 image
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
      throw new Error("No image data found in response");
    } catch (error) {
      console.error("Gemini generation error:", error);
      // Return a placeholder or re-throw. Re-throwing to handle in UI.
      throw error;
    } finally {
      updateProgress();
    }
  };

  try {
    // Execute requests in parallel for speed
    const [cover, ...pages] = await Promise.all([
      generateSingleImage(coverPrompt),
      ...pagePrompts.map(p => generateSingleImage(p))
    ]);

    return { cover, pages };
  } catch (error) {
    console.error("Failed to generate book:", error);
    throw new Error("Failed to generate coloring book images. Please try again.");
  }
};
