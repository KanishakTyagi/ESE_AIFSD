exports.analyzeComplaint = async (req, res) => {
  try {
    const { description } = req.body;
    
    if (!description) {
      return res.status(400).json({ message: 'Description is required for analysis' });
    }

    const prompt = `
    Analyze the following complaint: "${description}"
    
    Provide the output strictly in the following JSON format without any markdown formatting or extra text:
    {
      "priority": "High | Medium | Low",
      "department": "The concerned department name (e.g., Water Supply, Electricity, Sanitation, General)",
      "summary": "A one sentence summary of the complaint",
      "autoResponse": "A polite, auto-generated message to the user acknowledging their complaint and assuring action"
    }
    `;

    // Fetch from OpenRouter/OpenAI-compatible endpoint
    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY;
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b:free",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`API Error: ${data.error?.message || response.statusText}`);
    }

    const responseText = data.choices[0].message.content;
    
    // Clean up the response in case the model returns markdown like ```json ... ```
    const jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      const parsedData = JSON.parse(jsonString);
      res.json(parsedData);
    } catch (parseError) {
      console.error("Error parsing JSON from AI:", jsonString);
      res.status(500).json({ message: 'Error analyzing complaint due to unexpected format' });
    }

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: 'Server error during AI analysis', error: error.message });
  }
};
