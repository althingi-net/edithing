The goal of this project is to create an editor that can manipulate the Icelandic legal codex, as well as bills that change existing law, or indeed change proposals to such bills.

First it is important to understand the document types in question.

# Document types

## Law

A law that has already been enacted by Parliament.

For example, the Constitution of the Republic of Iceland, a.k.a. law nr. 33/1944, looks like this:

![image](https://github.com/althingi-net/edithing/assets/1698313/62790387-3015-4bcd-a746-4a862e9c67d8)

## Bill

Bills are documents produced by Parliament, that are "recipes" for a new law. They come in two basic types:

- **A regular bill** that itself becomes a new law. These bills look almost identical to the laws they become once they are passed, with only commentary excluded and a different styling.
- **An amendment bill** that changes existing laws. Such bills contain descriptions of changes that are to be made to existing law.

Consider the following bill to change an existing law:

![image](https://github.com/althingi-net/edithing/assets/1698313/aa822e24-7e37-42b2-a4dd-73cca78d4641)

For example, the Icelandic text "Í 1. og 2. málsl. 8. gr. falli brott orðið „sameinaðs“." in English means "In 1. and 2. paragraph of article 8, is removed the word „sameinaðs“.".

So amendment bills are recipes for changes to some target document. One may think of them as a `diff` format for humans.

## Change proposals

From a technical point of view, change proposals work functionally the same as amendment bills, except their targets are not existing law, but rather bills or other change proposals being considered by Parliement.

# Current publication process

Currently, these documents are mostly created, edited and communicated using household office software such as word processors and email. This is an error-prone and time-consuming process that Edithing is intended to radically simplify.

# Editor goals

The Edithing editor is a specialized editor for producing, editing, sharing (with other software) all of the document types described above.

For example, in order to create an amendment bill, a user should only need to view the existing law, edit the text in as typical a WYSIWYG fashion as possible, with the editor automatically producing a document describing those changes in a technical format such as XML. This XML format should then suffice to automatically generate a traditional amendment bill, which would look identical to the one shown above.

This functionality should also be available to edit any other kind of document, including amendmend bills and change proposals to such bills.

Once a change proposal or bill is approved by Parliament, the resulting resulting law, after all the amendments and change proposals have been decided upon, should be automatically generated.
