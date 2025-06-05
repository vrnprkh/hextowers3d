// BASIC HEX COLORS (non pancake)

export const basicTheme = {
  face: {
    normal: "#ecba85",
    hovered: "#e69f65",
    indicator: "#d98957",
  },
  side: {
    normal: "#d4a777",
    hovered: "#cc8d5a",
    indicator: "#bf784d",
  },
};

// PANCAKE HEX COLORING
const YELLOW_COLORS: { [key: string]: string } = {
  "50": "#fdf9ea",
  "100": "#faeeca",
  "200": "#f6e09b",
  "300": "#f0c850",
  "400": "#e4b114",
  "500": "#9e7a0e",
  "600": "#785d0b",
  "700": "#614b08",
  "800": "#4e3c07",
  "900": "#403106",
  "950": "#1f1803",
};

const BLUE_COLORS: { [key: string]: string } = {
  "50": "#eefbfe",
  "100": "#dbf6fd",
  "200": "#b9edfc",
  "300": "#83dffa",
  "400": "#2bc8f6",
  "500": "#09a3d0",
  "600": "#0894bd",
  "700": "#05627d",
  "800": "#044f65",
  "900": "#034051",
  "950": "#02212a",
};

const RED_COLORS: { [key: string]: string } = {
  "50": "#fef5f4",
  "100": "#fde9e6",
  "200": "#fbd5ce",
  "300": "#f7b5a9",
  "400": "#f2806c",
  "500": "#ed5034",
  "600": "#e43414",
  "700": "#a7260f",
  "800": "#861f0c",
  "900": "#6a1809",
  "950": "#360c05",
};

const colorNumbers = ["600", "500", "400", "300", "200"];
const hoverColorNumbers = ["600", "500", "400", "300", "200"];
const indicatorColorNumbers = ["700", "600", "500", "400", "300"];

export const pancakeNormals = colorNumbers.map((s) => YELLOW_COLORS[s]);
export const pancakeHovers = hoverColorNumbers.map((s) => BLUE_COLORS[s]);
export const pancakeIndicators = indicatorColorNumbers.map(
  (s) => RED_COLORS[s]
);
