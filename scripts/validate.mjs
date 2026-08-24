import {
    readdirSync,
    readFileSync
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

const ids = new Set()


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
    const expectedId = recipeNameToId(recipeName)


    if (typeof content.id !== "string" || !content.id.trim())
        throw new Error(`Recipe "${recipeName}", id missing`)


    if (content.id !== expectedId) {
        throw new Error(
            `Recipe "${recipeName}", id should be "${expectedId}"`
        )
    }


    if (ids.has(content.id))
        throw new Error(`Recipe "${recipeName}", id duplicated`)

    ids.add(content.id)


    if (`${content.id}.json` !== file) {
        throw new Error(
            `Recipe "${recipeName}", file name should be "${content.id}.json"`
        )
    }


    if (!Array.isArray(content.steps))
        throw new Error(`Recipe "${recipeName}", steps must be an array`)

    if (content.steps.length === 0)
        throw new Error(`Recipe "${recipeName}", steps are missing`)


    content.steps.forEach((step, stepIdx) => {
        if (typeof step !== "string" || !step.trim()) {
            throw new Error(
                `Recipe "${recipeName}", step ${stepIdx + 1} is invalid`
            )
        }
    })


    if (!Array.isArray(content.ingredients))
        throw new Error(`Recipe "${recipeName}", ingredients must be an array`)

    if (content.ingredients.length === 0)
        throw new Error(`Recipe "${recipeName}", ingredients are missing`)


    content.ingredients.forEach((ingredient, ingredientIdx) => {
        if (
            typeof ingredient !== "object" ||
            ingredient === null ||
            typeof ingredient.name !== "string" ||
            !ingredient.name.trim()
        ) {
            throw new Error(
                `Recipe "${recipeName}", ingredient ${ingredientIdx + 1} is missing a name`
            )
        }


        if (
            ingredient.qty !== undefined &&
            (
                typeof ingredient.qty !== "number" ||
                !Number.isFinite(ingredient.qty) ||
                ingredient.qty < 0
            )
        ) {
            throw new Error(
                `Recipe "${recipeName}", ingredient "${ingredient.name}" has an invalid quantity`
            )
        }
    })


    validateTime(content.prepTime, "prepTime", recipeName)
    validateTime(content.cookTime, "cookTime", recipeName)


    if (
        typeof content.servings !== "number" ||
        !Number.isFinite(content.servings) ||
        content.servings <= 0
    ) {
        throw new Error(
            `Recipe "${recipeName}", servings must be a positive number`
        )
    }


    if (content.serveWith !== undefined) {
        if (!Array.isArray(content.serveWith)) {
            throw new Error(
                `Recipe "${recipeName}", serveWith must be an array`
            )
        }

        content.serveWith.forEach((value, serveWithIdx) => {
            if (typeof value !== "string" || !value.trim()) {
                throw new Error(
                    `Recipe "${recipeName}", serveWith item ${serveWithIdx + 1} is invalid`
                )
            }
        })
    }
})


console.log(`✓ Validated ${files.length} recipes`)


function validateTime(value, property, recipeName) {
    if (value === undefined)
        return

    if (
        typeof value !== "number" ||
        !Number.isFinite(value) ||
        value < 0
    ) {
        throw new Error(
            `Recipe "${recipeName}", ${property} must be a positive number or zero`
        )
    }
}


function parseJSON(value, file) {
    try {
        return JSON.parse(value)
    } catch {
        throw new Error(`${file}: invalid JSON format`)
    }
}