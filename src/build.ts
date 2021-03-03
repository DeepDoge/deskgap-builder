#!/usr/bin/env node

import * as fs from 'fs'
import * as yargs from 'yargs'
import * as os from 'os'
import * as path from 'path'
import * as adm from 'adm-zip'
import { copyFolderRecursiveSync, removeDir } from './copy'

const options = yargs
    .usage("Usage: -r <root directory> -o <output directory> -s <target os (linux, macos, windows)>")
    .option("r", { alias: "rootDir", describe: "Root Directory", type: "string", demandOption: true })
    .option("o", { alias: "outDir", describe: "Output Directory", type: "string", demandOption: true })
    .option("s", { alias: "targetOS", describe: "Target OS", type: "string", demandOption: true })
    .argv

const dir = path.join(os.tmpdir(), 'deskgap-builder', 'dl')
if (!fs.existsSync(dir)) fs.mkdirSync(dir)

const link = (() =>
{
    switch (options.s)
    {
        case 'linux':
            return 'https://dl.bintray.com/patr0nus/DeskGap/deskgap-v0.2.0-linux-x64.zip'
        case 'macos':
            return 'https://dl.bintray.com/patr0nus/DeskGap/deskgap-v0.2.0-darwin-x64.zip'
        case 'windows':
            return 'https://dl.bintray.com/patr0nus/DeskGap/deskgap-v0.2.0-win32-ia32.zip'
    }

    throw new Error(`unkown os target: ${options.s}`)
})()

const buildZipPath = path.join(dir, `build-${options.s}.zip`)
if (!fs.existsSync(buildZipPath))
{
    fs.writeFileSync(buildZipPath, require('child_process').execFileSync('curl', ['--silent', '-L', link]))
}

if (fs.existsSync(options.o)) removeDir(options.o)
new adm(buildZipPath).extractAllTo(options.o)

const appOutputPath = path.join(options.o, 'DeskGap', 'resources', 'app')

const pack = JSON.parse(fs.readFileSync('package.json', { encoding: 'utf-8' }))
const appPack = {
    name: pack.name,
    main: 'main.js'
}


removeDir(appOutputPath)
fs.mkdirSync(appOutputPath)

copyFolderRecursiveSync(options.r, appOutputPath, true)
fs.writeFileSync(path.join(appOutputPath, 'package.json'), JSON.stringify(appPack))