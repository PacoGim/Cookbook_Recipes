import {
    existsSync,
    readdirSync,
    readFileSync,
    rmSync,
    writeFileSync
} from "fs"

import {
    join as pathJoin,
    extname
} from "path"

import { recipeNameToId } from "./recipe_id.mjs"


const DIRECTORY = "./recipes"

const files = readdirSync(DIRECTORY)
    .filter(file => extname(file) === ".json")
    .sort()


if (files.length === 0)
    throw new Error("No recipes found")


files.forEach((file, idx) => {
    const filePath = pathJoin(DIRECTORY, file)

    const data = readFileSync(filePath, {
        encoding: "utf-8"
    })

    const content = parseJSON(data, file)


    if (typeof content.name !== "string" || !content.name.trim())
        throw new Error(`Recipe ${idx + 1}, name missing`)


    const recipeName = content.name.trim()
    const newId = recipeNameToId(recipeName)


    if (!newId)
        throw new Error(
            `Recipe "${recipeName}" could not be converted to a valid id`
        )


    const newFilename = `${newId}.json`
    const newFilePath = pathJoin(DIRECTORY, newFilename)

    const idChanged = content.id !== newId
    const filenameChanged = file !== newFilename


    if (!idChanged && !filenameChanged)
        return


    if (filenameChanged && existsSync(newFilePath)) {
        throw new Error(
            `Recipe "${recipeName}" cannot be renamed to "${newFilename}" because that file already exists`
        )
    }


    const {
        id: oldId,
        ...recipe
    } = content

    const normalizedContent = {
        id: newId,
        ...recipe
    }


    writeFileSync(
        newFilePath,
        JSON.stringify(normalizedContent, null, 4) + "\n"
    )


    if (filenameChanged)
        rmSync(filePath)


    console.log(`✓ ${recipeName} → ${newId}`)
})


function parseJSON(value, file) {
    try {
        return JSON.parse(value)
    } catch {
        throw new Error(`${file}: invalid JSON format`)
    }
}