const hummus = require('@sketchdeck/hummus')
const download = require('download-file')
const fs = require('fs')
const request = require('request')
const rp = require('request-promise')
const PDFRHttpStream = require('./PDFRHttpStream')

const dlDir = './pdfs'

const options = {
  directory: dlDir
}

const fadedImgSinglePageUrl =
  'https://cdn.filestackcontent.com/hvASe7dCSWie5LHweKGP'
const bullpenFullUrl = 'https://cdn.filestackcontent.com/vIYekqhRl62dKqtspWzM'
const myMadeUpOne = 'https://cdn.filestackcontent.com/KxUVHwOvTx6591fn0sdE'

const url = bullpenFullUrl

const fnameArr = url.split('/')
const fname = fnameArr[fnameArr.length - 1]

var mTabLevel = 0
var mIteratedObjectIDs = {}

// transparency preflight counts
var caCount = 0
var transGroupCount = 0
var devRGBTransCount = 0

var outputFile = fs.openSync('./parseLog.txt', 'w')
function logToFile(inString) {
  fs.writeSync(outputFile, addTabs() + inString + '\r\n')
}

function addTabs() {
  var output = ''
  for (var i = 0; i < mTabLevel; ++i) {
    output += ' '
  }
  return output
}

function keyValueMatchNameObj(element, dict, key, value) {
  return (
    element.toLowerCase() === key && dict.queryObject(element).value === value
  )
}

function iterateObjectTypes(inObject, inReader) {
  var output = ''

  if (inObject.getType() == hummus.ePDFObjectIndirectObjectReference) {
    output += 'Indirect object reference:'
    logToFile(output)
    var objectID = inObject.toPDFIndirectObjectReference().getObjectID()
    if (!mIteratedObjectIDs.hasOwnProperty(objectID)) {
      mIteratedObjectIDs[objectID] = true
      iterateObjectTypes(inReader.parseNewObject(objectID), inReader)
    }
    for (var i = 0; i < mTabLevel; ++i) {
      output += ' '
    }
    output += 'was parsed already'
    logToFile(output)
  } else if (inObject.getType() == hummus.ePDFObjectArray) {
    output += hummus.getTypeLabel(inObject.getType())
    logToFile(output)
    ++mTabLevel
    inObject
      .toPDFArray()
      .toJSArray()
      .forEach(function(element, index, array) {
        iterateObjectTypes(element, inReader)
      })
    --mTabLevel
  } else if (inObject.getType() == hummus.ePDFObjectDictionary) {
    output += hummus.getTypeLabel(inObject.getType())
    logToFile(output)
    ++mTabLevel
    var aDictionary = inObject.toPDFDictionary().toJSObject()

    Object.getOwnPropertyNames(aDictionary).forEach(function(
      element,
      index,
      array
    ) {
      logToFile(
        element + ' ~ ' + inObject.toPDFDictionary().queryObject(element)
      )

      // detect transparency method 1
      if (
        element.toLowerCase() === 'ca' &&
        inObject.toPDFDictionary().queryObject(element) < 1.0
      ) {
        caCount += 1
      } else if (
        keyValueMatchNameObj(
          element,
          inObject.toPDFDictionary(),
          'name',
          'group'
        )
      ) {
        // method 2
        transGroupCount += 1
      }
      // } else if (
      //   element.toLowerCase() === 'cs' &&
      //   inObject.toPDFDictionary().queryObject(element).value === 'DeviceRGB' &&
      //   inObject.toPDFDictionary().exists('S') &&
      //   inObject.toPDFDictionary().queryObject('S').value === 'Transparency'
      // ) {
      //   devRGBTransCount += 1
      // }

      iterateObjectTypes(aDictionary[element], inReader)
    })
    --mTabLevel
  } else if (inObject.getType() == hummus.ePDFObjectStream) {
    output += 'Stream . iterating stream dictionary:'
    logToFile(output)
    iterateObjectTypes(inObject.toPDFStream().getDictionary(), inReader)
  } else {
    output += hummus.getTypeLabel(inObject.getType())
    if (inObject.value !== undefined) {
      logToFile(output + ' ~ ' + inObject.value)
    }
  }
}

download(url, options, function(err) {
  if (err) {
    console.log('ERROR: ', err)
  } else {
    const relPath = dlDir + '/' + fname
    const pdfReader = hummus.createReader(relPath)

    console.log('got reader for ' + relPath)
    var catalog = pdfReader.queryDictionaryObject(
      pdfReader.getTrailer(),
      'Root'
    )
    iterateObjectTypes(catalog, pdfReader)
    fs.closeSync(outputFile)

    console.log('CA Count', caCount)
    console.log('Trans group count', transGroupCount)
    // console.log('DevRGB Trans Count', devRGBTransCount)
  }
})

//const pdfReader = hummus.createReader(new PDFRHttpStream(request(url)))
