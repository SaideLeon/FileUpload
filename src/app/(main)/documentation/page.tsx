'use client';

import { CodeBlock } from '@/components/code-block';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AppHeader } from '@/components/app-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DocumentationPage() {
    // ===== UPLOAD EXAMPLES =====
    const uploadCurl = `curl -X 'POST' \\
  'https://uploader.nativespeak.app/api/upload' \\
  -H 'accept: application/json' \\
  -H 'Authorization: SUA_FORGE_API_KEY' \\
  -H 'Content-Type: multipart/form-data' \\
  -F 'project=meu-projeto' \\
  -F 'file=@/caminho/para/seu/arquivo.jpg'`;

    const uploadJs = `const uploadFile = async (file, projectName, apiKey) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('project', projectName);

  try {
    const response = await fetch('https://uploader.nativespeak.app/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Accept': 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Falha no upload');
    }

    const result = await response.json();
    console.log('Sucesso:', result);
    return result;
  } catch (error) {
    console.error('Erro no upload:', error);
    throw error;
  }
};`;

    const uploadPython = `import requests

def upload_file(file_path, project_name, api_key):
    url = "https://uploader.nativespeak.app/api/upload"
    headers = {
        'Authorization': api_key,
        'Accept': 'application/json'
    }
    
    with open(file_path, 'rb') as f:
        files = {
            'file': (f.name, f)
        }
        data = {
            'project': project_name
        }
        
        try:
            response = requests.post(url, headers=headers, files=files, data=data)
            response.raise_for_status()
            
            print("Sucesso:", response.json())
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Erro no upload: {e}")
            if e.response:
                print("Detalhes:", e.response.text)
            return None

# Exemplo de uso
# upload_file('/caminho/para/seu/arquivo.jpg', 'meu-projeto', 'SUA_FORGE_API_KEY')`;

    // ===== LIST FILES EXAMPLES =====
    const listFilesCurl = `curl -X 'GET' \\
  'https://uploader.nativespeak.app/api/list?project=meu-projeto' \\
  -H 'accept: application/json' \\
  -H 'Authorization: SUA_FORGE_API_KEY'`;

    const listFilesJs = `const listFiles = async (projectName, apiKey) => {
  try {
    const response = await fetch(
      \`https://uploader.nativespeak.app/api/list?project=\${projectName}\`, {
        headers: {
          'Authorization': apiKey,
          'Accept': 'application/json',
        }
      }
    );

    if (!response.ok) {
      throw new Error('Falha ao listar arquivos');
    }

    const data = await response.json();
    console.log('Arquivos:', data.files);
    return data;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};

// Exemplo de uso
// listFiles('meu-projeto', 'SUA_FORGE_API_KEY');`;

    const listFilesPython = `import requests

def list_files(project_name, api_key):
    url = "https://uploader.nativespeak.app/api/list"
    headers = {
        'Authorization': api_key,
        'Accept': 'application/json'
    }
    params = {
        'project': project_name
    }
    
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        data = response.json()
        print(f"Total de arquivos: {data['total']}")
        for file in data['files']:
            print(f"  - {file['name']} ({file['size']} bytes)")
        
        return data
    except requests.exceptions.RequestException as e:
        print(f"Erro ao listar arquivos: {e}")
        return None

# Exemplo de uso
# list_files('meu-projeto', 'SUA_FORGE_API_KEY')`;

    // ===== LIST PROJECTS EXAMPLES =====
    const listProjectsCurl = `curl -X 'GET' \\
  'https://uploader.nativespeak.app/api/projects' \\
  -H 'accept: application/json' \\
  -H 'Authorization: SUA_FORGE_API_KEY'`;

    const listProjectsJs = `const listProjects = async (apiKey) => {
  try {
    const response = await fetch('https://uploader.nativespeak.app/api/projects', {
      headers: {
        'Authorization': apiKey,
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Falha ao listar projetos');
    }

    const data = await response.json();
    console.log('Projetos:', data.projects);
    return data;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};

// Exemplo de uso
// listProjects('SUA_FORGE_API_KEY');`;

    const listProjectsPython = `import requests

def list_projects(api_key):
    url = "https://uploader.nativespeak.app/api/projects"
    headers = {
        'Authorization': api_key,
        'Accept': 'application/json'
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        print(f"Total de projetos: {data['total']}")
        for project in data['projects']:
            print(f"  - {project['name']}: {project['file_count']} arquivos")
        
        return data
    except requests.exceptions.RequestException as e:
        print(f"Erro ao listar projetos: {e}")
        return None

# Exemplo de uso
# list_projects('SUA_FORGE_API_KEY')`;

    // ===== DELETE FILE EXAMPLES =====
    const deleteFileCurl = `curl -X DELETE "https://uploader.nativespeak.app/delete?project=meu-projeto&file=arquivo-20240101-120000.jpg"`;

    const deleteFileJs = `const deleteFile = async (projectName, fileName) => {
  try {
    const response = await fetch(
      \`https://uploader.nativespeak.app/delete?project=\${projectName}&file=\${fileName}\`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Falha ao deletar arquivo');
    }

    const result = await response.json();
    console.log('Arquivo deletado:', result);
    return result;
  } catch (error) {
    console.error('Erro ao deletar:', error);
    throw error;
  }
};

// Exemplo de uso
// deleteFile('meu-projeto', 'arquivo-20240101-120000.jpg');`;

    const deleteFilePython = `import requests

def delete_file(project_name, file_name):
    url = f"https://uploader.nativespeak.app/delete"
    params = {
        'project': project_name,
        'file': file_name
    }
    
    try:
        response = requests.delete(url, params=params)
        response.raise_for_status()
        
        data = response.json()
        print(f"Arquivo deletado: {data['message']}")
        return data
    except requests.exceptions.RequestException as e:
        print(f"Erro ao deletar arquivo: {e}")
        if e.response:
            print("Detalhes:", e.response.text)
        return None

# Exemplo de uso
# delete_file('meu-projeto', 'arquivo-20240101-120000.jpg')`;

    // ===== REGISTER USER EXAMPLES =====
    const registerUserCurl = `curl -X 'POST' \\
  'https://uploader.nativespeak.app/register' \\
  -H 'accept: application/json' \\
  -H 'Content-Type: application/json' \\
  -d '{
  "email": "user@example.com",
  "password": "yourstrongpassword"
}'`;

    const registerUserJs = `const registerUser = async (email, password) => {
  try {
    const response = await fetch('https://uploader.nativespeak.app/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Falha ao registrar usuário');
    }

    const result = await response.json();
    console.log('Usuário registrado com sucesso:', result);
    // Salve a forge_api_key para usar em outras requisições
    return result;
  } catch (error) {
    console.error('Erro no registro:', error);
    throw error;
  }
};`;

    const registerUserPython = `import requests
import json

def register_user(email, password):
    url = "https://uploader.nativespeak.app/register"
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    data = {
        "email": email,
        "password": password
    }
    
    try:
        response = requests.post(url, headers=headers, data=json.dumps(data))
        response.raise_for_status()
        
        print("Sucesso:", response.json())
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Erro no registro: {e}")
        if e.response:
            print("Detalhes:", e.response.text)
        return None

# Exemplo de uso
# register_user('user@example.com', 'yourstrongpassword')`;

 // ===== LOGIN USER EXAMPLES =====
    const loginUserCurl = `curl -X 'POST' \\
  'https://uploader.nativespeak.app/login' \\
  -H 'accept: application/json' \\
  -H 'Content-Type: application/json' \\
  -d '{
  "email": "user@example.com",
  "password": "yourpassword"
}'`;

    const loginUserJs = `const loginUser = async (email, password) => {
  try {
    const response = await fetch('https://uploader.nativespeak.app/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Falha no login');
    }

    const result = await response.json();
    console.log('Login bem-sucedido:', result);
    // Salve o token para usar em requisições autenticadas
    return result;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};`;

    const loginUserPython = `import requests
import json

def login_user(email, password):
    url = "https://uploader.nativespeak.app/login"
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    data = {
        "email": email,
        "password": password
    }
    
    try:
        response = requests.post(url, headers=headers, data=json.dumps(data))
        response.raise_for_status()
        
        print("Sucesso:", response.json())
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Erro no login: {e}")
        if e.response:
            print("Detalhes:", e.response.text)
        return None

# Exemplo de uso
# login_user('user@example.com', 'yourpassword')`;

    // ===== ROTATE API KEY EXAMPLES =====
    const rotateApiKeyCurl = `curl -X 'POST' \\
  'https://uploader.nativespeak.app/api/user/rotate-api-key' \\
  -H 'accept: application/json' \\
  -H 'Authorization: SUA_ANTIGA_FORGE_API_KEY'`;

    const rotateApiKeyJs = `const rotateApiKey = async (currentApiKey) => {
  try {
    const response = await fetch('https://uploader.nativespeak.app/api/user/rotate-api-key', {
      method: 'POST',
      headers: {
        'Authorization': currentApiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Falha ao rotacionar a chave de API');
    }

    const result = await response.json();
    console.log('Chave de API rotacionada com sucesso:', result);
    // Salve a nova chave: result.new_api_key
    return result;
  } catch (error) {
    console.error('Erro ao rotacionar a chave:', error);
    throw error;
  }
};`;

    const rotateApiKeyPython = `import requests

def rotate_api_key(current_api_key):
    url = "https://uploader.nativespeak.app/api/user/rotate-api-key"
    headers = {
        'Authorization': current_api_key,
        'Accept': 'application/json'
    }
    
    try:
        response = requests.post(url, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        print("Sucesso:", data)
        # Salve a nova chave: data['new_api_key']
        return data
    except requests.exceptions.RequestException as e:
        print(f"Erro ao rotacionar chave: {e}")
        if e.response:
            print("Detalhes:", e.response.text)
        return None

# Exemplo de uso
# rotate_api_key('SUA_ANTIGA_FORGE_API_KEY')`;


  return (
    <>
      <AppHeader allProjects={[]} />
      <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-primary">Documentação da API</h1>
          <p className="text-lg text-muted-foreground">
            Guia completo para integrar e utilizar o serviço de upload de arquivos do File Forge.
          </p>
        </div>

        {/* REGISTER ENDPOINT */}
        <section id="register" className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Registro de Usuário</h2>
          <p>
            Cria um novo usuário e retorna uma chave de API (`forge_api_key`) para autenticar requisições futuras.
          </p>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-base font-semibold">POST</Badge>
            <code className="text-base font-mono p-2 bg-muted rounded-md">https://uploader.nativespeak.app/register</code>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Corpo da Requisição (JSON)</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Obrigatório</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell><code className="font-mono">email</code></TableCell>
                  <TableCell>String</TableCell>
                  <TableCell>Sim</TableCell>
                  <TableCell>O e-mail do novo usuário.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code className="font-mono">password</code></TableCell>
                  <TableCell>String</TableCell>
                  <TableCell>Sim</TableCell>
                  <TableCell>A senha do novo usuário.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Resposta de Sucesso (201 Created)</h3>
            <CodeBlock language="json" code={`{
  "message": "User created successfully",
  "user": {
    "ID": 2,
    "Email": "user@example.com",
    "Password": "",
    "ForgeAPIKey": "1f98f668-179a-4a4e-9b54-3a8528a51784",
    "CreatedAt": "2025-12-14T08:39:27.421Z",
    "Projects": null
  },
  "forge_api_key": "1f98f668-179a-4a4e-9b54-3a8528a51784"
}`} />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Exemplos de Código</h3>
            <Tabs defaultValue="curl" className="w-full">
              <TabsList>
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
              </TabsList>
              <TabsContent value="curl">
                <CodeBlock language="bash" code={registerUserCurl} />
              </TabsContent>
              <TabsContent value="javascript">
                <CodeBlock language="javascript" code={registerUserJs} />
              </TabsContent>
              <TabsContent value="python">
                <CodeBlock language="python" code={registerUserPython} />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* LOGIN ENDPOINT */}
        <section id="login" className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Login de Usuário</h2>
          <p>
            Autentica um usuário e retorna um token JWT para ser usado em requisições subsequentes (não usado atualmente, prefira a API Key).
          </p>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-base font-semibold">POST</Badge>
            <code className="text-base font-mono p-2 bg-muted rounded-md">https://uploader.nativespeak.app/login</code>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Corpo da Requisição (JSON)</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Obrigatório</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell><code className="font-mono">email</code></TableCell>
                  <TableCell>String</TableCell>
                  <TableCell>Sim</TableCell>
                  <TableCell>O e-mail do usuário.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code className="font-mono">password</code></TableCell>
                  <TableCell>String</TableCell>
                  <TableCell>Sim</TableCell>
                  <TableCell>A senha do usuário.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Resposta de Sucesso (200 OK)</h3>
            <CodeBlock language="json" code={`{
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`} />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Exemplos de Código</h3>
            <Tabs defaultValue="curl" className="w-full">
              <TabsList>
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
              </TabsList>
              <TabsContent value="curl">
                <CodeBlock language="bash" code={loginUserCurl} />
              </TabsContent>
              <TabsContent value="javascript">
                <CodeBlock language="javascript" code={loginUserJs} />
              </TabsContent>
              <TabsContent value="python">
                <CodeBlock language="python" code={loginUserPython} />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* ROTATE API KEY ENDPOINT */}
        <section id="rotate-key" className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Rotacionar API Key (Autenticado)</h2>
          <p>
            Invalida a chave de API (`forge_api_key`) atual e gera uma nova. A chave antiga deixa de funcionar imediatamente.
          </p>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-base font-semibold">POST</Badge>
            <code className="text-base font-mono p-2 bg-muted rounded-md">https://uploader.nativespeak.app/api/user/rotate-api-key</code>
          </div>

           <div className="space-y-2">
            <h3 className="text-lg font-semibold">Headers</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Header</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell><code className="font-mono">Authorization</code></TableCell>
                  <TableCell>Sua `forge_api_key` atual que você deseja rotacionar.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Resposta de Sucesso (200 OK)</h3>
            <CodeBlock language="json" code={`{
  "message": "API key rotated successfully",
  "new_api_key": "0c6f4fd0-07a2-4045-bba5-83334ac95ab2"
}`} />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Exemplos de Código</h3>
            <Tabs defaultValue="curl" className="w-full">
              <TabsList>
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
              </TabsList>
              <TabsContent value="curl">
                <CodeBlock language="bash" code={rotateApiKeyCurl} />
              </TabsContent>
              <TabsContent value="javascript">
                <CodeBlock language="javascript" code={rotateApiKeyJs} />
              </TabsContent>
              <TabsContent value="python">
                <CodeBlock language="python" code={rotateApiKeyPython} />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* UPLOAD ENDPOINT */}
        <section id="upload" className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Upload de Arquivo (Autenticado)</h2>
          <p>
            Envia um arquivo para um projeto específico usando autenticação via API Key. Se o projeto não existir, ele será criado.
          </p>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-base font-semibold">POST</Badge>
            <code className="text-base font-mono p-2 bg-muted rounded-md">https://uploader.nativespeak.app/api/upload</code>
          </div>
          
           <div className="space-y-2">
            <h3 className="text-lg font-semibold">Headers</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Header</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell><code className="font-mono">Authorization</code></TableCell>
                  <TableCell>Sua `forge_api_key` obtida no registro ou na rotação.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Parâmetros (multipart/form-data)</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parâmetro</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Obrigatório</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell><code className="font-mono">project</code></TableCell>
                  <TableCell>String</TableCell>
                  <TableCell>Sim</TableCell>
                  <TableCell>Nome do projeto.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code className="font-mono">file</code></TableCell>
                  <TableCell>File</TableCell>
                  <TableCell>Sim</TableCell>
                  <TableCell>O arquivo a ser enviado.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Resposta de Sucesso (201 Created)</h3>
            <CodeBlock language="json" code={`{
  "message": "File uploaded successfully",
  "url": "https://uploader.nativespeak.app/files/user_2/docph/guerra-20251214-100932.png",
  "project": "docph",
  "file": "guerra-20251214-100932.png"
}`} />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Exemplos de Código</h3>
            <Tabs defaultValue="curl" className="w-full">
              <TabsList>
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
              </TabsList>
              <TabsContent value="curl">
                <CodeBlock language="bash" code={uploadCurl} />
              </TabsContent>
              <TabsContent value="javascript">
                <CodeBlock language="javascript" code={uploadJs} />
              </TabsContent>
              <TabsContent value="python">
                <CodeBlock language="python" code={uploadPython} />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* LIST PROJECTS ENDPOINT */}
        <section id="projects" className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Listar Projetos (Autenticado)</h2>
          <p>
            Retorna a lista de projetos associados à sua chave de API, com informações sobre quantidade de arquivos e tamanho total.
          </p>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-base font-semibold">GET</Badge>
            <code className="text-base font-mono p-2 bg-muted rounded-md">https://uploader.nativespeak.app/api/projects</code>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Headers</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Header</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell><code className="font-mono">Authorization</code></TableCell>
                  <TableCell>Sua `forge_api_key` obtida no registro.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Resposta de Sucesso (200 OK)</h3>
            <CodeBlock language="json" code={`{
  "projects": [
    {
      "name": "meu-projeto",
      "file_count": 15,
      "total_size": 2048576
    },
    {
      "name": "outro-projeto",
      "file_count": 8,
      "total_size": 1024000
    }
  ],
  "total": 3,
  "page": 1,
  "per_page": 10,
  "total_pages": 1
}`} />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Exemplos de Código</h3>
            <Tabs defaultValue="curl" className="w-full">
              <TabsList>
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
              </TabsList>
              <TabsContent value="curl">
                <CodeBlock language="bash" code={listProjectsCurl} />
              </TabsContent>
              <TabsContent value="javascript">
                <CodeBlock language="javascript" code={listProjectsJs} />
              </TabsContent>
              <TabsContent value="python">
                <CodeBlock language="python" code={listProjectsPython} />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* LIST FILES ENDPOINT */}
        <section id="list" className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Listar Arquivos de um Projeto (Autenticado)</h2>
          <p>
            Lista todos os arquivos de um projeto específico usando autenticação via API Key.
          </p>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-base font-semibold">GET</Badge>
            <code className="text-base font-mono p-2 bg-muted rounded-md">https://uploader.nativespeak.app/api/list?project={'{nome}'}</code>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Headers</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Header</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell><code className="font-mono">Authorization</code></TableCell>
                  <TableCell>Sua `forge_api_key` obtida no registro.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Parâmetros (Query)</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parâmetro</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Obrigatório</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell><code className="font-mono">project</code></TableCell>
                  <TableCell>String</TableCell>
                  <TableCell>Sim</TableCell>
                  <TableCell>Nome do projeto a ser consultado.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Resposta de Sucesso (200 OK)</h3>
            <CodeBlock language="json" code={`{
  "project": "meu-projeto",
  "files": [
    {
      "name": "imagem-20240101-120000.jpg",
      "url": "https://uploader.nativespeak.app/files/user_2/meu-projeto/imagem-20240101-120000.jpg",
      "size": 204800,
      "uploaded_at": "2024-01-01T12:00:00Z"
    },
    {
      "name": "documento-20240101-120100.pdf",
      "url": "https://uploader.nativespeak.app/files/user_2/meu-projeto/documento-20240101-120100.pdf",
      "size": 512000,
      "uploaded_at": "2024-01-01T12:01:00Z"
    }
  ],
  "total": 2,
  "page": 1,
  "per_page": 10,
  "total_pages": 1
}`} />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Exemplos de Código</h3>
            <Tabs defaultValue="curl" className="w-full">
              <TabsList>
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
              </TabsList>
              <TabsContent value="curl">
                <CodeBlock language="bash" code={listFilesCurl} />
              </TabsContent>
              <TabsContent value="javascript">
                <CodeBlock language="javascript" code={listFilesJs} />
              </TabsContent>
              <TabsContent value="python">
                <CodeBlock language="python" code={listFilesPython} />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* DELETE FILE ENDPOINT */}
        <section id="delete" className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Deletar Arquivo (Público)</h2>
          <p>
            Remove um arquivo específico de um projeto. Este endpoint é público e não requer autenticação.
          </p>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-base font-semibold bg-destructive text-destructive-foreground">DELETE</Badge>
            <code className="text-base font-mono p-2 bg-muted rounded-md">https://uploader.nativespeak.app/delete?project={'{nome}'}&file={'{arquivo}'}</code>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Parâmetros (Query)</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parâmetro</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Obrigatório</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell><code className="font-mono">project</code></TableCell>
                  <TableCell>String</TableCell>
                  <TableCell>Sim</TableCell>
                  <TableCell>Nome do projeto que contém o arquivo.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code className="font-mono">file</code></TableCell>
                  <TableCell>String</TableCell>
                  <TableCell>Sim</TableCell>
                  <TableCell>Nome do arquivo a ser deletado.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Resposta de Sucesso (200 OK)</h3>
            <CodeBlock language="json" code={`{
  "message": "Arquivo deletado com sucesso",
  "project": "meu-projeto",
  "file": "arquivo-20240101-120000.jpg"
}`} />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Exemplos de Código</h3>
            <Tabs defaultValue="curl" className="w-full">
              <TabsList>
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
              </TabsList>
              <TabsContent value="curl">
                <CodeBlock language="bash" code={deleteFileCurl} />
              </TabsContent>
              <TabsContent value="javascript">
                <CodeBlock language="javascript" code={deleteFileJs} />
              </TabsContent>
              <TabsContent value="python">
                <CodeBlock language="python" code={deleteFilePython} />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* DOWNLOAD FILE ENDPOINT */}
        <section id="download" className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Acessar/Baixar Arquivo</h2>
          <p>
            Acessa ou baixa um arquivo específico através de sua URL pública.
          </p>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-base font-semibold">GET</Badge>
            <code className="text-base font-mono p-2 bg-muted rounded-md">https://uploader.nativespeak.app/files/{'{projeto}'}/{'{arquivo}'}</code>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Exemplo de Uso</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Você pode usar a URL diretamente em elementos HTML como imagens, vídeos ou links de download:
            </p>
            <CodeBlock language="html" code={`<!-- Exibir imagem -->
<img src="https://uploader.nativespeak.app/files/meu-projeto/imagem-20240101-120000.jpg" alt="Imagem" />

<!-- Link para download -->
<a href="https://uploader.nativespeak.app/files/meu-projeto/documento-20240101-120000.pdf" download>
  Baixar Documento
</a>

<!-- Vídeo -->
<video src="https://uploader.nativespeak.app/files/meu-projeto/video-20240101-120000.mp4" controls></video>`} />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Download via cURL</h3>
            <CodeBlock language="bash" code={`curl "https://uploader.nativespeak.app/files/meu-projeto/arquivo-20240101-120000.jpg" -o arquivo-local.jpg`} />
          </div>
        </section>

        {/* ERROR RESPONSES */}
        <section id="errors" className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Respostas de Erro</h2>
          <p>
            A API retorna códigos de status HTTP apropriados e mensagens de erro em formato JSON.
          </p>

          <div>
            <h3 className="text-xl font-semibold mb-2">400 Bad Request</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Requisição inválida ou parâmetros faltando.
            </p>
            <CodeBlock language="json" code={`{
  "error": "Parâmetros 'project' e 'file' são obrigatórios"
}`} />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">401 Unauthorized</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Chave de API inválida ou ausente para endpoints autenticados.
            </p>
            <CodeBlock language="json" code={`{
  "error": "Unauthorized"
}`} />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">404 Not Found</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Recurso não encontrado (projeto ou arquivo inexistente).
            </p>
            <CodeBlock language="json" code={`{
  "error": "Projeto não encontrado"
}`} />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">500 Internal Server Error</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Erro interno do servidor.
            </p>
            <CodeBlock language="json" code={`{
  "error": "Erro ao salvar o arquivo"
}`} />
          </div>
        </section>

        {/* USE CASES */}
        <section id="use-cases" className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Casos de Uso</h2>

          <div>
            <h3 className="text-xl font-semibold mb-2">1. Galeria de Imagens por Projeto</h3>
            <CodeBlock language="javascript" code={`// Criar galeria dinâmica
const createGallery = async (projectName) => {
  const response = await fetch(\`https://uploader.nativespeak.app/list?project=\${projectName}\`);
  const data = await response.json();
  
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = ''; // Limpar galeria
  
  data.files.forEach(file => {
    if (file.name.match(/\\.(jpg|jpeg|png|gif|webp)$/i)) {
      const img = document.createElement('img');
      img.src = file.url;
      img.alt = file.name;
      img.className = 'w-64 h-64 object-cover rounded-lg shadow-lg';
      gallery.appendChild(img);
    }
  });
};

// Usar
createGallery('portfolio');`} />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">2. Upload com Múltiplos Arquivos (Autenticado)</h3>
            <CodeBlock language="javascript" code={`const uploadMultipleFiles = async (files, projectName, apiKey) => {
  const uploadPromises = Array.from(files).map(file => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project', projectName);
    
    return fetch('https://uploader.nativespeak.app/api/upload', {
      method: 'POST',
      headers: { 'Authorization': apiKey },
      body: formData
    }).then(res => res.json());
  });
  
  try {
    const results = await Promise.all(uploadPromises);
    console.log('Todos os arquivos foram enviados:', results);
    return results;
  } catch (error) {
    console.error('Erro no upload:', error);
    throw error;
  }
};

// Usar com input file
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', (e) => {
  uploadMultipleFiles(e.target.files, 'meu-projeto', 'SUA_FORGE_API_KEY');
});`} />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">3. Dashboard de Estatísticas</h3>
            <CodeBlock language="javascript" code={`const getDashboardStats = async () => {
  const response = await fetch('https://uploader.nativespeak.app/projects');
  const data = await response.json();
  
  const stats = {
    totalProjects: data.total,
    totalFiles: data.projects.reduce((sum, p) => sum + p.file_count, 0),
    totalSize: data.projects.reduce((sum, p) => sum + p.total_size, 0),
    projects: data.projects.map(p => ({
      name: p.name,
      files: p.file_count,
      size: (p.total_size / 1024 / 1024).toFixed(2) + ' MB'
    }))
  };
  
  console.log('Estatísticas:', stats);
  return stats;
};`} />
          </div>
        </section>

        {/* BEST PRACTICES */}
        <section id="best-practices" className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Melhores Práticas</h2>
          
          <div className="space-y-3">
             <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">🔑 Gerenciamento de Chaves</h4>
              <p className="text-sm text-muted-foreground">
                Guarde sua \`forge_api_key\` de forma segura no lado do servidor. Use o endpoint de rotação periodicamente para maior segurança.
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">📁 Organização por Projetos</h4>
              <p className="text-sm text-muted-foreground">
                Use nomes de projeto significativos que reflitam a estrutura do seu aplicativo. Exemplo: "user-avatars", "product-images", "documents-2024".
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">🔒 Segurança</h4>
              <p className="text-sm text-muted-foreground">
                Nomes de projetos são automaticamente sanitizados para segurança. Caracteres especiais como "..", "/", "\\" são removidos ou substituídos. Endpoints que não estão sob o prefixo \`/api\` são públicos por padrão.
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">⏰ Timestamps Automáticos</h4>
              <p className="text-sm text-muted-foreground">
                Todos os arquivos recebem timestamps automáticos (formato: YYYYMMDD-HHMMSS) para evitar conflitos de nomes e facilitar a ordenação cronológica.
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">🚀 Performance</h4>
              <p className="text-sm text-muted-foreground">
                Para uploads de múltiplos arquivos, use Promise.all() para enviar em paralelo e melhorar a performance.
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">📊 Monitoramento</h4>
              <p className="text-sm text-muted-foreground">
                Use o endpoint /projects regularmente para monitorar o uso de espaço e quantidade de arquivos por projeto.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
