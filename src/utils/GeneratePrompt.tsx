export const generatePrompt = async () => {
  const box = document.getElementById("chat-input") as HTMLTextAreaElement | null;
  const systemPromptText = await fetch('./prmpt/generalSystemPrompt.txt');
  const systemPrompt = await systemPromptText.text();
  if (!box) {
    console.error("❌ Chat input box not found.");
    return;
  }

  const profile = localStorage.getItem('settingsText') || '';
  const prompt = `Give me the most effective prompt
    profile: ${profile}
    my question: ${box.value}
  `
  try {
    const response = await fetch('https://ellapromptaid.onrender.com/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt, systemPrompt: {systemPrompt} }),
    });
    console.log(prompt);

    const data = await response.json();
    if (data.reply) {
      return data.reply;
    } else {
      console.error("No response from Ella Ollama API", data);
      return "Ella not response"
    }
  } catch (err) {
    console.error("Failed to fetch from backend:", err);
    return "Ella is dead"
  }
};
