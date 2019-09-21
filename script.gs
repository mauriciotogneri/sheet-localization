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
  const providers = getImportProviders()
  
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
          
        if (background == '#ffffff')
        {
          validated++
        }
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

function testImport()
{
  const provider = getProvider('php')
  const content  = "<?php\n$lang['hello.world'] = 'Hello, world!';\n$lang['welcome'] = 'Welcome\'s, %1$s!';\n?>"
  
  const result = provider.import(content)
  Logger.log(result)
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

function testExport()
{
  const language = getLanguage('en')
  const provider = getProvider('php')
  
  const result = provider.export(language.export(), language.locale)
  Logger.log(result)
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
    const document = XmlService.parse(input)
    const root = document.getRootElement()
    const entries = root.getChildren()
    const result = {}
    
    for (var i = 0; i < entries.length; i++)
    {
      var entry = entries[i] 
      var key = entry.getAttribute('name').getValue()
      var value = entry.getValue()
      
      result[key] = value
    }
        
    return result
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

// =========================================== SWIFT =========================================== \\

function SwiftProvider()
{
  function escape(name)
  {
    const reserved = [
      'class',
      'break',
      'as',
      'associativity',
      'deinit',
      'case',
      'dynamicType',
      'convenience',
      'enum',
      'continue',
      'false',
      'dynamic',
      'extension',
      'default',
      'is',
      'didSet',
      'func',
      'do',
      'nil',
      'final',
      'import',
      'else',
      'self',
      'get',
      'init',
      'fallthrough',
      'Self',
      'infix',
      'internal',
      'for',
      'super',
      'inout',
      'let',
      'if',
      'true',
      'lazy',
      'operator',
      'in',
      'left',
      'private',
      'return',
      'mutating',
      'protocol',
      'switch',
      'none',
      'public',
      'where',
      'nonmutating',
      'static',
      'while',
      'optional',
      'struct',
      'override',
      'subscript',
      'postfix',
      'typealias',
      'precedence',
      'var',
      'prefix',
      'protocol',
      'required',
      'right',
      'set',
      'type',
      'Type',
      'unowned',
      'weak'
    ]
    
    if (reserved.indexOf(name) !== -1)
    {
      return '`' + name + '`'
    }
    else
    {
      return name
    }
  }
    
  function tree(json)
  {
    var tree = { children: {} }
    
    for (var key in json)
    {
      var parts = key.split('.')
      var node = tree

      while (parts.length !== 0)
      {
        var prefix = parts.shift()
        node.children = node.children || {}
        node.children[prefix] =  node.children[prefix] || {}
                
        if (parts.length === 0)
        {
          node.children[prefix].key = key
          node.children[prefix].value = json[key]
          node.children[prefix].name = prefix
        }
        else
        {
          node = node.children[prefix]
          node.name = prefix
        }
      }
    }
        
    return tree
  }
    
  function structs(node, tab)
  {
    var content = ''
        
    const children = node.children
    const key = node.key
    const value = node.value
    const name = node.name
    
    if (children)
    {
      content += '\n' + tab + 'struct ' + escape(name.slice(0,1).toUpperCase() + name.slice(1)) + ' {'
    
      Object.keys(children).forEach(function (child) {
        content += structs(children[child], tab + '    ')
      })
      
      content += tab + '}\n'
    }
    
    if (key && name)
    {
      content += '\n' + tab + '/// ' + value + '\n'
      content += tab + 'static var ' + escape(name) + ': String { return NSLocalizedString("' + key + '", value: "' + value + '", comment: "' + value + '") }\n'
    }
    
    return content
  }
    
  function swift(tree)
  {
    var content = 'import Foundation\n\n'
    content += '//swiftlint:disable nesting\n'
    content += '//swiftlint:disable file_length\n\n'
    content += 'extension String {'
    
    Object.keys(tree.children).forEach(function (child) { 
      content += structs(tree.children[child], '    ')
    })
    
    content += '}\n'
    
    return content
  }

  this.name = 'Swift'

  this.mimeType = ContentService.MimeType.TEXT

  this.fileName = function()
  {
    return 'Strings.swift'
  }

  this.export = function(json, defaultLocale)
  {
    var root = tree(json)

    return swift(root)
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
      const result = {}
      const lines = input.split('\n')
    
      for (var i = 0; i < lines.length; i++)
      {
        var line = lines[i].trim()

        if ((line != '') && (!line.startsWith('/*')) && line.startsWith('"'))
        {
          var parts = line.split('=')
          var key   = parts[0].trim().substr(1).slice(0, -1)
          var value = parts[1].trim().substr(1).slice(0, -2)

          result[key] = value
      }
    }
    
    return result
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
        
        result += '"' + key + '" = "' + transformParameters(json[key], function(match) { return '%' + match[1] + '$@' }) + '";'
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
    const result = {}
    const lines = input.split('\n')
    
    for (var i = 0; i < lines.length; i++)
    {
      var line = lines[i].trim()

      if ((line != '') && (!line.startsWith('#')))
      {
        var parts = line.split(':')
        var key   = parts[0].trim()
        var value = parts[1].trim()

        result[key] = value
      }
    }
    
    return result
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
    const document = XmlService.parse(input)
    const root = document.getRootElement()
    const file = root.getChildren()[0]
    const body = file.getChildren()[0]
    const entries = body.getChildren()
    const result = {}
    
    for (var i = 0; i < entries.length; i++)
    {
      var entry = entries[i] 
      var key = entry.getAttribute('id').getValue()
      var child = entry.getChildren()[0]
      var value = child.getValue()
      
      result[key] = value
    }
        
    return result
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

// =========================================== PHP =========================================== \\

function PhpProvider()
{
  this.name = 'PHP'
  this.mimeType = ContentService.MimeType.TEXT
  
  this.fileName = function(locale)
  {
    return locale + '.php'
  }
  
  this.import = function(input)
  {
    const result = {}
    const lines = input.split('\n')
    const REGEX = /.+\['(.+)'\] *= *'(.+)';/
    
    for (var i = 0; i < lines.length; i++)
    {
      var line = lines[i].trim()

      if ((line != '') && !line.startsWith('<?php') && !line.startsWith('?>'))
      {
        var match = null
        
        if (match = REGEX.exec(line))
        {
          var key   = match[1]
          var value = match[2]

          result[key] = value 
        }
    }
    }
    
    return result
  }
  
  this.export = function(json, locale)
  {
    var result = '<?php\n'
    
    for (var key in json)
    {
      if (json.hasOwnProperty(key))
      {
        var value = transformParametersDefault(json[key])
        value = value.replace(/\'/, "\\'")
        
        result += "\t$lang['" + key + "'] = '" + value + "';\n"
      }
    }
    
    result += '?>'
    
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
  else if (format == 'swift')
  {
    return new SwiftProvider()
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
  else if (format == 'php')
  {
    return new PhpProvider()
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
      new SwiftProvider(),
      new JsonProvider(),
      new YamlProvider(),
      new XliffProvider(),
      new PhpProvider()
    ]
}

function getImportProviders()
{
    return getAvailableProviders().filter(function (provider) {
      return !!provider.import
    })
}

function getExportProviders()
{
    return getAvailableProviders().filter(function (provider) {
      return !!provider.export
    })
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

if (!String.prototype.startsWith)
{
    Object.defineProperty(String.prototype, 'startsWith', {
        value: function(search, pos) {
            pos = !pos || pos < 0 ? 0 : + pos
            return this.substring(pos, pos + search.length) === search
        }
    })
}

// =========================================== TOKEN =========================================== \\

function getToken()
{
  return ''
}