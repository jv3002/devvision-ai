import { useEffect, useState } from "react";
import { getProjects } from "../api/projects.api";

export default function ProjectSelector({ onSelect }) {

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects();

        console.log("📦 proyectos:", data);

        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          setProjects([]);
        }

      } catch (error) {
        console.error("❌ Error cargando proyectos:", error);
        setProjects([]);
      }
    };

    loadProjects();
  }, []);

  return (
    <div className="bg-white shadow p-4 rounded">

      <h2 className="font-bold mb-2">📂 Seleccionar Proyecto</h2>

      <select
        className="border p-2 w-full"
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">-- Selecciona --</option>

        {projects.map(p => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}

      </select>

    </div>
  );
}