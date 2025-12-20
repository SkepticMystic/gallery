import ky from "ky";

// Export ky instance as http (single entry point)
export const http = ky.create({
  timeout: 30_000,
});
