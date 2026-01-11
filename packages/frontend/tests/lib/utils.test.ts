import {
  formatDate,
  groupBandsByNumberAndTechnology,
} from "../../src/lib/utils";
import type { Band } from "../../src/graphql/generated/graphql";

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

describe("groupBandsByNumberAndTechnology", () => {
  it("returns an empty array when input is null", () => {
    const result = groupBandsByNumberAndTechnology(null);

    expect(result).toEqual([]);
  });

  it("returns an empty array when input is undefined", () => {
    const result = groupBandsByNumberAndTechnology(undefined);

    expect(result).toEqual([]);
  });

  it("returns an empty array when input is an empty array", () => {
    const result = groupBandsByNumberAndTechnology([]);

    expect(result).toEqual([]);
  });

  it("groups bands by bandNumber and technology", () => {
    const bands: Band[] = [
      {
        id: "1",
        bandNumber: "2",
        technology: "LTE",
        dlBandClass: "A",
        ulBandClass: "A",
      },
      {
        id: "2",
        bandNumber: "3",
        technology: "LTE",
        dlBandClass: "B",
        ulBandClass: "B",
      },
    ];

    const result = groupBandsByNumberAndTechnology(bands);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      bandNumber: "2",
      technology: "LTE",
      dlBandClass: "A",
      ulBandClass: "A",
    });
    expect(result[1]).toMatchObject({
      bandNumber: "3",
      technology: "LTE",
      dlBandClass: "B",
      ulBandClass: "B",
    });
  });

  it("combines multiple dlBandClass values with slashes", () => {
    const bands: Band[] = [
      {
        id: "1",
        bandNumber: "2",
        technology: "LTE",
        dlBandClass: "A",
        ulBandClass: "A",
      },
      {
        id: "2",
        bandNumber: "2",
        technology: "LTE",
        dlBandClass: "C",
        ulBandClass: "A",
      },
    ];

    const result = groupBandsByNumberAndTechnology(bands);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      bandNumber: "2",
      technology: "LTE",
      dlBandClass: "A/C",
      ulBandClass: "A",
    });
  });

  it("combines multiple ulBandClass values with slashes", () => {
    const bands: Band[] = [
      {
        id: "1",
        bandNumber: "2",
        technology: "LTE",
        dlBandClass: "A",
        ulBandClass: "A",
      },
      {
        id: "2",
        bandNumber: "2",
        technology: "LTE",
        dlBandClass: "A",
        ulBandClass: "B",
      },
    ];

    const result = groupBandsByNumberAndTechnology(bands);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      bandNumber: "2",
      technology: "LTE",
      dlBandClass: "A",
      ulBandClass: "A/B",
    });
  });

  it("handles null dlBandClass values", () => {
    const bands: Band[] = [
      {
        id: "1",
        bandNumber: "2",
        technology: "LTE",
        dlBandClass: "A",
        ulBandClass: "A",
      },
      {
        id: "2",
        bandNumber: "2",
        technology: "LTE",
        dlBandClass: null,
        ulBandClass: "A",
      },
    ];

    const result = groupBandsByNumberAndTechnology(bands);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      bandNumber: "2",
      technology: "LTE",
      dlBandClass: "A",
      ulBandClass: "A",
    });
  });

  it("handles null ulBandClass values", () => {
    const bands: Band[] = [
      {
        id: "1",
        bandNumber: "2",
        technology: "LTE",
        dlBandClass: "A",
        ulBandClass: "A",
      },
      {
        id: "2",
        bandNumber: "2",
        technology: "LTE",
        dlBandClass: "A",
        ulBandClass: null,
      },
    ];

    const result = groupBandsByNumberAndTechnology(bands);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      bandNumber: "2",
      technology: "LTE",
      dlBandClass: "A",
      ulBandClass: "A",
    });
  });

  it("returns '-' when all dlBandClass values are null or empty", () => {
    const bands: Band[] = [
      {
        id: "1",
        bandNumber: "2",
        technology: "LTE",
        dlBandClass: null,
        ulBandClass: "A",
      },
    ];

    const result = groupBandsByNumberAndTechnology(bands);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      bandNumber: "2",
      technology: "LTE",
      dlBandClass: "-",
      ulBandClass: "A",
    });
  });

  it("returns '-' when all ulBandClass values are null or empty", () => {
    const bands: Band[] = [
      {
        id: "1",
        bandNumber: "2",
        technology: "LTE",
        dlBandClass: "A",
        ulBandClass: null,
      },
    ];

    const result = groupBandsByNumberAndTechnology(bands);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      bandNumber: "2",
      technology: "LTE",
      dlBandClass: "A",
      ulBandClass: "-",
    });
  });

  it("sorts band classes alphabetically", () => {
    const bands: Band[] = [
      {
        id: "1",
        bandNumber: "2",
        technology: "LTE",
        dlBandClass: "C",
        ulBandClass: "B",
      },
      {
        id: "2",
        bandNumber: "2",
        technology: "LTE",
        dlBandClass: "A",
        ulBandClass: "A",
      },
      {
        id: "3",
        bandNumber: "2",
        technology: "LTE",
        dlBandClass: "B",
        ulBandClass: "C",
      },
    ];

    const result = groupBandsByNumberAndTechnology(bands);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      bandNumber: "2",
      technology: "LTE",
      dlBandClass: "A/B/C",
      ulBandClass: "A/B/C",
    });
  });

  it("treats same band number with different technologies as separate groups", () => {
    const bands: Band[] = [
      {
        id: "1",
        bandNumber: "2",
        technology: "LTE",
        dlBandClass: "A",
        ulBandClass: "A",
      },
      {
        id: "2",
        bandNumber: "2",
        technology: "NR",
        dlBandClass: "B",
        ulBandClass: "B",
      },
    ];

    const result = groupBandsByNumberAndTechnology(bands);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      bandNumber: "2",
      technology: "LTE",
      dlBandClass: "A",
      ulBandClass: "A",
    });
    expect(result[1]).toMatchObject({
      bandNumber: "2",
      technology: "NR",
      dlBandClass: "B",
      ulBandClass: "B",
    });
  });

  it("skips bands with missing bandNumber", () => {
    const bands: Band[] = [
      {
        id: "1",
        bandNumber: "2",
        technology: "LTE",
        dlBandClass: "A",
        ulBandClass: "A",
      },
      {
        id: "2",
        bandNumber: null,
        technology: "LTE",
        dlBandClass: "B",
        ulBandClass: "B",
      },
    ];

    const result = groupBandsByNumberAndTechnology(bands);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      bandNumber: "2",
      technology: "LTE",
      dlBandClass: "A",
      ulBandClass: "A",
    });
  });

  it("skips bands with missing technology", () => {
    const bands: Band[] = [
      {
        id: "1",
        bandNumber: "2",
        technology: "LTE",
        dlBandClass: "A",
        ulBandClass: "A",
      },
      {
        id: "2",
        bandNumber: "3",
        technology: null,
        dlBandClass: "B",
        ulBandClass: "B",
      },
    ];

    const result = groupBandsByNumberAndTechnology(bands);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      bandNumber: "2",
      technology: "LTE",
      dlBandClass: "A",
      ulBandClass: "A",
    });
  });

  it("uses band id when available, otherwise uses key as id", () => {
    const bands: Band[] = [
      {
        id: "band-1",
        bandNumber: "2",
        technology: "LTE",
        dlBandClass: "A",
        ulBandClass: "A",
      },
      {
        id: null,
        bandNumber: "3",
        technology: "LTE",
        dlBandClass: "B",
        ulBandClass: "B",
      },
    ];

    const result = groupBandsByNumberAndTechnology(bands);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("band-1");
    expect(result[1].id).toBe("3-LTE");
  });

  it("handles complex scenario with multiple bands and technologies", () => {
    const bands: Band[] = [
      {
        id: "1",
        bandNumber: "2",
        technology: "LTE",
        dlBandClass: "A",
        ulBandClass: "A",
      },
      {
        id: "2",
        bandNumber: "2",
        technology: "LTE",
        dlBandClass: "C",
        ulBandClass: null,
      },
      {
        id: "3",
        bandNumber: "2",
        technology: "NR",
        dlBandClass: "B",
        ulBandClass: "B",
      },
      {
        id: "4",
        bandNumber: "5",
        technology: "LTE",
        dlBandClass: "A",
        ulBandClass: "A",
      },
    ];

    const result = groupBandsByNumberAndTechnology(bands);

    expect(result).toHaveLength(3);

    const band2LTE = result.find(
      (b) => b.bandNumber === "2" && b.technology === "LTE"
    );
    expect(band2LTE).toMatchObject({
      bandNumber: "2",
      technology: "LTE",
      dlBandClass: "A/C",
      ulBandClass: "A",
    });

    const band2NR = result.find(
      (b) => b.bandNumber === "2" && b.technology === "NR"
    );
    expect(band2NR).toMatchObject({
      bandNumber: "2",
      technology: "NR",
      dlBandClass: "B",
      ulBandClass: "B",
    });

    const band5LTE = result.find(
      (b) => b.bandNumber === "5" && b.technology === "LTE"
    );
    expect(band5LTE).toMatchObject({
      bandNumber: "5",
      technology: "LTE",
      dlBandClass: "A",
      ulBandClass: "A",
    });
  });
});
