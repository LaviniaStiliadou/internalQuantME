/**
 * Copyright (c) 2021 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

const config = require('../../framework-config');

const gitHandler = require('./git-handler');

const fs = require('fs');

const { readdir } = fs.promises;

/**
 * Retrieve a list of files from a directory.
 *
 * @param {*} directory get files from directory
 * @returns a list of the file items
 */
const getFileList = async (directory) => {
  let files = [];
  const items = await readdir(directory, { withFileTypes: true });

  for (const item of items) {
    if (!item.isDirectory()) {
      files.push(`${directory}/${item.name}`);
    } else {
      files = [
        ...files,
        ...(await getFileList(`${directory}/${item.name}`)),
      ];
    }
  }
  return files;
};

/**
 * Get the currently defined QRMs form the repository
 *
 * @returns {Promise<[QRM]>} an array with the current QRMs
 */
module.exports.getCurrentQRMs = async function() {

  // get all folders of the defined QRM repository which could contain a QRM
  let folders = [];
  let repoPath = config.getQRMRepositoryPath().replace(/^\/|\/$/g, '');
  let QRMs = [];
  if (repoPath) {
    try {
      folders = await gitHandler.getFoldersInRepository(config.getQRMRepositoryUserName(), config.getQRMRepositoryName(), repoPath, config.getGitHubToken());
    } catch (error) {
      throw 'Unable to load QRMs from Github repository with username \''
      + config.getQRMRepositoryUserName() + '\', repository name \'' + config.getQRMRepositoryName() + '\', and path \''
      + config.getQRMRepositoryPath() + '\'. ' + error + '. Please adapt the configuration for a suited repository!';
    }

    // filter invalid folders and retrieve QRMs
    console.log('Found %i folders with QRM candidates!', folders.length);

    for (let i = 0; i < folders.length; i++) {
      let qrm = await getQRM(config.getQRMRepositoryUserName(), config.getQRMRepositoryName(), folders[i], config.getGitHubToken());
      if (qrm != null) {
        QRMs.push(qrm);
      } else {
        console.log('Folder %s does not contain a valid QRM!', folders[i]);
      }
    }
  }

  if (config.getLocalQRMPath()) {
    let localFiles = await getFileList(config.getLocalQRMPath());

    // each qrm consists of one detector and replacement file
    // i represents the detector file, i+1 the replacement file
    for (let i = 0; i < localFiles.length; i = i + 2) {
      const qrmUrl = localFiles[i].substring(0, localFiles[i].indexOf('detector')-1);
      const readDetector = async () => {
        const data = await fs.promises.readFile(localFiles[i], 'utf-8');
        return new Buffer.from(data);
      };
      const readReplacement = async () => {
        const data = await fs.promises.readFile(localFiles[i+1], 'utf-8');
        return new Buffer.from(data);
      };
      let bufferDetector = await readDetector();
      let contentDetector = await bufferDetector.toString('utf-8');
      let bufferReplacement = await readReplacement();
      let contentReplacement = await bufferReplacement.toString('utf-8');
      let localQrm = {
        'qrmUrl': qrmUrl,
        'detector': contentDetector,
        'replacement': contentReplacement
      };
      QRMs.push(localQrm);
    }
  }

  if (!repoPath && !config.getLocalQRMPath()) {
    throw 'Unable to load QRMs from  GitHub and your local directory';
  }

  return QRMs;
};

/**
 * Check whether the QRM at the given URL is valid and return it or otherwise null
 *
 * @param userName the Github username to which the QRM repository belongs
 * @param repoName the Github repository name to load the QRMs from
 * @param qrmUrl the URL to the folder containing the potential QRM
 * @returns the QRM if it is valid or null otherwise
 */
async function getQRM(userName, repoName, qrmUrl, token) {

  // get all files within the QRM folder
  let files = await gitHandler.getFilesInFolder(qrmUrl, token);

  // search for detector and replacement fragment and extract URL
  let detectorUrl = null;
  let replacementUrl = null;
  for (let i = 0; i < files.length; i++) {
    if (files[i].name === 'detector.bpmn') {
      detectorUrl = files[i].download_url;
    }

    if (files[i].name === 'replacement.bpmn') {
      replacementUrl = files[i].download_url;
    }
  }

  // check if both files are available
  if (detectorUrl == null) {
    console.log('QRM on URL %s does not contain a detector.bpmn file which is required!', qrmUrl);
    return null;
  }

  if (replacementUrl == null) {
    console.log('QRM on URL %s does not contain a replacement.bpmn file which is required!', qrmUrl);
    return null;
  }

  // download the content of the detector and replacement fragment and return
  return {
    'qrmUrl': qrmUrl,
    'detector': await gitHandler.getFileContent(detectorUrl),
    'replacement': await gitHandler.getFileContent(replacementUrl)
  };
}
