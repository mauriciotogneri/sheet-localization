# Sheet Localization

Easy localization management tool using **Google Spreadsheets**.

## Table of contents
* [Features](README.md#features)
* [Formats supported](README.md#formats-supported)
* [Installation](README.md#installation)
* [Constraints](README.md#constraints)
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
| hello.world | Hello, world!                             | ¡Hola, mundo!                        |
| welcome     | Welcome, {1$s}!                           | ¡Bienvenido, {1$s}!                  |
| total_cost  | The total cost is: {1$f}                  | El coste total es: {1$f}             |
| appointment | Your appointment is on {1$s} at {2$s}     | Su cita es el {1$s} a las {2$s}      |

3. Open the script editor: **Tools ⟶ Script editor**
4. Copy the contents of [script.gs](https://raw.githubusercontent.com/mauriciotogneri/sheet-localization/master/script.gs) and paste it inside of the empty file (usually named *Code.gs*) in the *script editor*
5. In the last line of the script, edit the function `getToken()` and add your own [randomly generated](https://www.uuidgenerator.net) token
6. In the *script editor*, create a new HTML file by clicking on **File ⟶ New ⟶ HTML file** and call it *import* (without extension)
7. Copy the contents of [import.html](https://raw.githubusercontent.com/mauriciotogneri/sheet-localization/master/import.html) and paste it in the newly created file
8. Deploy the tool by clicking on **Publish ⟶ Deploy as web app...** in the *script editor*
9. In form, select the following:
	- **Project version**: *New*
	- **Execute the app as**: *Me*
	- **Who has access to the app**: *Anyone, even anonymous*
10. Click on **Deploy**
11. Reload the Spreadsheet in the browser (the *script editor* will close automatically as a result)
12. Check that a new menu entry (**Localization**) appeared in the toolbar

## Constraints

#### Sheet
* The first sheet must contain the keys and segments

#### Keys
* Cannot be empty
* Must start with a letter
* Must be unique

#### Segments
* Can be empty (i.e. untranslated)
* Headers must have the following pattern: `Name (locale)`. For example: `English (en)`

#### Parameters
Parameters inside of segments must be declared as `{index$format}`, where:
* `index`: the position of the parameter in the text (starting from 1)
* `format`: the format of the parameter

Formats available:
* `s` (string)
* `d` (integer)
* `f` (decimal)

For example:
* `Welcome, {1$s}!`
* `You have {1$d} emails`
* `The price is: {1$f} USD`

## Import

1. Click on **Localization ⟶ Import**
2. Select the language and format of the input
3. If **replace values** is enabled, the content will be replaced if the keys match
4. Paste the content of the file in the input field
5. Click on **Import**

## Export

1. Download the file [pull.sh](https://raw.githubusercontent.com/mauriciotogneri/sheet-localization/master/pull.sh)
2. Change the values of the variables `LOCALE` and `FORMAT` to adapt to your needs
3. Click on **Localization ⟶ Info** to obtain the values of `URL` and `Token`
4. Run the script to download the localization file

Formats available:
* `android`
* `ios`
* `json`
* `yaml`
* `xliff`

## Best practices
* Use a separate spreadsheet per project
* Change the background color of a cell to indicate if the segment has been translated or not
* Limit the access to columns only to users that should edit them

## TODO
* Support more formats:
	- INI
	- Properties
	- PHP array
	- Angular translate
	- Gettext
	- Twine