export const generatePrompt = async () => {
  const box = document.getElementById("chat-input") as HTMLTextAreaElement | null;
  if (!box || box.value === "") return;

  try {
    const profilesJSON = localStorage.getItem('profiles');
    const chosenJSON = localStorage.getItem('chosenProfiles');
    const userProfilesJSON = localStorage.getItem('userProfiles');
    const chosenUserProfileJSON = localStorage.getItem('chosenUserProfile');

    const profiles = profilesJSON ? JSON.parse(profilesJSON) : {};
    const chosenProfiles: string[] = chosenJSON ? JSON.parse(chosenJSON) : [];
    const userProfiles = userProfilesJSON ? JSON.parse(userProfilesJSON) : {};
    const chosenUserProfile: string = chosenUserProfileJSON ? JSON.parse(chosenUserProfileJSON) : "";

    const profile = chosenProfiles.map(name => `${name}: ${profiles[name] || ''}`).join('\n');
    let userProfileString = "";
    if (chosenUserProfile && userProfiles[chosenUserProfile]) {
      userProfileString = `${chosenUserProfile}: ${userProfiles[chosenUserProfile]}`;
    }

    console.log("Generated profile string:\n" + profile);
    console.log("Generated user profile string:\n" + userProfileString);
    console.log("Question:\n" + box.value);

    const payload = {
      PPID: 'c50190d6-416e-41cd-8c09-e61270ed679d',
      TPID: ['59ecf796-57a1-498d-88f5-aacf3c4e92d6', '6bace642-105e-4529-9f31-f24b4521a23f'],
      role: 'user',
      question: box.value,
    };

    const response = await fetch('http://localhost:3000/api/message/generatePrompt', {
      method: 'POST',
      credentials: 'include', // 🔐 Send the cookie!
      headers: {
        'Content-Type': 'application/json',
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
