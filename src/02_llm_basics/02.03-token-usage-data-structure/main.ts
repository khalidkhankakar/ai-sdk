import {Tiktoken} from "js-tiktoken/lite"
import o200k_base from 'js-tiktoken/ranks/o200k_base'
import { readFileSync } from "node:fs"
import path from "node:path"


const tokenizer = new Tiktoken(
    o200k_base
)

const tokenize = (text: string) => {
    return tokenizer.encode(text)
}


const inputTxt = readFileSync(path.join(import.meta.dirname, 'input.txt'), 'utf-8')
const inputMd = readFileSync(path.join(import.meta.dirname, 'input.md'), 'utf-8')
const inputJSON = readFileSync(path.join(import.meta.dirname, 'input.json'), 'utf-8')
const inputXML = readFileSync(path.join(import.meta.dirname, 'input.xml'), 'utf-8')

const outputTxt = tokenize(inputTxt)
const outputMd = tokenize(inputMd)
const outputJSON = tokenize(inputJSON)
const outputXML = tokenize(inputXML)



console.log()
console.log('------------------TOKEN LENGTH--------------------')
console.log('Text token length:', outputTxt.length)
console.log('--------------------------------------')
console.log('Markdown token length:', outputMd.length)
console.log('--------------------------------------')
console.log('JSON token length:', outputJSON.length)
console.log('--------------------------------------')
console.log('XML token length:', outputXML.length)