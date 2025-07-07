import { useContext } from "react";
import { secureFetch } from "../api/secureFetch";

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
      PPId: chosenUserProfile,
      TPIds: chosenProfiles,
      role: 'user',
      question: box.value,
    };
    const response = await secureFetch('http://127.0.0.1:3000/api/message/generatePrompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log(data);
    if (data) {
      
      return data;
    } else {
      console.error("No response from backend:", data);
      return "Ella not response";
    }
  } catch (err) {
    console.error("Failed to fetch from backend:", err);
    return "Ella is dead";
  }
};
