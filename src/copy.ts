import * as fs from 'fs'
import * as path from 'path'

export function copyFileSync(source: string, target: string)
{

    var targetFile = target

    // If target is a directory, a new file with the same name will be created
    if (fs.existsSync(target))
    {
        if (fs.lstatSync(target).isDirectory())
        {
            targetFile = path.join(target, path.basename(source))
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source))
}

export const removeDir = (dirPath: string) =>
{
    const files = fs.readdirSync(dirPath)
    if (files.length === 0) return

    for (const filename of files)
    {
        const filePath = path.join(dirPath, filename)
        if (fs.statSync(filePath).isDirectory()) removeDir(filePath)
        else fs.unlinkSync(filePath)
    }

    fs.rmdirSync(dirPath)
}

export function copyFolderRecursiveSync(source: string, target: string, ignoreEntryDir = false)
{
    var files = []

    // Check if folder needs to be created or integrated
    var targetFolder = ignoreEntryDir ? target : path.join(target, path.basename(source))   
    if (!fs.existsSync(targetFolder))
    {
        fs.mkdirSync(targetFolder)
    }

    // Copy
    if (fs.lstatSync(source).isDirectory())
    {
        files = fs.readdirSync(source)
        files.forEach(function (file)
        {
            var curSource = path.join(source, file)
            if (fs.lstatSync(curSource).isDirectory())
            {
                copyFolderRecursiveSync(curSource, targetFolder)
            } else
            {
                copyFileSync(curSource, targetFolder)
            }
        })
    }
}