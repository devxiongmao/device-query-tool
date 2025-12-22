import { formatDate } from "../../src/lib/utils";

describe("formatDate", () => {
  it("returns an empty string when the input is null", () => {
    const result = formatDate(null);

    expect(result).toEqual("");
  });

  it("returns an empty string when the input is undefined", () => {
    const result = formatDate(undefined);

    expect(result).toEqual("");
  });

  it("returns the formatted date when the input is a string", () => {
    const result = formatDate("2023-09-22");

    expect(result).toEqual("Sep 22, 2023");
  });

  it("returns the formatted date when the input is a date", () => {
    const result = formatDate(new Date("2023-09-23"));

    expect(result).toEqual("Sep 23, 2023");
  });
});
