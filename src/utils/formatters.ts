export const formatDuration = (durationString: string): string => {
  // Parse ISO 8601 duration or handle a timespan string
  if (!durationString) return "0:00:00";

  // Handle ISO format (like PT1H30M45S)
  if (durationString.includes("PT")) {
    const matches = durationString.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (matches) {
      const hours = matches[1] ? parseInt(matches[1]) : 0;
      const minutes = matches[2] ? parseInt(matches[2]) : 0;
      const seconds = matches[3] ? parseInt(matches[3]) : 0;

      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
  }

  // Handle C# TimeSpan like format (23:30:45)
  if (durationString.includes(":")) {
    // Already in the correct format
    return durationString;
  }

  // Handle total seconds
  if (!isNaN(Number(durationString))) {
    const totalSeconds = Number(durationString);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  return durationString;
};

export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString("vi-VN") + " VNĐ";
};
