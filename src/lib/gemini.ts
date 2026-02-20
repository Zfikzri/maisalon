import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

if (!apiKey) {
  console.error('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env.local file.')
}

const genAI = new GoogleGenerativeAI(apiKey)

// Convert File to Gemini-compatible format
async function fileToGenerativePart(file: File) {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1]
      resolve({
        inlineData: {
          data: base64,
          mimeType: file.type,
        },
      })
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export interface StyleAnalysisResult {
  faceShape: string
  skinTone: string
  hairstyles: Array<{
    name: string
    reason: string
  }>
  colors: Array<{
    name: string
    reason: string
  }>
}

export async function analyzeFaceForStyling(imageFile: File): Promise<StyleAnalysisResult> {
  try {
    // Use Gemini Pro Vision for image analysis
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image' })

    // Convert image to base64 format
    const imagePart = await fileToGenerativePart(imageFile)

    const prompt = `You are an expert beauty consultant and hairstylist. Analyze this person's facial features and provide professional styling recommendations.

Please analyze:
1. Face shape (choose ONE: oval, round, square, heart, diamond, or oblong)
2. Skin tone (describe as: warm/cool/neutral + light/medium/deep)
3. THREE specific hairstyle recommendations that would flatter their features
4. THREE hair color recommendations that complement their skin tone

IMPORTANT: Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "faceShape": "oval",
  "skinTone": "warm medium",
  "hairstyles": [
    {
      "name": "Layered Lob with Curtain Bangs",
      "reason": "The layered cut adds movement and the curtain bangs soften angular features, creating a balanced, flattering look for your face shape."
    },
    {
      "name": "Textured Shoulder-Length Cut",
      "reason": "This length hits at the perfect point to elongate the neck while the texture adds dimension and modern style."
    },
    {
      "name": "Long Layers with Side-Swept Fringe",
      "reason": "Long layers create flow and the side fringe adds asymmetry that complements your facial structure beautifully."
    }
  ],
  "colors": [
    {
      "name": "Warm Caramel Balayage",
      "reason": "This rich, warm tone enhances your natural skin undertones and adds depth with a sun-kissed, natural finish."
    },
    {
      "name": "Honey Blonde Highlights",
      "reason": "Soft honey tones brighten your complexion and create a luminous, youthful glow that complements warm skin beautifully."
    },
    {
      "name": "Chocolate Brown with Copper Lowlights",
      "reason": "The rich base with copper accents adds warmth and dimension, creating a sophisticated, multi-tonal look."
    }
  ]
}`

    const result = await model.generateContent([prompt, imagePart])
    const response = await result.response
    const text = response.text()

    // Clean the response - remove markdown code blocks if present
    let cleanedText = text.trim()
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?$/g, '')
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/g, '')
    }

    const analysis: StyleAnalysisResult = JSON.parse(cleanedText)

    return analysis
  } catch (error: any) {
    console.error('Gemini AI Error:', error)

    // Provide helpful error messages
    if (error.message?.includes('API_KEY')) {
      throw new Error('Invalid API key. Please check your Gemini API key in .env.local')
    } else if (error.message?.includes('quota')) {
      throw new Error('API quota exceeded. Please try again later.')
    } else if (error.message?.includes('JSON')) {
      throw new Error('Unable to process the image. Please try a different photo.')
    } else {
      throw new Error('AI analysis failed. Please try again with a clear portrait photo.')
    }
  }
}

export async function generateStylePreview(
  imageFile: File,
  recommendation: { name: string; reason: string },
  colorRecommendation: { name: string; reason: string }
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    // Convert image to base64
    const imagePart = await fileToGenerativePart(imageFile)

    const prompt = `Create a photorealistic transformation of this person with the following hairstyle and color:

Hairstyle: ${recommendation.name}
Color: ${colorRecommendation.name}

IMPORTANT Instructions:
- Keep the person's face, facial features, and identity EXACTLY the same
- Only transform the hairstyle and hair color
- Maintain natural lighting and the original photo quality
- Make it look like a professional salon result
- The transformation should be realistic and achievable
- Keep skin tone, eye color, and all facial features identical

Generate a single high-quality image showing this person with their new hairstyle and color.`

    const result = await model.generateContent([prompt, imagePart])
    const response = await result.response

    // For Gemini 2.0, the response includes generated images
    // Extract the image data from the response
    const imageData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData

    if (imageData) {
      return `data:${imageData.mimeType};base64,${imageData.data}`
    } else {
      throw new Error('No image generated in response')
    }
  } catch (error: any) {
    console.error('Image Generation Error:', error)

    if (error.message?.includes('quota')) {
      throw new Error('Image generation quota exceeded. Please try again tomorrow.')
    } else {
      throw new Error('Failed to generate style preview. Please try again.')
    }
  }
}
