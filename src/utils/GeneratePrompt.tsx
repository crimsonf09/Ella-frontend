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
    const result = await chrome.storage.local.get('EllaToken');
    const token = result.EllaToken;
    const payload = {
      PPID: 'c50190d6-416e-41cd-8c09-e61270ed679d',
      TPID: ['59ecf796-57a1-498d-88f5-aacf3c4e92d6', '6bace642-105e-4529-9f31-f24b4521a23f'],
      role: 'user',
      question: box.value,
    };

    // Send to backend
    const response = await fetch('http://localhost:3000/api/message/generatePrompt',
      // const response = await fetch('https://ellapromptaid.onrender.com/generate', 

      {
        method: 'POST',

        headers: {
          Authorization: `Bearer ${token}`, 'Content-Type': 'application/json',
          credentials: 'include',
        },
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