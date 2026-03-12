import { describe, expect, it } from "vitest";

import { formatTime, parseTimeDuration } from "@/lib/store";

describe("formatTime", () => {
  it("formats seconds into hh:mm:ss", () => {
    expect(formatTime(0)).toBe("00:00:00");
    expect(formatTime(65)).toBe("00:01:05");
    expect(formatTime(3661)).toBe("01:01:01");
  });
});

describe("parseTimeDuration", () => {
  it("returns duration in seconds for same-day range", () => {
    expect(parseTimeDuration("19h00 - 21h30")).toBe(9000);
  });

  it("handles ranges that cross midnight", () => {
    expect(parseTimeDuration("23h20 - 00h00")).toBe(2400);
  });

  it("returns 0 for invalid ranges", () => {
    expect(parseTimeDuration("abc")).toBe(0);
    expect(parseTimeDuration("25h00 - 26h00")).toBe(0);
    expect(parseTimeDuration("19h75 - 20h00")).toBe(0);
  });
});
