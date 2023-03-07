module.exports = class Units {
  constructor() {
    this._units = {};
    this.initializeUnits();
  }

  addUnit(unit) {
    this._units[unit.name] = unit;
  }

  initializeUnits() {
    // length
    this.addUnit(new Unit("meter", "m", 1, "length"));
    this.addUnit(new Unit("centimeter", "cm", 0.01, "length"));
    this.addUnit(new Unit("millimeter", "mm", 0.001, "length"));

    // mass
    this.addUnit(new Unit("gram", "g", 1, "mass"));
    this.addUnit(new Unit("kilogram", "kg", 1000, "mass"));
    this.addUnit(new Unit("ton", "t", 1000000, "mass"));
  }

  convert(value, inputUnit, outputUnit) {
    const inputUnitObj = this._units[inputUnit];
    const outputUnitObj = this._units[outputUnit];

    if (inputUnitObj.group !== outputUnitObj.group) {
      throw new Error("Units from different group cannot be converted");
    }

    return (value * inputUnitObj.toBaseCoeff) / outputUnitObj.toBaseCoeff;
  }

  format(value, inputUnit, outputUnit) {
    const convertedValue = this.convert(value, inputUnit, outputUnit);
    return `${convertedValue} ${this._units[outputUnit].symbol}`;
  }

  getUnits(group) {
    return Object.values(this._units)
      .filter((unit) => unit.group === group)
      .map((unit) => unit.name);
  }

  getGroups() {
    const groups = new Set(
      Object.values(this._units).map((unit) => unit.group)
    );
    return Array.from(groups);
  }

  formatWithUnits(inputText, outputUnits) {
    //This is highly overcomplicated,
    //if I had more time I could rewrite this function from the beggining
    const words = inputText.split(" ");
    let i = -1;
    let outputWords = words.map((word, index) => {
      let isComaNeeded = false;
      let isFSNeeded = false;
      const number = parseFloat(word);
      if (!isNaN(number)) {
        i++;
        let unitSymbol = words[index + 1];
        words.splice(index + 1, 1);
        index--;
        if (unitSymbol.includes(",")) {
          unitSymbol = unitSymbol.replace(",", "");
          isComaNeeded = true;
        }
        if (unitSymbol.includes(".")) {
          unitSymbol = unitSymbol.replace(".", "");
          isFSNeeded = true;
        }

        const unit = Object.values(this._units).find(
          (unit) => unit._symbol === unitSymbol
        );
        if (unit) {
          const convertedValue = this.convert(
            number,
            unit.name,
            outputUnits[i]
          );
          if (isComaNeeded) {
            return `${convertedValue} ${this._units[outputUnits[i]].symbol},`;
          }
          if (isFSNeeded) {
            return `${convertedValue} ${this._units[outputUnits[i]].symbol}.`;
          }
          return `${convertedValue} ${this._units[outputUnits[i]].symbol}`;
        }
      }
      return word;
    });
    outputWords = outputWords.join(" ").trim();
    return outputWords;
  }
};

class Unit {
  constructor(name, symbol, toBaseCoeff, group) {
    this._name = name;
    this._symbol = symbol;
    this._toBaseCoeff = toBaseCoeff;
    this._group = group;
  }

  get name() {
    return this._name;
  }

  get symbol() {
    return this._symbol;
  }

  get toBaseCoeff() {
    return this._toBaseCoeff;
  }

  get group() {
    return this._group;
  }
}
