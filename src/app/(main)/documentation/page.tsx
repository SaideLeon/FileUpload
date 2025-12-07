import { CodeBlock } from '@/components/code-block';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AppHeader } from '@/components/app-header';

export default function DocumentationPage() {
    const curlExample = `curl -X POST "https://uploader.nativespeak.app/upload" \\
 -H "Content-Type: multipart/form-data" \\
 -F "project=meu-projeto-incrivel" \\
 -F "file=@/caminho/para/seu/arquivo.jpg"`;

    const jsExample = `const uploadFile = async (file, projectName) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('project', projectName);

  try {
    const response = await fetch('https://uploader.nativespeak.app/upload', {
      method: 'POST',
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

    const pythonExample = `import requests

def upload_file(file_path, project_name):
    url = "https://uploader.nativespeak.app/upload"
    
    with open(file_path, 'rb') as f:
        files = {
            'file': (f.name, f, 'image/jpeg') 
        }
        data = {
            'project': project_name
        }
        
        try:
            response = requests.post(url, files=files, data=data)
            response.raise_for_status()  # Lança erro para status 4xx/5xx
            
            print("Sucesso:", response.json())
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Erro no upload: {e}")
            if e.response:
                print("Detalhes:", e.response.text)
            return None

# Exemplo de uso
# upload_file('/caminho/para/seu/arquivo.jpg', 'meu-projeto-incrivel')`;

  return (
    <>
      <AppHeader allProjects={[]} />
      <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-8 max-w-4xl mx-auto">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-primary">Documentação da API</h1>
          <p className="text-lg text-muted-foreground">
            Guia completo para integrar e utilizar o serviço de upload de arquivos do File Forge.
          </p>
        </div>

        <section id="endpoint" className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Endpoint de Upload</h2>
          <p>
            Para fazer o upload de um arquivo, envie uma requisição `POST` para o seguinte endpoint:
          </p>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-base font-semibold">POST</Badge>
            <code className="text-base font-mono p-2 bg-muted rounded-md">https://uploader.nativespeak.app/upload</code>
          </div>
        </section>

        <section id="parameters" className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Parâmetros</h2>
          <p>
            A requisição deve ser do tipo <code className="font-mono p-1 bg-muted rounded">multipart/form-data</code> e conter os seguintes campos:
          </p>
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
                <TableCell>O nome do projeto ao qual o arquivo pertence. Se o projeto não existir, ele será criado automaticamente.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><code className="font-mono">file</code></TableCell>
                <TableCell>File</TableCell>
                <TableCell>Sim</TableCell>
                <TableCell>O arquivo a ser enviado.</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>

        <section id="responses" className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Respostas da API</h2>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Resposta de Sucesso (200 OK)</h3>
            <p className="mb-2">
              Quando o upload é bem-sucedido, a API retorna um objeto JSON com uma mensagem de sucesso e os detalhes do arquivo.
            </p>
            <CodeBlock language="json" code={`{
  "message": "Upload bem sucedido",
  "url": "https://uploader.nativespeak.app/files/seu-projeto/arquivo-1672531200.jpg",
  "project": "seu-projeto",
  "file": "arquivo-1672531200.jpg"
}`} />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Respostas de Erro</h3>
            <p className="mb-2">
              Se ocorrer um problema, a API retornará um código de status de erro e um objeto JSON com a descrição do erro.
            </p>
            <h4 className="font-semibold mt-4 mb-2">Requisição Inválida (400 Bad Request)</h4>
            <CodeBlock language="json" code={`{
  "error": "Projeto não especificado"
}`} />
            <h4 className="font-semibold mt-4 mb-2">Erro Interno do Servidor (500 Internal Server Error)</h4>
            <CodeBlock language="json" code={`{
  "error": "Falha ao salvar o arquivo"
}`} />
          </div>
        </section>

        <section id="examples" className="space-y-4">
            <h2 className="text-2xl font-semibold border-b pb-2">Exemplos de Código</h2>

            <div>
                <h3 className="text-xl font-semibold mb-2">cURL</h3>
                <CodeBlock language="bash" code={curlExample} />
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-2">JavaScript (Fetch API)</h3>
                <CodeBlock language="javascript" code={jsExample} />
            </div>
             <div>
                <h3 className="text-xl font-semibold mb-2">Python (Requests)</h3>
                <CodeBlock language="python" code={pythonExample} />
            </div>
        </section>
      </main>
    </>
  );
}
