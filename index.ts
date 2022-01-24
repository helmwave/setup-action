import * as util from 'util'
import * as os from 'os'
import * as fs from 'fs'
import * as path from 'path'

import * as core from '@actions/core'
import * as cache from '@actions/tool-cache'

const toolName = 'helmwave'


export async function run() {
    let version = core.getInput('version', { 'required': true })
    let cachedPath = await download(version)
    console.log(`Helmwave tool version: '${version}' has been cached at ${cachedPath}`)
    core.setOutput('path', cachedPath)

    if (!process.env['PATH'].startsWith(path.dirname(cachedPath))) {
        core.addPath(path.dirname(cachedPath))
    }
}

export function getURL(version: string): string {
    switch (os.type()) {
        case 'Linux':
            return util.format('https://github.com/helmwave/helmwave/releases/download/v%s/helmwave_%s_linux_amd64.tar.gz', version, version)

        case 'Darwin':
            return util.format('https://github.com/helmwave/helmwave/releases/download/v%s/helmwave_%s_darwin_amd64.tar.gz', version, version)

        case 'Windows_NT':
        default:
            return util.format('https://github.com/helmwave/helmwave/releases/download/v%s/helmwave_%s_windows_amd64.zip', version, version)
    }
}

export async function download(version: string): Promise<string> {
    let cached = cache.find(toolName, version)
    let url = getURL(version)

    if (!cached) {
        let downloadPath
        try {
            downloadPath = await cache.downloadTool(url)
        } catch (exception) {
            throw new Error(util.format("Failed to download Helmwave from location", url))
        }

        fs.chmodSync(downloadPath, '777')
        const untarPath = await cache.extractTar(downloadPath)
        cached = await cache.cacheDir(untarPath, toolName, version)
    }

    const pathBin = findBin(cached)
    if (!pathBin) {
        throw new Error(util.format("Helmwave executable not found in path", cached))
    }

    fs.chmodSync(pathBin, '777')
    return pathBin
}

export function findBin(rootDir: string): string {
    fs.chmodSync(rootDir, '777')
    let fileList: string[] = []
    walkSync(rootDir, fileList, toolName + getExecutableExtension())
    if (!fileList || fileList.length == 0) {
        throw new Error(util.format("Helmwave executable not found in path", rootDir))
    }
    else {
        return fileList[0]
    }
}

export function getExecutableExtension(): string {
    if (os.type().match(/^Win/)) {
        return '.exe'
    }
    return ''
}

export var walkSync = function (dir, fileList, fileToFind) {
    let files = fs.readdirSync(dir)
    fileList = fileList || []
    files.forEach(function (file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            fileList = walkSync(path.join(dir, file), fileList, fileToFind)
        }
        else {
            core.debug(file)
            if (file == fileToFind) {
                fileList.push(path.join(dir, file))
            }
        }
    })
    return fileList
}

run().catch(core.setFailed)
