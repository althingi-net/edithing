import 'react-quill/dist/quill.snow.css';
import DocumentSelector from '../DocumentSelector/DocumentSelector';
import './App.css';
import { GithubFile } from '../../utils/getGitFiles';
import { Layout, Space } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useState } from 'react';
import Editor from '../Editor/Editor';

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
        <Space direction="vertical" size='large'>
          {content}
        </Space>
      </Content>
    </Layout>
  );
}

export default App;
