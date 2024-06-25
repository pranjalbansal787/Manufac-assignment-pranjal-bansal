// src/dataProcessor.ts

// Interface for the MaxMinTableEntry representing data for maximum and minimum crop production by year
export interface MaxMinTableEntry {
    year: string;
    maxCrop: string;
    minCrop: string;
  }
  
  // Interface for the AvgTableEntry representing average yield and cultivation area per crop
  export interface AvgTableEntry {
    crop: string;
    avgYield: number;
    avgArea: number;
  }
  
  // Interface representing each entry in the original JSON data
  interface CropData {
    Country: string;
    Year: string;
    "Crop Name": string;
    "Crop Production (UOM:t(Tonnes))": number;
    "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))": number;
    "Area Under Cultivation (UOM:Ha(Hectares))": number;
  }
  
  // Function to process the JSON data and calculate max-min table and average table
  export const processData = (data: string) => {
    // Parse the JSON data string into an array of CropData objects
    const jsonData: CropData[] = JSON.parse(data);
  
    // Array to store max-min table entries
    const maxMinTable: MaxMinTableEntry[] = [];
  
    // Map to accumulate data for calculating averages
    const avgTableMap: { [key: string]: { totalYield: number, totalArea: number, count: number } } = {};
  
    // Iterate over each entry in the JSON data
    jsonData.forEach((entry: CropData) => {
      const year = entry.Year;
      const crop = entry["Crop Name"];
      const production = entry["Crop Production (UOM:t(Tonnes))"];
      const yieldPerHa = entry["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"];
      const area = entry["Area Under Cultivation (UOM:Ha(Hectares))"];
  
      // Max-Min table calculations
      let yearEntry = maxMinTable.find(item => item.year === year);
      if (!yearEntry) {
        // Initialize year entry if it doesn't exist
        yearEntry = { year, maxCrop: crop, minCrop: crop };
        maxMinTable.push(yearEntry);
      }
  
      // Update max crop if current production is greater
      const maxCropEntry = jsonData.find(item => item["Crop Name"] === yearEntry.maxCrop && item.Year === year);
      if (maxCropEntry && production > maxCropEntry["Crop Production (UOM:t(Tonnes))"]) {
        yearEntry.maxCrop = crop;
      }
  
      // Update min crop if current production is lesser
      const minCropEntry = jsonData.find(item => item["Crop Name"] === yearEntry.minCrop && item.Year === year);
      if (minCropEntry && production < minCropEntry["Crop Production (UOM:t(Tonnes))"]) {
        yearEntry.minCrop = crop;
      }
  
      // Average table calculations
      if (!avgTableMap[crop]) {
        // Initialize crop entry if it doesn't exist in the map
        avgTableMap[crop] = { totalYield: 0, totalArea: 0, count: 0 };
      }
      // Accumulate total yield, total area, and count for averaging
      avgTableMap[crop].totalYield += yieldPerHa;
      avgTableMap[crop].totalArea += area;
      avgTableMap[crop].count += 1;
    });
  
    // Calculate average yield and average area for each crop
    const avgTable: AvgTableEntry[] = Object.keys(avgTableMap).map(crop => ({
      crop,
      avgYield: avgTableMap[crop].totalYield / avgTableMap[crop].count,
      avgArea: avgTableMap[crop].totalArea / avgTableMap[crop].count
    }));
  
    // Return the calculated max-min table and average table
    return { maxMinTable, avgTable };
  };
  