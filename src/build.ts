import * as fs from 'fs'
import * as yargs from 'yargs'
import * as http from 'http'
import * as os from 'os'
import * as path from 'path'
import * as unzip from 'unzip'
import { copyFolderRecursiveSync } from './copy'

const options = yargs
    .usage("Usage: -a <api root directory> -a <render root directory> -o <output directory> -s <target os (linux, macos, windows)>")
    .option("a", { alias: "apiRootDir", describe: "Api Root Directory", type: "string", demandOption: true })
    .option("r", { alias: "renderRootDir", describe: "Renderer Root Directory", type: "string", demandOption: true })
    .option("o", { alias: "outDir", describe: "Output Directory", type: "string", demandOption: true })
    .option("s", { alias: "targetOS", describe: "Target OS", type: "string", demandOption: true })
    .argv

const osTempDir = os.tmpdir()
fs.mkdtemp(`${osTempDir}${path.sep}deskgap-builder`, (err, dir) =>
{
    if (err) throw err

    const link = (() =>
    {
        switch (options.s)
        {
            case 'linux':
                return 'https://deskgap.com/dl/linux'
            case 'macos':
                return 'https://deskgap.com/dl/macos'
            case 'windows':
                return 'https://deskgap.com/dl/win32'
        }

        throw new Error(`unkown os target: ${options.s}`)
    })()

    const buildZipPath = `${dir}${path.sep}build-${options.s}.zip`
    if (!fs.existsSync(buildZipPath))
        http.get(link, (response) => response.pipe(fs.createWriteStream(buildZipPath)))

    fs.createReadStream(buildZipPath).pipe(unzip.Extract({ path: options.o }))

    const appOutputPath = `${options.o}${path.sep}resources${path.sep}app`
    
    fs.rmdirSync(appOutputPath, { recursive: true })
    fs.mkdirSync(appOutputPath)

    copyFolderRecursiveSync(options.r, appOutputPath)
    copyFolderRecursiveSync(options.a, appOutputPath)
})
