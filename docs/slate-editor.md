# Slate Editor Documentation

## Overview

The Slate editor is a rich text editor implementation built on top of the Slate.js framework, specifically designed for editing legal documents. It provides a comprehensive set of features for document editing, including structure highlighting, XML preview, and various editing tools.

## Core Components

### Editor Structure

The editor is composed of several key components:

1. **Main Editor Area**
   - Split into two columns
   - Left column: Main editing area
   - Right column: Toolbar and side panel

2. **Toolbars**
   - `HoveringToolbar`: Appears when text is selected
   - `SideToolbar`: Fixed toolbar on the left side
   - `Toolbar`: Main toolbar at the top of the right column

3. **Side Panel**
   - Shows XML preview
   - Displays original document
   - Provides additional editing controls

### Editor Features

1. **Document Structure**
   - Hierarchical document organization
   - Structure highlighting
   - XML representation

2. **Editing Capabilities**
   - Rich text formatting
   - Document structure manipulation
   - Meta-data editing
   - Navigation blocking for unsaved changes

3. **User Interface**
   - Read-only mode support
   - Responsive layout
   - Custom styling

## Configuration

### Editor Setup

The editor is configured through the `EditorConfig` context:

```typescript
interface EditorConfig {
    highlightStructure: boolean;
    // Add other configuration options
}
```

### Document Structure Configuration

The document structure is defined in `law-document/src/slate/config/tags.ts`. This file configures the hierarchical structure of legal documents and defines the relationships between different elements.

#### Tag Configuration Interface

```typescript
interface TagConfig {
    type: string;                    // The type of the element
    isList: boolean;                 // Whether the element is a list item
    hasTitle?: boolean;              // Whether the element has a title
    hasName?: boolean;               // Whether the element has a name
    defaultTitle?: string;           // Default title format
    canHave: MetaType[];            // Allowed child element types
    display?: 'list' | 'block' | 'inline' | 'virtual'; // Display type
}
```

#### Predefined Tags

The editor comes with predefined tags for legal documents:

1. **Chapter (CHAPTER)**
   ```typescript
   {
       type: MetaType.CHAPTER,
       isList: true,
       hasTitle: true,
       hasName: true,
       defaultTitle: 'I. kafli. ',
       display: 'list',
       canHave: [MetaType.ART]
   }
   ```
   - Represents a chapter in the document
   - Can only contain articles
   - Has a title and name
   - Uses Roman numeral formatting

2. **Article (ART)**
   ```typescript
   {
       type: MetaType.ART,
       isList: true,
       hasTitle: true,
       hasName: true,
       defaultTitle: '1. gr. ',
       display: 'list',
       canHave: [MetaType.SUBART, MetaType.NUMART]
   }
   ```
   - Represents an article
   - Can contain sub-articles and numbered articles
   - Has a title and name
   - Uses numeric formatting

3. **Sub-Article (SUBART)**
   ```typescript
   {
       type: MetaType.SUBART,
       isList: true,
       display: 'list',
       canHave: [MetaType.PARAGRAPH]
   }
   ```
   - Represents a sub-article
   - Can only contain paragraphs
   - No title or name

4. **Numbered Article (NUMART)**
   ```typescript
   {
       type: MetaType.NUMART,
       isList: true,
       display: 'list',
       canHave: [MetaType.PARAGRAPH, MetaType.SEN, MetaType.NUMART]
   }
   ```
   - Represents a numbered article
   - Can contain paragraphs, sentences, and nested numbered articles
   - No title or name

5. **Paragraph (PARAGRAPH)**
   ```typescript
   {
       type: MetaType.PARAGRAPH,
       isList: true,
       display: 'list',
       canHave: [MetaType.SEN, MetaType.NUMART]
   }
   ```
   - Represents a paragraph
   - Can contain sentences and numbered articles
   - No title or name

6. **Sentence (SEN)**
   ```typescript
   {
       type: MetaType.SEN,
       isList: false,
       display: 'inline',
       canHave: []
   }
   ```
   - Represents a sentence
   - Cannot contain other elements
   - Displayed inline
   - No title or name

#### Helper Functions

The configuration includes helper functions:

```typescript
export const getAllowedTagChildren = (type: MetaType) => {
    return TAGS[type].canHave
        .filter(type => TAGS[type].display !== 'virtual' && TAGS[type].isList);
};
```
This function returns the allowed child elements for a given tag type, filtering out virtual and non-list elements.

### Props Interface

```typescript
interface EditorProps {
    slate: SlateFragment;           // Current document content
    originalDocument: SlateFragment; // Original document for comparison
    xml: string;                    // XML representation
    readOnly?: boolean;             // Read-only mode flag
    saveDocument?: (editor: LawEditor) => void; // Save callback
    bill?: Bill;                    // Associated bill data
    navigationBlocker: NavigationBlocker; // Navigation control
    t: Translator;                  // Translation function
}
```

## Plugins

The editor uses several plugins to extend its functionality:

1. **handleKeyDown**
   - Manages keyboard shortcuts
   - Handles special key combinations

2. **renderElement**
   - Custom element rendering
   - Structure-specific formatting

3. **renderLeaf**
   - Leaf node rendering
   - Text formatting

4. **DocumentMetaBlock**
   - Meta-data handling
   - Document properties

## Usage Example

```typescript
import { Editor } from 'law-document-editor';

const MyComponent = () => {
    const handleSave = (editor) => {
        // Handle document saving
    };

    return (
        <Editor
            slate={documentContent}
            originalDocument={originalContent}
            xml={xmlContent}
            saveDocument={handleSave}
            navigationBlocker={navigationBlocker}
            t={translator}
        />
    );
};
```

## Styling

The editor includes custom CSS for:
- Layout and positioning
- Structure highlighting
- Toolbar appearance
- Side panel styling

## Best Practices

1. **Document Structure**
   - Maintain proper hierarchy
   - Use appropriate element types
   - Follow XML schema

2. **Performance**
   - Use `useMemo` for editor creation
   - Implement proper change handling
   - Manage state efficiently

3. **User Experience**
   - Provide clear feedback
   - Handle unsaved changes
   - Support keyboard shortcuts

## Error Handling

The editor includes:
- Navigation blocking for unsaved changes
- Error boundaries
- Validation
- State recovery
