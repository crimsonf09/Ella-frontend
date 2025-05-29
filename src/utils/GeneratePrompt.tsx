export const generatePrompt = async () => {
  const box = document.getElementById("chat-input") as HTMLTextAreaElement | null;

  if (!box) {
    console.error("❌ Chat input box not found.");
    return;
  }

  const profile = localStorage.getItem('settingsText') || '';

  const prompt = `
    Please generate a prompt using the most effective and efficient way to help me to write a prompt.
    I strongly recommend you to use the following methods:
    1. Role prompt — start with a role and describe input/output goals.
    2. Zero and few-shot prompt — give examples to clarify expected output.
    3. Context prompt — provide relevant info for accurate output.
    4. Instruction prompt — clear, concise instructions.
    5. COT prompt — use chain-of-thought reasoning when helpful.

    Use only what is most effective and efficient. Return only the final prompt—no explanation.

    Profile, company, and product details: ${profile}
    My question: ${box.value}
  `.trim();

  try {
    const response = await fetch('http://localhost:3000/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, model: 'llama3.2:3b' }),
    });
    console.log(prompt);

    const data = await response.json();
    if (data?.response) {
      return data.response;
    } else {
      console.error("No response from Ollama API", data);
      return "Ella not response"
    }
  } catch (err) {
    console.error("Failed to fetch from backend:", err);
    return "Ella is dead"
  }
};
