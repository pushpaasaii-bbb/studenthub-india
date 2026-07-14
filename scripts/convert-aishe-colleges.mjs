import fs from "node:fs";
import path from "node:path";
import XLSX from "xlsx";

const inputFile = path.join(
  process.cwd(),
  "College-Affiliated College.xlsx"
);

const outputDirectory = path.join(
  process.cwd(),
  "data",
  "imports"
);

const outputFile = path.join(
  outputDirectory,
  "aishe-andhra-affiliated-colleges.csv"
);

if (!fs.existsSync(inputFile)) {
  console.error(
    "Excel file not found. Move College-Affiliated College.xlsx into the main project folder first."
  );
  process.exit(1);
}

const workbook = XLSX.readFile(inputFile);
const firstSheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[firstSheetName];

const rawRows = XLSX.utils.sheet_to_json(sheet, {
  header: 1,
  defval: "",
});

const headerRowIndex = rawRows.findIndex((row) =>
  row.some((cell) =>
    String(cell).trim().toLowerCase().includes("aishe code")
  )
);

if (headerRowIndex === -1) {
  console.error("Could not find the AISHE Code header row.");
  process.exit(1);
}

const headers = rawRows[headerRowIndex].map((header) =>
  String(header).trim().toLowerCase()
);

const getValue = (row, headerName) => {
  const index = headers.findIndex(
    (header) => header === headerName.toLowerCase()
  );

  return index === -1 ? "" : String(row[index] ?? "").trim();
};

const slugify = (value) =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeWebsite = (value) => {
  const website = String(value).trim();

  if (!website) {
    return "";
  }

  if (website.startsWith("http://") || website.startsWith("https://")) {
    return website;
  }

  return `https://${website}`;
};

const sourceUrl =
  "https://dashboard.aishe.gov.in/hedirectory/#/hedirectory";

const convertedRows = rawRows
  .slice(headerRowIndex + 1)
  .map((row) => {
    const aisheCode = getValue(row, "aishe code");
    const name = getValue(row, "name");
    const state = getValue(row, "state");
    const district = getValue(row, "district");
    const website = getValue(row, "website");
    const establishedYear = getValue(
      row,
      "year of establishment"
    );
    const location = getValue(row, "location");
    const collegeType = getValue(row, "college type");
    const management = getValue(row, "management");
    const university = getValue(row, "university");

    if (!aisheCode || !name) {
      return null;
    }

    const slug = `${slugify(name).slice(0, 100)}-${slugify(
      aisheCode
    )}`;

    return {
      name,
      slug,
      college_type: collegeType,
      state,
      city: "",
      university,
      course_types: "",
      naac_grade: "",
      nirf_rank: "",
      average_fees: "",
      average_package: "",
      highest_package: "",
      established_year: establishedYear,
      ownership: management,
      hostel: "false",
      official_website: normalizeWebsite(website),
      description: `Official AISHE directory record. AISHE Code: ${aisheCode}. District: ${district || "Not listed"}. Location: ${location || "Not listed"}.`,
      status: "draft",
      source_name: "AISHE Higher Education Institution Directory",
      source_url: sourceUrl,
      last_verified_at: new Date().toISOString(),
      verification_status: "verified",
    };
  })
  .filter(Boolean);

fs.mkdirSync(outputDirectory, { recursive: true });

const outputSheet = XLSX.utils.json_to_sheet(convertedRows);
const csvContent = XLSX.utils.sheet_to_csv(outputSheet);

fs.writeFileSync(outputFile, csvContent, "utf8");

console.log(
  `Success: converted ${convertedRows.length} official AISHE college records.`
);

console.log(`CSV created at: ${outputFile}`);