export const generatePrompt = async () => {
  const box = document.getElementById("chat-input") as HTMLTextAreaElement | null;
  if (!box) {
    console.error("❌ Chat input box not found.");
    return;
  }
  if (box.value == ""){
    return;
  }
  try {
    // // Load system prompt
    // const systemPromptText = await fetch('./prmpt/generalSystemPrompt.txt');
    // const systemPrompt = await systemPromptText.text();

    // Load profiles and chosen profiles from localStorage
    const profilesJSON = localStorage.getItem('profiles');
    const chosenJSON = localStorage.getItem('chosenProfiles');

    const profiles = profilesJSON ? JSON.parse(profilesJSON) : {};
    const chosenProfiles: string[] = chosenJSON ? JSON.parse(chosenJSON) : [];
    // Construct the `profile` string from chosen profiles
    const profile = chosenProfiles
      .map(name => `${name}: ${profiles[name] || ''}`)
      .join('\n');

    // ✅ Log final profile string
    console.log("Generated profile string:\n" + profile);

    // Prepare payload
    const payload = {
      profile,
      Question: box.value,
      user: "user",
    };

    // Send to backend
    const response = await fetch('https://ellapromptaid.onrender.com/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (data.reply) {
      return data.reply;
    } else {
      console.error("No response from backend:", data);
      return "Ella not response";
    }
  } catch (err) {
    console.error("Failed to fetch from backend:", err);
    return "Ella is dead";
  }
};
