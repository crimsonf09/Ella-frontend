import { secureFetch } from "../api/secureFetch";

export const generatePromptSuggestion = async (question: string) => {
    if (!question.trim()) return null; // Return null if no valid question is provided

    const chosenProfilesJSON = localStorage.getItem("chosenTaskProfiles");
    const chosenUserProfile = localStorage.getItem("chosenUserProfile");

    const TPIds: string[] = chosenProfilesJSON ? JSON.parse(chosenProfilesJSON) : [];
    const PPId: string = chosenUserProfile ?? "";

    const payload = {
        PPId,
        TPIds,
        role: "user",
        question,
        type: "none",
        messageClass: "default",
    };

    const response = await secureFetch(`${import.meta.env.VITE_API_URL}/message/promptSuggestion`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (response.status === 401) throw new Error("Please login");
    if (!response.ok) throw new Error("Request failed");

    const data = await response.json();
    console.log(data)
    return data;
};
