# Law Document Editor

A specialized rich text editor for legal documents built on [Slate.js](https://www.slatejs.org/). This package provides a customizable editor for creating and editing structured legal documents with XML import/export capabilities.

## Installation

```bash
# If you're using npm
npm install law-document-editor

# If you're using yarn
yarn add law-document-editor

# If you're using pnpm
pnpm add law-document-editor
```

## Usage

```tsx
import { Editor, EditorConfigContextProvider } from 'law-document-editor';
import { importXml } from 'law-document';

function MyEditor() {
  // Import XML document
  const slate = importXml('<document>...</document>');
  const originalDocument = [...slate]; // for tracking changes
  
  const handleSave = (editor) => {
    // Save the document
    console.log('Saving document', editor.children);
  };
  
  return (
    <EditorConfigContextProvider>
      <Editor 
        slate={slate}
        originalDocument={originalDocument}
        xml="<document>...</document>"
        saveDocument={handleSave}
        navigationBlocker={{
          isNavigationBlocked: true,
          goTo: (path) => { /* ... */ }
        }}
        t={(key) => key} // translator function
      />
    </EditorConfigContextProvider>
  );
}
```

## Component Architecture

The editor is built with several key components:

- **Editor**: The main component that renders the Slate editor with toolbars and side panels
- **EditorConfigContextProvider**: Provides configuration context for editor features
- **Toolbars**:
  - **Toolbar**: Main toolbar with document-level controls
  - **HoveringToolbar**: Context-sensitive toolbar for text formatting
  - **SideToolbar**: Side floating toolbar for list item actions

## Features

- **Rich Text Editing**: Format text with bold, title, name, and other styles
- **Document Structure**: Support for chapters, articles, paragraphs, and other legal document elements
- **Structure Highlighting**: Visual differentiation of document structure elements
- **Auto-numbering**: Automatic incrementing and decrementing of list item numbers
- **XML Import/Export**: Convert between editor content and XML format
- **Side Panel**:
  - Element Configuration: Configure metadata for selected elements
  - XML Preview: View the current XML representation
  - Diff View: See changes compared to the original document
- **Navigation Blocking**: Prevent accidental navigation when there are unsaved changes

## Core Dependencies

- [Slate](https://www.slatejs.org/): Modern framework for building rich text editors
- [Slate React](https://www.npmjs.com/package/slate-react): React components for Slate
- [Ant Design](https://ant.design/): UI component library
- [Zustand](https://github.com/pmndrs/zustand): State management
- [law-document](../law-document): Core document structure and transformation logic

## Development

This package is part of a monorepo. See the root [README.md](../README.md) for setup instructions. 