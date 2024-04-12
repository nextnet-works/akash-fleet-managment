import { stringify } from "yaml";
import fs from "fs";
export async function loadYAMLFile(filePath: string): Promise<any> {
    try {
      const fileContents = fs.readFileSync(filePath);
      const data = stringify(fileContents);
      return data;
    } catch (error) {
      console.error("Error reading or parsing YAML file:", error);
      throw error;
    }
  }