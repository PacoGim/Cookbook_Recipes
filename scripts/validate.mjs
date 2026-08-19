import { readdirSync, readFileSync } from "fs"
import { join as pathJoin, extname } from "path"

const DIRECTORY = "./recipes"
const recipesPath = readdirSync(DIRECTORY)

const files = recipesPath
    .filter(file => extname(file) === ".json")

const ids = new Set()

if (files.length === 0)
    throw new Error("No recipes found")

files.forEach((file, idx) => {
    const filePath = pathJoin(DIRECTORY, file)
    const data = readFileSync(filePath, { encoding: "utf-8" })
    const content = parseJSON(data)

    if (typeof content.name !== "string" || !content.name.trim())
        throw new Error(`Recipe ${idx + 1} name missing`)

    const recipeName = content.name

    if (typeof content.id !== "string" || !content.id.trim())
        throw new Error(`Recipe ${recipeName}, id missing`)

    if (ids.has(content.id))
        throw new Error(`Recipe ${recipeName}, id duplicated`)

    ids.add(content.id)

    if (`${content.id}.json` !== file)
        throw new Error(`Recipe ${recipeName}, file name should be ${content.id}.json`)

    if (content?.steps === undefined || content?.steps?.length === 0)
        throw new Error(`Recipe ${recipeName}, steps are missing`)

    if (!Array.isArray(content.steps))
        throw new Error(`Recipe ${recipeName}, steps must be an array`)


    if (content?.ingredients === undefined || content?.ingredients?.length === 0)
        throw new Error(`Recipe ${recipeName}, ingredients are missing`)

    if (!Array.isArray(content.ingredients))
        throw new Error(`Recipe ${recipeName}, ingredients must be an array`)

    content.ingredients.forEach(ingredient => {
        if (typeof ingredient.name !== "string")
            throw new Error(`Recipe ${recipeName}, ingredient is missing a name`)
    })
})

console.log(`${files.length} recipes validated`)

function parseJSON(value) {
    try {
        return JSON.parse(value)
    } catch (e) {
        throw new Error("Invalid JSON format")
    }
}