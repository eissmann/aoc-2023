import fs from "fs";

export const getFileContent = (filename: string): string => {
    const data = fs.readFileSync(filename)
    return data.toString()
}