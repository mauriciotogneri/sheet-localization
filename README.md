# Sheet Localization

Easy localization management tool using Google Spreadsheets.

## Features
* Free
* Easy to setup
* Easy user control management
* Customizable UI
* Easy to create, edit and delete languages and segments
* Version history built-in

## Best practices
* Use a separate spreadsheet per project
* Change the background color of a cell to indicate if the segment has been translated or not
* Limit the access to columns only to users that should edit them

## Installation
1. Create an empty [Google Spreadsheet](https://www.google.com/sheets/about)
2. Create a column for the keys and at least one language column

For example:
![Example](https://raw.githubusercontent.com/mauriciotogneri/sheet-localization/master/screenshots/example.png "Example")

3. Open the script editor: **Tools → Script editor**
4. Copy the contents of [script.gs](https://raw.githubusercontent.com/mauriciotogneri/sheet-localization/master/script.gs) and paste it inside of the empty file in the Script editor
5. Reload the Spreadsheet in the browser (the Script editor will close automatically as a result)
6. Check that a new menu entry (**Localization**) appeared in the toolbar

## Tutorial

##### Keys
* cannot be empty
* each key must be unique

##### Translations
* can be empty
* can be marked as validated

##### Translation parameters
Parameters inside of translations can be declared as `{{index$format}}`. Where:
* index: the position of the parameter in the text (starting from 1)
* format: the format of the parameter

For example:
* `You have {{1$d}} emails`
* `Welcome, {{1$s}}!`

Formats available:
* s (string)
* d (integer)
* f (decimal)

## TODO
* Support more formats:
	- INI
	- Properties
	- PHP array
	- Angular translate
	- Gettext
	- Twine