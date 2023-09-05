import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useState } from 'react';
import DocumentSelector from '../DocumentSelector/DocumentSelector';
import Editor from '../Editor/Editor';
import GithubFile from '../../models/GithubFile';
import 'react-quill/dist/quill.snow.css';

function App() {
  const [selectedFile, setSelectedFile] = useState<GithubFile | null>(null);

  const handleFileSelect = (file: GithubFile) => {
    setSelectedFile(file);
  }

  const content = !selectedFile ? (
    <DocumentSelector onFileSelect={handleFileSelect} />
  ) : (
    <Editor file={selectedFile} />
  );

  return (
    <Layout>
      <Content style={{ padding: '50px', textAlign: 'center' }}>
          {content}
      </Content>
    </Layout>
  );
}

export default App;
