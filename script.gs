
// =========================================== IMPORT =========================================== \\

function onOpen()
{
  SpreadsheetApp.getUi().createMenu('Localization')
      .addItem('Import', 'selectLocale')
      .addItem('Info', 'showInfo')
      .addToUi();
}

function selectLocale()
{
  const languages = getAvailableLanguages()
  const locales = languages.map(function(e) { return e.name })
  const ui = SpreadsheetApp.getUi()
  const response = ui.prompt('Select language', getIndexedList(locales) + '\n\n', ui.ButtonSet.OK_CANCEL)

  if (response.getSelectedButton() == ui.Button.OK)
  {
    const index = parseInt(response.getResponseText())
    
    if ((index >= 1) && (index <= locales.length))
    {
      selectFormat(languages[index - 1])
    }
    else 
    {
      ui.alert('Invalid index: ' + index)
    }
  }
}

function selectFormat(language)
{
  const providers = getAvailableProviders()
  const formats = providers.map(function(e) { return e.name })
  const ui = SpreadsheetApp.getUi()
  const response = ui.prompt('Select format', getIndexedList(formats) + '\n\n', ui.ButtonSet.OK_CANCEL)

  if (response.getSelectedButton() == ui.Button.OK)
  {
    const index = parseInt(response.getResponseText())
    
    if ((index >= 1) && (index <= formats.length))
    {
      selectContent(language, providers[index - 1])
    }
    else 
    {
      ui.alert('Invalid index: ' + index)
    }
  }
}

function selectContent(language, provider)
{
  const ui = SpreadsheetApp.getUi()
  const response = ui.prompt('Enter content', '', ui.ButtonSet.OK_CANCEL)

  if (response.getSelectedButton() == ui.Button.OK)
  {
    const content = response.getResponseText()
    
    if (content != '')
    {
      const json = provider.import(content)
      language.import(json)
      
      ui.alert('Import completed', '', ui.ButtonSet.OK)
    }
    else 
    {
      ui.alert('Invalid content: ' + content)
    }
  }
}

function showInfo()
{
  const ui = SpreadsheetApp.getUi()
  ui.alert('Info', 'Token: ' + getToken() + '\n\nURL: ' + ScriptApp.getService().getUrl(), ui.ButtonSet.OK)
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
    output.setContent(provider.export(language.export()))
  
    return output
  }
}

function getToken()
{
  return '990a86c9-bca3-4821-b1af-bbc5de73f3e3'
}

// =========================================== LANGUAGE =========================================== \\

function Language(input, columnIndex)
{
  const parts = input.split('(')
  this.name   = parts[0].trim()
  this.locale = parts[1].trim()
  this.locale = this.locale.substring(0, this.locale.length - 1)
  this.columnIndex = columnIndex
  
  this.import = function(json)
  {
    // TODO
  }
  
  this.export = function()
  {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
    const data  = sheet.getDataRange().getValues()
    const json  = {}
    
    for (var i = 1; i < data.length; i++)
    {
      var key   = data[i][0]
      var value = data[i][this.columnIndex]
      
      json[key] = value
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
  
  this.export = function(json)
  {
    // TODO
    return ''
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
  
  this.export = function(json)
  {
    // TODO
    return ''
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
  
  this.export = function(json)
  {
    var result = ''
    
    for (var key in json)
    {
      if (json.hasOwnProperty(key))
      {
        if (result != '')
        {
          result += ','
        }
        
        result += '\n\t"' + key + '": "' + json[key] + '"'
      }
    }
    
    return '{' + result + '\n}'
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
  
  this.export = function(json)
  {
    // TODO
    return ''
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
  
  this.export = function(json)
  {
    // TODO
    return ''
  }
}

// =========================================== UTILS =========================================== \\

function getProvider(format)
{
  if (format == 'json')
  {
    return new JsonProvider()
  }
  else if (format == 'android')
  {
    return new AndroidProvider()
  }
  else if (format == 'ios')
  {
    return new iOSProvider()
  }
  else
  {
    throw 'Unknown provider: ' + format
  }
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
    const sheet  = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
    const header = sheet.getDataRange().getValues()[0]
  
    const result = []
    
    for (var i = 1; i < header.length; i++)
    {
        var cell = header[i]
        
        result.push(new Language(cell, i))
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