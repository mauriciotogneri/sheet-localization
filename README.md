# Sheet Localization

## Pros
* Free
* Very easy to setup
* One spreadsheet per project
* Easy user control management
* Customizable UI
* Easy to create, edit and delete languages and segments
* Version history built-in
* Some metadata supported
	- Comments
	- Notes

## Cons
* Lack of some metadata
	- Tags
	- Max length
	- Screenshot link
	- Mark as translated

## TODO
* Add providers
	* JSON
	* Android
	* iOS
	* YAML
	* XLIFF
* Add upload feature in UI

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