// js/skill-tree.js

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('skill-tree');
    if (!container) return;

    // 1. Importação Assíncrona
    let skillsData;
    try {
        const module = await import('./skillsData.js');
        skillsData = module.skillsData;
    } catch (err) {
        console.error("Erro ao carregar dados:", err);
        return;
    }

    // 2. Setup de Camadas
    const treeLayer = document.createElement('div');
    treeLayer.classList.add('tree-layer');
    container.appendChild(treeLayer);

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.classList.add('skill-lines-svg');
    treeLayer.appendChild(svg);

    const tooltip = {
        title: document.querySelector('.tooltip-title'),
        status: document.querySelector('.tooltip-status'),
        desc: document.querySelector('.tooltip-desc')
    };

    // 3. Renderizar Nós
    skillsData.forEach((skill, index) => {

        const node = document.createElement('div');
        node.classList.add('skill-node', skill.status === 'mastered' ? 'status-mastered' : 'status-developing');
        node.id = `node-${skill.id}`;
        node.style.left = `${skill.x}%`;
        node.style.top = `${skill.y}%`;
        node.style.animationDelay = `${index * 0.1}s`;

        node.innerHTML = `
    <div class="node-icon">
        <i data-lucide="${skill.icon}"></i>
    </div>
    <span class="node-label">${skill.label}</span>
`;

        node.addEventListener('mouseenter', () => {
            // Atualiza Tooltip
            tooltip.title.textContent = skill.label;
            tooltip.status.textContent = skill.status === 'mastered' ? '// DOMINADO' : '// EVOLUINDO';
            tooltip.status.className = `tooltip-status ${skill.status === 'mastered' ? 'status-green' : 'status-yellow'}`;
            tooltip.desc.textContent = skill.desc;

            // Highlight
            document.querySelectorAll('.skill-node, .connection-line').forEach(el => el.classList.remove('active'));
            node.classList.add('active');
            const parents = skill.parents || (skill.parent ? [skill.parent] : []);
            parents.forEach(pId => document.getElementById(`line-${pId}-${skill.id}`)?.classList.add('active'));
        });

        treeLayer.appendChild(node);
    });

    // Renderizar icones Lucide de uma vez
    lucide.createIcons();

    // 4. Desenhar Linhas (Conexões)
    skillsData.forEach(skill => {
        const parents = skill.parents || (skill.parent ? [skill.parent] : []);
        parents.forEach(pId => {
            const parent = skillsData.find(s => s.id === pId);
            if (parent) {
                const line = document.createElementNS(svgNS, "line");
                line.setAttribute("x1", `${parent.x}%`);
                line.setAttribute("y1", `${parent.y}%`);
                line.setAttribute("x2", `${skill.x}%`);
                line.setAttribute("y2", `${skill.y}%`);
                line.classList.add('connection-line');
                line.id = `line-${pId}-${skill.id}`;
                svg.appendChild(line);
            }
        });
    });

    // 5. Efeito Parallax
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        treeLayer.style.transform = `rotateY(${x * 15}deg) rotateX(${-y * 15}deg)`;

        document.querySelectorAll('.skill-node').forEach(n => {
            n.style.transform = `translate(-50%, -50%) translateZ(20px) rotateY(${-x * 15}deg) rotateX(${y * 15}deg)`;
        });
    });
});