import { readdirSync, readFileSync, writeFileSync, rmSync, mkdirSync, cpSync } from "fs"
import { join as pathJoin, extname } from "path"

const DIRECTORY = "./recipes"
const OUTPUT = "./dist"
const recipesPath = readdirSync(DIRECTORY)

rmSync(OUTPUT, {
    recursive: true,
    force: true
})

mkdirSync(OUTPUT, {
    recursive: true
})

cpSync(DIRECTORY, `${OUTPUT}/recipes`, {
    recursive: true
})

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

console.log(`✓ Built ${recipes.length} recipes`);

function parseJSON(value) {
    try {
        return JSON.parse(value)
    } catch (e) {
        throw new Error("Invalid JSON format")
    }
}