import { useContext } from "react";
import { secureFetch } from "../api/secureFetch";

export const generatePrompt = async () => {
  const box = document.getElementById("chat-input") as HTMLTextAreaElement | null;
  if (!box || box.value === "") return;

  try {
    // Get IDs from localStorage
    const chosenProfilesJSON = localStorage.getItem('chosenTaskProfiles'); // should be array of TPId (string[])
    const chosenUserProfile = localStorage.getItem('chosenUserProfile');   // should be a PPId (string) or null

    // Parse
    const TPIds: string[] = chosenProfilesJSON ? JSON.parse(chosenProfilesJSON) : [];
    const PPId: string = chosenUserProfile ? chosenUserProfile : "";

    // Log for debug
    console.log("Chosen TaskProfiles (TPIds):", TPIds);
    console.log("Chosen UserProfile (PPId):", PPId);
    console.log("Question:\n" + box.value);

    const payload = {
      PPId,
      TPIds,
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

    if (response.status === 401) {
      return "Please Login";
    }
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