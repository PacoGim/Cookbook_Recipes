import { readdirSync, readFileSync, writeFileSync, rmSync, mkdirSync, cpSync } from "fs"
import { join as pathJoin, extname } from "path"

const DIRECTORY = "./recipes"
const recipesPath = readdirSync(DIRECTORY)

const files = recipesPath
    .filter(file => extname(file) === ".json")

const ids = new Set()
const index = []

if (files.length === 0)
    throw new Error("No recipes found")

files.forEach((file, idx) => {
    const filePath = pathJoin(DIRECTORY, file)
    const data = readFileSync(filePath, { encoding: "utf-8" })
    const content = parseJSON(data)
    index.push({
        name: content.name,
        id: content.id
    })
})

writeFileSync("index.json", JSON.stringify(index))

console.log(`✓ Built ${files.length} recipes`);

function parseJSON(value) {
    try {
        return JSON.parse(value)
    } catch (e) {
        throw new Error("Invalid JSON format")
    }
}