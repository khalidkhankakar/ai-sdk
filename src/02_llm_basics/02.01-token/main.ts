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

const decode = (output: number[]) => {
    return tokenizer.decode(output)
}

const input = readFileSync(path.join(import.meta.dirname, 'input.txt'), 'utf-8')

const output = tokenize(input)
const decoded = decode(output)

console.log('Decoded matches input:', decoded === input);

console.log('Content length in characters:', input.length);
console.log(`Number of tokens:`, output.length);
console.dir(output, { depth: null, maxArrayLength: 20 });
