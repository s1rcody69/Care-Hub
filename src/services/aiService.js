import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_KEY,
  dangerouslyAllowBrowser: true // Required for client-side React
});

export const getHealthResponse = async (messages) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Fast and cost-effective model
      messages: [
        {
          role: "system",
          content: `You are the CareHub Health Assistant. 
          STRICT RULES:
          1. Only answer questions related to health, medicine, medical advice, and the CareHub platform.
          2. If a user asks about anything else (e.g., movies, coding, sports), politely decline and state you are only authorized to discuss health and CareHub.
          3. Keep responses concise, empathetic, and professional.
          4. Always include a brief disclaimer that you are an AI and not a licensed doctor when providing medical information.`
        },
        ...messages
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Error:", error);
    throw error;
  }
};