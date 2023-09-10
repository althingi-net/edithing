import { Button, Layout, Space } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useState } from 'react';
import GithubFile from '../../models/GithubFile';
import DocumentSelector from '../DocumentSelector/DocumentSelector';
import Editor from '../Editor/Editor';

function App() {
  const [selectedFile, setSelectedFile] = useState<GithubFile | null>(null);

  const handleFileSelect = (file: GithubFile) => {
    setSelectedFile(file);
  }

  const content = !selectedFile ? (
    <Content style={{ padding: '50px', textAlign: 'center' }}>
      <DocumentSelector onFileSelect={handleFileSelect} />
    </Content>
  ) : (
    <Content style={{ padding: '50px' }}>
      <Space>
        <Button onClick={() => setSelectedFile(null)}>Back</Button>
        <h3>{selectedFile.identifier} {selectedFile.name}</h3>
      </Space>
      <Editor file={selectedFile} />
    </Content>
  );


  return (
    <Layout>
      {content}
    </Layout>
  );
}

export default App;
