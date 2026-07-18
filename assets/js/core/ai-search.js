/* =========================================================
AI song search (Gemini free key)
========================================================= */
async function aiSearch(q, apiKey) {
    const prompt =
        `You are helping a church worship team find a song. The user's query (song title or author, may be English or Chinese): "${q}".

Search the web for this worship song. Then respond with ONLY a JSON object, no markdown fences, no commentary, in this exact shape:
{"found": true, "songs":[{"title":"", "author":"", "language":"en|zh|bilingual", "key":"", "lyrics":""}]}

Rules:
- Return at most 5 best-matching songs.
- "author": composer/writer or the ministry (e.g. Stream of Praise, Hillsong). Required.
- "key": the commonly used original key if known, else "".
- "lyrics": the song's lyrics with verse/chorus line breaks (\\n).
- If nothing relevant is found: {"found": false, "songs": []}.
Respond with the JSON object only.`;

    const resp = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            tools: [{
                google_search: {}
            }]
        })
    });
    
    const data = await resp.json();
    
    if (data.error) throw new Error(data.error.message || 'Gemini API error');
    
    const parts = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || [];
    const text = parts.map(p => p.text || '').join('\n');

    const parsed = extractJSON(text);
    
    if (!parsed || !parsed.found || !Array.isArray(parsed.songs)) return [];
    
    return parsed.songs;
}
