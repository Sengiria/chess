export const handleStockfishRequest = async (fen: string): Promise<string | null> => {
  try {
    const response = await fetch("https://sengiria-chess-api.hf.space/best-move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fen }),
    });

    if (!response.ok) {
      console.error("API error:", response.status);
      return null;
    }

    const data = await response.json();
    return data.best_move || null;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

export const handleStockfishStartup = async (): Promise<boolean> => {
  try {
    const response = await fetch("https://sengiria-chess-api.hf.space/ping");

    if (!response.ok) {
      console.error("API error:", response.status);
      return false;
    }

    const data = await response.json();
    return data.status === "ok";
  } catch (error) {
    console.error("Fetch error:", error);
    return false;
  }
};
