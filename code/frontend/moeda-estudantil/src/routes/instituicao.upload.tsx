import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/mock-data";
import { GlassCard, PageHeader } from "@/components/ui-bits";
import { Upload, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/instituicao/upload")({
  component: UploadCSV,
});

type Linha = { nome: string; cpf: string; departamento: string; curso: string };

function UploadCSV() {
  const store = useStore();
  const inst = store.instituicoes.find((i) => i.id === store.currentUserId) ?? store.instituicoes[0];
  const [parsed, setParsed] = useState<Linha[]>([]);
  const [fileName, setFileName] = useState("");

  const parseCsv = (text: string) => {
    const lines = text.trim().split(/\r?\n/);
    const rows: Linha[] = [];
    for (let i = 0; i < lines.length; i++) {
      const cells = lines[i].split(",").map((c) => c.trim());
      if (i === 0 && /nome/i.test(cells[0])) continue;
      if (cells.length < 4) continue;
      rows.push({ nome: cells[0], cpf: cells[1], departamento: cells[2], curso: cells[3] });
    }
    return rows;
  };

  const onFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setParsed(parseCsv(String(reader.result)));
    reader.readAsText(file);
  };

  const loadDemo = () => {
    setFileName("exemplo.csv");
    setParsed([
      { nome: "Lucas Andrade", cpf: "111.222.333-44", departamento: "DCC", curso: "Engenharia de Software" },
      { nome: "Mariana Reis", cpf: "222.333.444-55", departamento: "DEE", curso: "Engenharia Elétrica" },
      { nome: "Pedro Nunes", cpf: "333.444.555-66", departamento: "DCC", curso: "Ciência da Computação" },
    ]);
  };

  const confirmar = () => {
    const n = store.addProfessores(parsed.map((p) => ({ nome: p.nome, departamento: p.departamento, instituicao: inst.nome })));
    toast.success(`${n} professores cadastrados com sucesso!`);
    setParsed([]); setFileName("");
  };

  return (
    <div>
      <PageHeader title="Upload CSV" subtitle="Importe professores em lote." />

      <GlassCard className="mb-6">
        <label
          htmlFor="csv"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
          className="block border-2 border-dashed border-white/30 rounded-2xl p-10 text-center cursor-pointer hover:bg-white/5"
        >
          <Upload className="mx-auto h-10 w-10 text-white/70 mb-3" />
          <p className="text-white font-semibold">Arraste o arquivo .csv ou clique para selecionar</p>
          <p className="text-xs text-white/65 mt-1">Formato esperado: <code className="bg-white/10 px-1.5 py-0.5 rounded">Nome, CPF, Departamento, Curso</code></p>
          <input id="csv" type="file" accept=".csv" className="hidden"
            onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        </label>
        <div className="text-center mt-3">
          <button onClick={loadDemo} className="text-xs text-mint hover:underline">Usar dados de exemplo</button>
        </div>
      </GlassCard>

      {parsed.length > 0 && (
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-white">
              <FileText className="h-4 w-4" /><span className="font-semibold">{fileName}</span>
              <span className="text-xs text-white/65">({parsed.length} registros)</span>
            </div>
            <button onClick={confirmar} className="px-4 py-2 rounded-xl bg-mint text-mint-foreground font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Confirmar Import
            </button>
          </div>
          <div className="overflow-auto rounded-xl border border-white/15">
            <table className="w-full text-sm text-white">
              <thead className="bg-white/10 text-xs uppercase">
                <tr><th className="text-left p-2">Nome</th><th className="text-left p-2">CPF</th><th className="text-left p-2">Departamento</th><th className="text-left p-2">Curso</th></tr>
              </thead>
              <tbody>
                {parsed.map((r, i) => (
                  <tr key={i} className="border-t border-white/10">
                    <td className="p-2">{r.nome}</td><td className="p-2">{r.cpf}</td><td className="p-2">{r.departamento}</td><td className="p-2">{r.curso}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
