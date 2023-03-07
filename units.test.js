const Units = require('./units.js');

let unitsSystem;
beforeAll(() => {
  unitsSystem = new Units();
});

// ----------------------------------- Required -------------------------------------------
describe("units - required", () => {
  test("convert length", () => {
    expect(unitsSystem.convert(12, "meter", "millimeter")).toEqual(12000);
    expect(unitsSystem.convert(12, "meter", "centimeter")).toEqual(1200);
    expect(unitsSystem.convert(12, "millimeter", "centimeter")).toEqual(1.2);
  });

  test("format length", () => {
    expect(unitsSystem.format(12, "meter", "millimeter")).toEqual("12000 mm");
    expect(unitsSystem.format(12, "meter", "centimeter")).toEqual("1200 cm");
    expect(unitsSystem.format(12, "millimeter", "centimeter")).toEqual("1.2 cm");
  });

  test("convert mass", () => {
    expect(unitsSystem.convert(12, "kilogram", "gram")).toEqual(12000);
  });

  test("format mass", () => {
    expect(unitsSystem.format(12, "kilogram", "gram")).toEqual("12000 g");
  });

  test("different groups Error", () => {
    expect(() => unitsSystem.convert(12, "kilogram", "centimeter")).toThrow(
      Error
    );
  });

  test("get groups", () => {
    expect(unitsSystem.getGroups()).toEqual(['length', 'mass']);
  });

  test("getUnits", () => {
    expect(unitsSystem.getUnits("mass")).toEqual(["gram", "kilogram", "ton"]);
  });

  //-------------------------------------- Bonus --------------------------------------------
  describe("units - bonus", () => {
    test("formatWithUnits - integers", () => {
      const inputText = 'If we use board narrower by 20 mm, its mass will change by -1000 g.';
      const outputText = 'If we use board narrower by 2 cm, its mass will change by -1 kg.'

      expect(unitsSystem.formatWithUnits(inputText, ["centimeter", "kilogram"])).toEqual(outputText);
    });

    test("formatWithUnits - floats", () => {
      const inputText = 'The length of my car is 4.5 m and it weighs 1.6 t.';
      const outputText = 'The length of my car is 4500 mm and it weighs 1600000 g.'

      expect(unitsSystem.formatWithUnits(inputText, ["millimeter", "gram"])).toEqual(outputText);
    });
  });
});
