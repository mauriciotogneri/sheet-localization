
// =========================================== IMPORT =========================================== \\

function onOpen()
{
  SpreadsheetApp.getUi().createMenu('Localization')
    .addItem('Import', 'showImportDialog')
    .addItem('Info', 'showInfoDialog')
    .addToUi()
}

function showImportDialog()
{
  const output = HtmlService
    .createTemplateFromFile('import')
    .evaluate()
  
  SpreadsheetApp.getUi().showModalDialog(output, 'Import')
}

function showInfoDialog()
{
  const output = HtmlService
    .createTemplateFromFile('info')
    .evaluate()
  
  SpreadsheetApp.getUi().showModalDialog(output, 'Info')
}

function performImport(languageIndex, providerIndex, content, replace)
{
  const languages = getAvailableLanguages()
  const providers = getAvailableProviders()
  
  const json = providers[providerIndex].import(content)
  languages[languageIndex].import(json, replace)
  
  return true
}

function getInfo()
{
  const sheet = getSheet()
  const rows = sheet.getMaxRows()
  const languages = getAvailableLanguages()
  const statistics = []
  
  for (var index in languages)
  {
    var language = languages[index]
    var col = language.columnIndex
    
    var total = 0
    var translated = 0
    var validated = 0
    
    for (var i = 2; i <= rows; i++)
    {
      var cell = sheet.getRange(i, col)
      var value = cell.getValue().toString()
      var background = cell.getBackground()
      
      if (value != '')
      {
        translated++
      }
      
      if (background == '#ffffff')
      {
        validated++
      }
      
      total++
    }
    
    statistics.push({
      language: language,
      translated: translated,
      validated: validated,
      total: total  
    })
  }
  
  return {
    token: getToken(),
    url: ScriptApp.getService().getUrl(),
    statistics: statistics
  }
}

// =========================================== EXPORT =========================================== \\

function doGet(request)
{
  const locale   = request.parameter.locale
  const format   = request.parameter.format
  const token    = request.parameter.token
  
  if (token == getToken())
  {
    const language = getLanguage(locale)
    const provider = getProvider(format)
  
    const output = ContentService.createTextOutput()
    output.setMimeType(provider.mimeType)
    output.downloadAsFile(provider.fileName(locale))
    output.setContent(provider.export(language.export(), language.locale))
  
    return output
  }
}

// =========================================== LANGUAGE =========================================== \\

function Language(input, columnIndex)
{
  const parts = input.split('(')
  this.name   = parts[0].trim()
  this.locale = parts[1].trim()
  this.locale = this.locale.substring(0, this.locale.length - 1)
  this.columnIndex = columnIndex
  
  var keyRow = function(key)
  {
    const data  = getValues()
    
    for (var i = 1; i < data.length; i++)
    {
      if (key == data[i][0])
      {
        return (i + 1)
      }
    }
    
    return -1
  }
  
  this.import = function(json, replace)
  {
    const sheet = getSheet()
    
    for (var key in json)
    {
      if (json.hasOwnProperty(key))
      {
        var row = keyRow(key)
        
        if (row != -1)
        {
          if (replace)
          {
            var cell = sheet.getRange(row, this.columnIndex)
            cell.setValue(json[key])
          }
        }
        else
        {
          var newRow = [key]
          var languages = getAvailableLanguages()
          
          for (var i = 1; i <= languages.length; i++)
          {
            if ((i + 1) == this.columnIndex)
            {
              newRow[i] = json[key]
            }
            else
            {
              newRow[i] = ''
            }
          }
          
          sheet.appendRow(newRow)
        }
      }
    }
  }
  
  this.export = function()
  {
    const data  = getValues()
    const json  = {}
    
    for (var i = 1; i < data.length; i++)
    {
      var key   = data[i][0]
      var value = data[i][this.columnIndex - 1]
      
      json[key.toString()] = value.toString()
    }
    
    return json
  }
}

// =========================================== ANDROID =========================================== \\

function AndroidProvider()
{
  this.name = 'Android'
  this.mimeType = ContentService.MimeType.XML
  
  this.fileName = function(locale)
  {
    return 'strings-' + locale + '.xml'
  }
  
  this.import = function(input)
  {
    // TODO
    return {}
  }
  
  this.export = function(json, locale)
  {
    var result = '<?xml version="1.0" encoding="utf-8"?>\n'
    result += '<resources>'
    
    for (var key in json)
    {
      if (json.hasOwnProperty(key))
      {
        result += '\n\n\t<string name="' + key + '">' + transformParametersDefault(json[key]) + '</string>'
      }
    }
    
    result += '\n\n</resources>'
    
    return result
  }
}

// =========================================== IOS =========================================== \\

function iOSProvider()
{
  this.name = 'iOS'
  this.mimeType = ContentService.MimeType.TEXT
  
  this.fileName = function(locale)
  {
    return 'Localizable-' + locale + '.strings'
  }
  
  this.import = function(input)
  {
    // TODO
    return {}
  }
  
  this.export = function(json, locale)
  {
    var result = ''
    
    for (var key in json)
    {
      if (json.hasOwnProperty(key))
      {
        if (result != '')
        {
          result += '\n\n'
        }
        
        result += '"' + key + '": "' + transformParameters(json[key], function(match) { return '%' + match[1] + '$@' }) + '";'
      }
    }
    
    return result
  }
}

// =========================================== JSON =========================================== \\

function JsonProvider()
{
  this.name = 'JSON'
  this.mimeType = ContentService.MimeType.JSON
  
  this.fileName = function(locale)
  {
    return locale + '.json'
  }
  
  this.import = function(input)
  {
    return JSON.parse(input)
  }
  
  this.export = function(json, locale)
  {
    for (var key in json)
    {
      if (json.hasOwnProperty(key))
      {
        json[key] = transformParametersDefault(json[key])
      }
    }
    
    return JSON.stringify(json, null, 4)
  }
}

// =========================================== YAML =========================================== \\

function YamlProvider()
{
  this.name = 'YAML'
  this.mimeType = ContentService.MimeType.TEXT
  
  this.fileName = function(locale)
  {
    return locale + '.yaml'
  }
  
  this.import = function(input)
  {
    // TODO
    return {}
  }
  
  this.export = function(json, locale)
  {
    var result = ''
    
    for (var key in json)
    {
      if (json.hasOwnProperty(key))
      {
        if (result != '')
        {
          result += '\n\n'
        }
        
        result += key + ': ' + transformParametersDefault(json[key])
      }
    }
    
    return result
  }
}

// =========================================== XLIFF =========================================== \\

function XliffProvider()
{
  this.name = 'XLIFF'
  this.mimeType = ContentService.MimeType.XML
  
  this.fileName = function(locale)
  {
    return locale + '.xml'
  }
  
  this.import = function(input)
  {
    // TODO
    return {}
  }
  
  this.export = function(json, locale)
  {
    var result = '<?xml version="1.0" encoding="utf-8"?>\n'
    result += '<xliff xmlns="urn:oasis:names:tc:xliff:document:1.2" version="1.2">\n'
    result += '\t<file original="global" datatype="plaintext" source-language="' + locale + '" target-language="' + locale + '">\n'
    result += '\t\t<body>\n'
    
    for (var key in json)
    {
      if (json.hasOwnProperty(key))
      {
        var value = transformParametersDefault(json[key])
        
        result += '\t\t\t<trans-unit id="' + key + '">\n'
        result += '\t\t\t\t<source xml:lang="' + locale + '">' + value + '</source>\n'
        result += '\t\t\t\t<target xml:lang="' + locale + '">' + value + '</target>\n'
        result += '\t\t\t</trans-unit>\n'
      }
    }
    
    result += '\t\t</body>\n'
    result += '\t</file>\n'
    result += '</xliff>'
    
    return result
  }
}

// =========================================== UTILS =========================================== \\

function getProvider(format)
{
  if (format == 'android')
  {
    return new AndroidProvider()
  }
  else if (format == 'ios')
  {
    return new iOSProvider()
  }
  else if (format == 'json')
  {
    return new JsonProvider()
  }
  else if (format == 'yaml')
  {
    return new YamlProvider()
  }
  else if (format == 'xliff')
  {
    return new XliffProvider()
  }
  else
  {
    throw 'Invalid format: ' + format
  }
}

function transformParameters(value, transformer)
{
  var result  = value
  var REGEX   = /{([0-9]+)\$([sdf])}/
  var match   = null
  var counter = 1

  while (match = REGEX.exec(result))
  {
    result = result.replace(REGEX, transformer(match))
  }

  return result
}

function transformParametersDefault(value)
{
  return transformParameters(value, function(match) { return '%' + match[1] + '$' + match[2] })
}

function getAvailableProviders()
{
    return [
      new AndroidProvider(),
      new iOSProvider(),
      new JsonProvider(),
      new YamlProvider(),
      new XliffProvider()
    ]
}

function getLanguage(locale)
{
  const languages = getAvailableLanguages()
  
  for (var i = 0; i < languages.length; i++)
  {
    var language = languages[i]
        
    if (language.locale == locale)
    {
      return language
    }
  }
  
  throw 'Invalid locale: ' + locale
}

function getAvailableLanguages()
{
    const header = getValues()[0]
    const result = []
    
    for (var i = 1; i < header.length; i++)
    {
        var cell = header[i]
        
        result.push(new Language(cell, (i + 1)))
    }
  
    return result
}

function getIndexedList(values)
{
  const result = []
  
  for (var i = 0; i < values.length; i++)
  {
    result.push((i + 1) + ': ' + values[i])
  }
  
  return result.join('\n')
}

function getSheet()
{
  return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
}

function getValues()
{
  return getSheet().getDataRange().getValues()
}

// =========================================== TOKEN =========================================== \\

function getToken()
{
  return ''
}