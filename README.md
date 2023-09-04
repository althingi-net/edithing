# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# Editor Concept

The goal of this project is to create an editor that can manipulate the Icelandic legal codex, as well as bills that change existing law, or indeed change proposals to such bills.

First it is important to understand the document types in question.

## Document types

### Law

A law that has already been enacted by Parliament.

For example, the Constitution of the Republic of Iceland, a.k.a. law nr. 33/1944, looks like this:

![image](https://github.com/althingi-net/edithing/assets/1698313/62790387-3015-4bcd-a746-4a862e9c67d8)

It contains articles, which in Icelandic are called "grein" (singular) and "greinar" (plural). Articles are typically numbered and abbreviated "X. gr", where X is the number of the article. So "1. gr." means "Article 1".

### Bill

Bills are documents produced by Parliament, that are "recipes" for a new law. They come in two basic types:

- **A regular bill** that itself becomes a new law. These bills look almost identical to the laws they become once they are passed, with only commentary excluded and a different styling.
- **An amendment bill** that changes existing laws. Such bills contain descriptions of changes that are to be made to existing law.

Consider the following bill to change an existing law:

![image](https://github.com/althingi-net/edithing/assets/1698313/aa822e24-7e37-42b2-a4dd-73cca78d4641)

For example, the Icelandic text "Í 1. og 2. málsl. 8. gr. falli brott orðið „sameinaðs“." in English means "In 1. and 2. paragraph of article 8, is removed the word „sameinaðs“.".

So amendment bills are recipes for changes to some target document. One may think of them as a `diff` format for humans.

### Change proposals

From a technical point of view, change proposals work functionally the same as amendment bills, except their targets are not existing law, but rather bills or other change proposals being considered by Parliement.

## Current publication process

Currently, these documents are mostly created, edited and communicated using household office software such as word processors and email. This is an error-prone and time-consuming process that Edithing is intended to radically simplify.

## Editor goals

The Edithing editor is a specialized editor for producing, editing, sharing (with other software) all of the document types described above.

For example, in order to create an amendment bill, a user should only need to view the existing law, edit the text in as typical a WYSIWYG fashion as possible, with the editor automatically producing a document describing those changes in a technical format such as XML. This XML format should then suffice to automatically generate a traditional amendment bill, which would look identical to the one shown above.

This functionality should also be available to edit any other kind of document, including amendmend bills and change proposals to such bills.

Once a change proposal or bill is approved by Parliament, the resulting resulting law, after all the amendments and change proposals have been decided upon, should be automatically generated.

## Editor formats

The legal codex already more-or-less exists in XML format. At the time of this writing, it's not entirely perfect but it contains the vast majority of the legal codex in a structured and predictable XML format. It has been generated by processing the HTML of the legal codex as it has been published on the Parliament website.

The project for creating the XML legal codex is a separate one and can be found here: [lagasafn-xml](https://github.com/althingi-net/lagasafn-xml).
