# Sheet Localization

Easy localization management tool using **Google Spreadsheets**.

## Table of contents
* [Features](README.md#features)
* [Formats supported](README.md#formats-supported)
* [Installation](README.md#installation)
* [Cell format](README.md#cell-format)
* [Import](README.md#import)
* [Export](README.md#export)
* [Best practices](README.md#best-practices)

## Features
* Free
* Easy to setup
* Scalable
* Multi-user
* Customizable UI
* Version history built-in

## Formats supported
* Android (.xml)
* iOS (.strings)
* JSON (plain)
* YAML (plain)
* XLIFF (v1.2)

## Installation
1. Create an empty [Google Spreadsheet](https://www.google.com/sheets/about)
2. Create a column for the keys and at least one language column. For example:

| Keys        | English (en)                              | Spanish (es)                         |
|-------------|-------------------------------------------|--------------------------------------|
| hello.world | Hello, world!                             | Hola, mundo!                         |
| welcome     | Welcome, ${name}!                         | Bienvenido, ${nombre}!               |
| total_cost  | The total cost is: ${cost}                | El coste total es: ${coste}          |
| appointment | Your appointment is on ${date} at ${time} | Su cita es el ${fecha} a las ${hora} |

3. Open the script editor: **Tools ⟶ Script editor**
4. Copy the contents of [script.gs](https://raw.githubusercontent.com/mauriciotogneri/sheet-localization/master/script.gs) and paste it inside of the empty file in the Script editor
5. In the last line of the script, edit the function `getToken()` and add your own [randomly generated](https://www.uuidgenerator.net) token
6. Reload the Spreadsheet in the browser (the Script editor will close automatically as a result)
7. Check that a new menu entry (**Localization**) appeared in the toolbar

## Cell format

#### Keys
* Cannot be empty
* Must start with a letter
* Each key must be unique

#### Segments
* Can be empty
* Headers must have the following pattern: `Name (locale)`. For example: `English (en)`

#### Segment parameters
Parameters inside of segments must be declared as `{{index$format}}`, where:
* `index`: the position of the parameter in the text (starting from 1)
* `format`: the format of the parameter

For example:
* `You have {{1$d}} emails`
* `Welcome, {{1$s}}!`

Formats available:
* `s` (string)
* `d` (integer)
* `f` (decimal)

## Import

1. Click on **Localization ⟶ Import**
2. Enter the language and format of the input file
3. In the last step, copy the contests of the file and paste it into the field

## Export

1. Download the file [pull.sh](https://raw.githubusercontent.com/mauriciotogneri/sheet-localization/master/pull.sh)
2. Change the values of the variables `LOCALE` and `FORMAT` to adapt to your needs
3. Click on **Localization ⟶ Info** to obtain the values of `URL` and `Token`

## Best practices
* Use a separate spreadsheet per project
* Change the background color of a cell to indicate if the segment has been translated or not
* Limit the access to columns only to users that should edit them

## TODO
* Flag to replace values when importing a file
* Support more formats:
	- INI
	- Properties
	- PHP array
	- Angular translate
	- Gettext
	- Twine