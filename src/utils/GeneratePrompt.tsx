export const generatePrompt = async () => {
  const box = document.getElementById("chat-input") as HTMLTextAreaElement | null;
  if (!box) {
    console.error("❌ Chat input box not found.");
    return;
  }
  if (box.value === "") {
    return;
  }
  try {
    // Load profiles and chosen profiles from localStorage
    const profilesJSON = localStorage.getItem('profiles');
    const chosenJSON = localStorage.getItem('chosenProfiles');
    const userProfilesJSON = localStorage.getItem('userProfiles');
    const chosenUserProfileJSON = localStorage.getItem('chosenUserProfile');

    const profiles = profilesJSON ? JSON.parse(profilesJSON) : {};
    const chosenProfiles: string[] = chosenJSON ? JSON.parse(chosenJSON) : [];
    const userProfiles = userProfilesJSON ? JSON.parse(userProfilesJSON) : {};
    const chosenUserProfile: string = chosenUserProfileJSON ? JSON.parse(chosenUserProfileJSON) : "";

    // Construct the `profile` string from chosen profiles
    const profile = chosenProfiles
      .map(name => `${name}: ${profiles[name] || ''}`)
      .join('\n');

    // Construct user profile string (single selection)
    let userProfileString = "";
    if (chosenUserProfile && userProfiles[chosenUserProfile]) {
      userProfileString = `${chosenUserProfile}: ${userProfiles[chosenUserProfile]}`;
    }

    // ✅ Log final profile string
    console.log("Generated profile string:\n" + profile);

    // ✅ Log user profile string
    console.log("Generated user profile string:\n" + userProfileString);
    console.log("Question:\n" + box.value)
    // Prepare payload
    const payload = {
      profile,
      Question: box.value,
      user: userProfileString,
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