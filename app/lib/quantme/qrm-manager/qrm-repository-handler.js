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
const log = require('../../log')('app:qrm-repository-handler');

// following imports are needed for the isomorphic git library
const isomorphic = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const path = require('path');

// variables for specifying the repository to be cloned, the system path, the repository name and some dir specified later
let qrmRepoWebPath;
let qrmRepoLocalPath;
let qrmRepoLocalName;
let dir;
let stateUrl;

/**
 * Clone the QRM Repository defined by its web path, local path and file name
 *
 * @return {Promise} a state of the cloning
 */
module.exports.cloneQRMRepository = async function() {
  log.info('Cloning started');
  console.log('clone button pressed');
  const currentDir = path.dirname(process.cwd());
  qrmRepoLocalPath = config.getQRMRepositoryLocalPath();
  qrmRepoLocalName = config.getQRMRepositoryLocalName();
  qrmRepoWebPath = config.getQRMRepositoryWebPath();

  try {
    stateUrl = checkRepoUrl(qrmRepoWebPath);
  } catch (err) {
    log.error('Url error: ', err);
    throw err;
  }

  // if no filepath is specified the path in which this program runs is used
  if (qrmRepoLocalPath === '' && stateUrl) {
    dir = path.join(currentDir, qrmRepoLocalName);
    isomorphic.clone({ fs, http, dir, url: qrmRepoWebPath }).then(console.log);
    return true;
  } else {

    // if a path is specified check it and then clone with this path
    try {
      checkRepoLocalPath(qrmRepoLocalPath);
    } catch (err) {
      log.error('Path error: ', err);
      throw err;
    }
    if (stateUrl) {
      dir = path.join(qrmRepoLocalPath, qrmRepoLocalName);
      isomorphic.clone({ fs, http, dir, url: qrmRepoWebPath }).then(console.log);
      return true;
    }
    return false;
  }
};

function checkRepoUrl(path) {

  // check whether it is an actual url
  let url;
  try {
    url = new URL(path);
    console.log('url: ' + url);
  } catch (err) {
    throw 'Url seems to be incorrect or not an actual url \'' + path + '\'';
  }

  // check whether it starts with 'https://github.com/'
  const substring = 'https://github.com/';
  let correctSubstring = path.includes(substring);
  if (correctSubstring === false) {
    throw 'Url doesnt start with github.com';
  } else {
    return true;
  }
}

function checkRepoLocalPath(path) {

  // check whether the path is an actual path on the filesystem
  fs.statSync(path, (err, stats) => {
    if (err) {
      log.error('Incorrect QRM Repository local path',err);
      this.logEntry(err.message, 'ERROR');
      throw 'The path entered as QRM Repository local path is not a path:\'' + path + '\'. ' + err + '\'. ' + 'Please enter a new path';
    } else {
      if (stats.isDirectory()) {
        console.log('a correct path was entered');
      } else {
        log.error('Incorrect QRM Repository local path');
        throw 'The path entered as QRM Repository local path is incorrect:\'' + qrmRepoLocalPath + '\'. ' + 'Please enter a new path';
      }
    }
  });
}
