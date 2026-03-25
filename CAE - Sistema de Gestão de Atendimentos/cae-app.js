/* ═══════════════════════════════════════
   CAE — Sistema de Gestão de Atendimentos
   Lógica e Dados do Sistema
   ═══════════════════════════════════════ */

// ─── BANCO DE DADOS (simulado) ───
const DB = {
  empreendedores: [
    { id:1, nome:'João da Silva',    cpf:'123.456.789-01', email:'joao@email.com',    tel:'(79)99801-2233', tipo:'MEI',            segmento:'Comércio',     consultor:'Carlos Mendes',  servico:'Consultoria Fiscal',  obs:'Pendência com Receita Federal', status:'ativo'   },
    { id:2, nome:'Maria Alves',      cpf:'234.567.890-12', email:'maria@email.com',   tel:'(79)99802-3344', tipo:'Microempresa',    segmento:'Alimentação',  consultor:'Laura Costa',    servico:'Plano de Negócios',   obs:'Solicitou financiamento',       status:'ativo'   },
    { id:3, nome:'Pedro Oliveira',   cpf:'345.678.901-23', email:'pedro@email.com',   tel:'(79)99803-4455', tipo:'Autônomo',        segmento:'Serviços',     consultor:'Roberto Lima',   servico:'Micro Crédito',       obs:'Documentação incompleta',       status:'pendente'},
    { id:4, nome:'Luana Ferreira',   cpf:'456.789.012-34', email:'luana@email.com',   tel:'(79)99804-5566', tipo:'MEI',            segmento:'Artesanato',   consultor:'Ana Silva',      servico:'Regularização MEI',   obs:'',                              status:'ativo'   },
    { id:5, nome:'Rodrigo Santos',   cpf:'567.890.123-45', email:'rodrigo@email.com', tel:'(79)99805-6677', tipo:'Pequena Empresa', segmento:'Tecnologia',   consultor:'Fernanda Rocha', servico:'Marketing Digital',   obs:'Novo cadastro',                 status:'ativo'   },
    { id:6, nome:'Carla Mendonça',   cpf:'678.901.234-56', email:'carla@email.com',   tel:'(79)99806-7788', tipo:'MEI',            segmento:'Saúde',        consultor:'Carlos Mendes',  servico:'Consultoria Fiscal',  obs:'',                              status:'ativo'   },
  ],
  atendimentos: [
    { id:1, empreendId:1, empreend:'João da Silva',  consultor:'Carlos Mendes',  servico:'Consultoria Fiscal',  data:'24/03/2026', hora:'09:30', status:'concluido', encam:'',              desc:'Orientação sobre enquadramento tributário. Regularização Receita encaminhada.' },
    { id:2, empreendId:2, empreend:'Maria Alves',    consultor:'Laura Costa',    servico:'Plano de Negócios',   data:'24/03/2026', hora:'10:00', status:'andamento', encam:'Crédito',       desc:'Canvas Business Model iniciado. Próxima reunião agendada para 31/03.' },
    { id:3, empreendId:3, empreend:'Pedro Oliveira', consultor:'Roberto Lima',   servico:'Micro Crédito',       data:'24/03/2026', hora:'10:30', status:'pendente',  encam:'',              desc:'Documentação solicitada: RG, CPF, comprovante de renda.' },
    { id:4, empreendId:4, empreend:'Luana Ferreira', consultor:'Ana Silva',      servico:'Regularização MEI',   data:'24/03/2026', hora:'11:00', status:'agendado',  encam:'',              desc:'' },
    { id:5, empreendId:1, empreend:'João da Silva',  consultor:'Carlos Mendes',  servico:'Consultoria Fiscal',  data:'10/02/2026', hora:'14:00', status:'concluido', encam:'',              desc:'Primeiro atendimento. Abertura de MEI, documentação listada.' },
    { id:6, empreendId:2, empreend:'Maria Alves',    consultor:'Ana Silva',      servico:'Triagem',             data:'05/03/2026', hora:'09:00', status:'concluido', encam:'Plano de Negócios', desc:'Triagem inicial concluída. Encaminhada para consultoria de plano de negócios.' },
    { id:7, empreendId:5, empreend:'Rodrigo Santos', consultor:'Fernanda Rocha', servico:'Marketing Digital',   data:'20/03/2026', hora:'15:30', status:'concluido', encam:'',              desc:'Estratégia de redes sociais definida. Instagram e Google Meu Negócio.' },
  ],
  mensagens: {
    'Carlos Mendes': [
      { de:'Carlos Mendes', txt:'Oi Ana! O Pedro Oliveira veio buscar o micro crédito mas está sem a documentação completa. Consegue entrar em contato com ele?', hora:'09:15' },
      { de:'eu',            txt:'Entendido! Já vou tentar falar com ele pelo telefone cadastrado.',                                                                hora:'09:18' },
      { de:'Carlos Mendes', txt:'Obrigado! Caso não consiga, vou encaminhar pro fluxo de pendência formal.',                                                       hora:'09:20' },
      { de:'eu',            txt:'Ok, vou registrar a pendência no sistema também.',                                                                                hora:'09:22' },
    ],
    'Laura Costa': [
      { de:'Laura Costa', txt:'Ana, a Maria Alves precisa do Canvas Business Model para a próxima sessão. Você tem o template salvo?', hora:'10:05' },
      { de:'eu',          txt:'Tenho sim! Vou enviar por e-mail agora para a Maria.',                                                  hora:'10:08' },
    ],
    'Roberto Lima':   [],
    'Fernanda Rocha': [
      { de:'Fernanda Rocha', txt:'Bom dia! Ontem realizei o atendimento com o Rodrigo Santos. Vou registrar no sistema.', hora:'08:30' },
    ],
  }
};

// ─── ESTADO GLOBAL ───
let chatAtivo  = 'Carlos Mendes';
let filtroTipo = 'todos';
let iaIdx      = 0;

// ─── UTILITÁRIOS ───
const avCores = ['av-teal', 'av-amber', 'av-blue', 'av-rose'];

function avCor(nome) {
  return avCores[nome.charCodeAt(0) % 4];
}

function initiais(n) {
  const p = n.split(' ');
  return (p[0][0] + (p[p.length - 1][0] || '')).toUpperCase();
}

function badgeStatus(s) {
  const mapa = {
    concluido: 'badge-green',
    andamento: 'badge-yellow',
    pendente:  'badge-red',
    agendado:  'badge-blue',
    ativo:     'badge-green',
    inativo:   'badge-gray'
  };
  const labels = {
    concluido: 'Concluído',
    andamento: 'Em andamento',
    pendente:  'Pendente',
    agendado:  'Agendado',
    ativo:     'Ativo'
  };
  return `<span class="badge ${mapa[s] || 'badge-gray'}">${labels[s] || s}</span>`;
}

// ─── NAVEGAÇÃO ───
function nav(id) {
  const navIds = ['dashboard', 'empreendedores', 'atendimentos', 'historico', 'mensagens', 'relatorios', 'ia'];
  const titles = {
    dashboard:       'Dashboard',
    empreendedores:  'Empreendedores',
    atendimentos:    'Atendimentos',
    historico:       'Histórico',
    mensagens:       'Mensagens',
    relatorios:      'Relatórios',
    ia:              'Assistente IA'
  };
  const subs = {
    dashboard:       '— Visão geral do sistema',
    empreendedores:  '— Cadastro centralizado',
    atendimentos:    '— Registros de atendimento',
    historico:       '— Rastreabilidade por empreendedor',
    mensagens:       '— Comunicação interna',
    relatorios:      '— Dados consolidados',
    ia:              '— Suporte inteligente'
  };

  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  const idx = navIds.indexOf(id);
  document.querySelectorAll('.nav-item')[idx]?.classList.add('active');

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id)?.classList.add('active');

  document.getElementById('topbar-title').textContent = titles[id] || id;
  document.getElementById('topbar-sub').textContent   = subs[id]   || '';

  if (id === 'mensagens') renderChat();
}

// ─── MODAIS ───
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// Fecha modal ao clicar no overlay
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => {
      if (e.target === m) m.classList.remove('open');
    });
  });
});

// ─── TOAST ───
function toast(msg, isErr = false) {
  const t = document.getElementById('toast');
  const m = document.getElementById('toast-msg');
  t.className = 'toast' + (isErr ? ' error' : '');
  m.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

// ─── FILTROS ───
function setFilter(el, type, val) {
  el.closest('.filter-row').querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  if (type === 'tipo') filtroTipo = val;
  renderEmpreend();
}

// ─── DASHBOARD ───
function renderDashboard() {
  // Tabela de atendimentos recentes
  const tbody = document.getElementById('dash-table');
  tbody.innerHTML = DB.atendimentos.slice(0, 5).map(a => `
    <tr class="atend-row" onclick="verDetalhe(${a.id})">
      <td>
        <div style="display:flex;align-items:center;gap:8px;">
          <div class="av ${avCor(a.empreend)} av-lg">${initiais(a.empreend)}</div>
          <span class="td-bold">${a.empreend}</span>
        </div>
      </td>
      <td>${a.servico}</td>
      <td>${a.consultor}</td>
      <td style="white-space:nowrap">${a.data} ${a.hora}</td>
      <td>${badgeStatus(a.status)}</td>
    </tr>`).join('');

  // Notificações
  const notifs = [
    { icon:'⚠️', bg:'#fff8e6', title:'Pedro Oliveira — documentação pendente',  sub:'Há 3 dias sem resposta',       unread:true  },
    { icon:'💬', bg:'#e8f2fb', title:'Carlos Mendes enviou uma mensagem',        sub:'09:20 · "Ok, vou registrar..."',unread:true  },
    { icon:'✅', bg:'#e0f7f1', title:'Relatório de fevereiro gerado',            sub:'Automaticamente às 00:01',      unread:false },
    { icon:'📋', bg:'#e0f7f1', title:'7 atendimentos registrados hoje',          sub:'Última atualização: agora',     unread:false },
  ];
  document.getElementById('notif-list').innerHTML = notifs.map(n => `
    <div class="notif-item${n.unread ? ' unread' : ''}">
      <div class="notif-icon" style="background:${n.bg}">${n.icon}</div>
      <div class="notif-text">
        <div class="notif-title">${n.title}</div>
        <div class="notif-sub">${n.sub}</div>
      </div>
      ${n.unread ? '<div class="notif-dot-unread"></div>' : ''}
    </div>`).join('');

  // Gráfico de barras — semana
  const dias = ['Seg','Ter','Qua','Qui','Sex','Sáb'];
  const vals = [32, 28, 41, 35, 38, 18];
  const max  = Math.max(...vals);
  document.getElementById('bar-semana').innerHTML = dias.map((d, i) => `
    <div class="bar-col">
      <div class="bar-fill" style="height:${(vals[i] / max * 100)}%;" title="${vals[i]} atendimentos"></div>
      <div class="bar-lbl">${d}</div>
    </div>`).join('');

  // Serviços mais demandados
  const servs = [
    ['Consultoria Fiscal', 38],
    ['Plano de Negócios',  25],
    ['Micro Crédito',      20],
    ['Regularização MEI',  17],
  ];
  document.getElementById('servicos-bars').innerHTML = servs.map(([s, p]) => `
    <div style="margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;font-size:.72rem;color:var(--text-2);margin-bottom:4px;">
        <span>${s}</span><span style="font-weight:600">${p}%</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${p}%"></div></div>
    </div>`).join('');
}

// ─── EMPREENDEDORES ───
function renderEmpreend(q = '') {
  const tbody = document.getElementById('empreend-table');
  const lista = DB.empreendedores.filter(e => {
    const matchQ = !q || e.nome.toLowerCase().includes(q.toLowerCase()) || e.cpf.includes(q);
    const matchT = filtroTipo === 'todos' || e.tipo === filtroTipo;
    return matchQ && matchT;
  });

  if (!lista.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty"><p>Nenhum empreendedor encontrado.</p></div></td></tr>`;
    return;
  }

  const qtdAtend = e => DB.atendimentos.filter(a => a.empreendId === e.id).length;
  tbody.innerHTML = lista.map(e => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:8px;">
          <div class="av ${avCor(e.nome)} av-lg">${initiais(e.nome)}</div>
          <div>
            <div class="td-bold">${e.nome}</div>
            <div style="font-size:.68rem;color:var(--text-3)">${e.cpf}</div>
          </div>
        </div>
      </td>
      <td>${e.tipo}</td>
      <td>${e.segmento}</td>
      <td>${e.consultor || '—'}</td>
      <td><span style="font-weight:600;color:var(--teal-700)">${qtdAtend(e)}</span></td>
      <td>${badgeStatus(e.status)}</td>
      <td>
        <div style="display:flex;gap:4px;">
          <button class="btn btn-outline" style="padding:4px 10px;font-size:.7rem;" onclick="verHistoricoEmp(${e.id})">Histórico</button>
          <button class="btn btn-outline" style="padding:4px 10px;font-size:.7rem;" onclick="editarEmp(${e.id})">Editar</button>
        </div>
      </td>
    </tr>`).join('');

  // Atualiza select no modal de atendimento
  const sel = document.getElementById('a-empreend');
  if (sel) {
    sel.innerHTML = '<option value="">Selecionar...</option>' +
      DB.empreendedores.map(e => `<option value="${e.id}">${e.nome}</option>`).join('');
  }
}

function filterEmpreed(q) { renderEmpreend(q); }

// ─── ATENDIMENTOS ───
function renderAtend() {
  const tbody = document.getElementById('atend-table');
  tbody.innerHTML = DB.atendimentos.map(a => `
    <tr class="atend-row">
      <td>
        <div style="display:flex;align-items:center;gap:8px;">
          <div class="av ${avCor(a.empreend)}">${initiais(a.empreend)}</div>
          <span class="td-bold">${a.empreend}</span>
        </div>
      </td>
      <td>${a.servico}</td>
      <td>${a.consultor}</td>
      <td style="white-space:nowrap;font-size:.75rem">${a.data} ${a.hora}</td>
      <td>${badgeStatus(a.status)}</td>
      <td>${a.encam
        ? `<span class="badge badge-blue">${a.encam}</span>`
        : '<span style="color:var(--text-3);font-size:.72rem">—</span>'
      }</td>
      <td>
        <button class="btn btn-outline" style="padding:4px 10px;font-size:.7rem;" onclick="verDetalhe(${a.id})">Ver</button>
      </td>
    </tr>`).join('');
}

function verDetalhe(id) {
  const a = DB.atendimentos.find(x => x.id === id);
  if (!a) return;

  document.getElementById('detalhe-atend-body').innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;padding:12px;background:var(--bg);border-radius:var(--r-sm);">
      <div class="av ${avCor(a.empreend)} av-lg" style="width:44px;height:44px;font-size:.85rem;">${initiais(a.empreend)}</div>
      <div>
        <div style="font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;">${a.empreend}</div>
        <div style="font-size:.75rem;color:var(--text-3);">${a.servico} · ${a.data} ${a.hora}</div>
      </div>
      <div style="margin-left:auto;">${badgeStatus(a.status)}</div>
    </div>
    <div class="form-grid" style="margin-bottom:14px;">
      <div>
        <div style="font-size:.68rem;font-weight:600;text-transform:uppercase;color:var(--text-3);margin-bottom:3px;">Consultor</div>
        <div style="font-size:.85rem;font-weight:500;">${a.consultor}</div>
      </div>
      <div>
        <div style="font-size:.68rem;font-weight:600;text-transform:uppercase;color:var(--text-3);margin-bottom:3px;">Modalidade</div>
        <div style="font-size:.85rem;font-weight:500;">Presencial</div>
      </div>
    </div>
    ${a.desc ? `
    <div style="margin-bottom:14px;">
      <div style="font-size:.68rem;font-weight:600;text-transform:uppercase;color:var(--text-3);margin-bottom:6px;">Descrição / Anotações</div>
      <div style="font-size:.82rem;color:var(--text-2);line-height:1.6;background:var(--bg);padding:10px 12px;border-radius:var(--r-sm);">${a.desc}</div>
    </div>` : ''}
    ${a.encam ? `
    <div>
      <div style="font-size:.68rem;font-weight:600;text-transform:uppercase;color:var(--text-3);margin-bottom:6px;">Encaminhamento</div>
      <span class="badge badge-blue">${a.encam}</span>
    </div>` : ''}
  `;
  openModal('modal-detalhe-atend');
}

// ─── HISTÓRICO ───
function renderHistoricoLista() {
  const list = document.getElementById('hist-list');
  list.innerHTML = DB.empreendedores.map(e => {
    const ats = DB.atendimentos.filter(a => a.empreendId === e.id);
    return `
      <div class="chat-item" onclick="verHistoricoEmp(${e.id})">
        <div class="chat-item-header">
          <div class="av ${avCor(e.nome)}" style="width:26px;height:26px;font-size:.6rem;">${initiais(e.nome)}</div>
          <div class="chat-item-name">${e.nome}</div>
        </div>
        <div class="chat-item-prev">${e.tipo} · ${ats.length} atend.</div>
      </div>`;
  }).join('');
}

function verHistoricoEmp(id) {
  const e   = DB.empreendedores.find(x => x.id === id);
  if (!e) return;
  const ats    = DB.atendimentos.filter(a => a.empreendId === id);
  const detail = document.getElementById('hist-detail');

  // Marcar item ativo na lista
  document.querySelectorAll('#hist-list .chat-item').forEach((el, i) => {
    el.classList.toggle('active', DB.empreendedores[i].id === id);
  });

  detail.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border);">
      <div class="av ${avCor(e.nome)}" style="width:48px;height:48px;font-size:.9rem;font-weight:700;">${initiais(e.nome)}</div>
      <div>
        <div style="font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:700;">${e.nome}</div>
        <div style="font-size:.75rem;color:var(--text-3);">${e.cpf} · ${e.email} · ${e.tel}</div>
        <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap;">
          <span class="badge badge-green">${e.tipo}</span>
          <span class="badge badge-blue">${e.segmento}</span>
          ${badgeStatus(e.status)}
        </div>
      </div>
      <div style="margin-left:auto;text-align:right;">
        <div style="font-size:.68rem;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;">Consultor</div>
        <div style="font-size:.85rem;font-weight:600;">${e.consultor || '—'}</div>
        <div style="font-size:.68rem;color:var(--text-3);margin-top:8px;text-transform:uppercase;letter-spacing:.05em;">Serviço atual</div>
        <div style="font-size:.82rem;font-weight:500;">${e.servico || '—'}</div>
      </div>
    </div>
    ${e.obs ? `
    <div style="background:#fff8e6;border:1px solid #f5d77e;border-radius:var(--r-sm);padding:10px 12px;margin-bottom:16px;font-size:.78rem;color:#7a4800;">
      ⚠️ ${e.obs}
    </div>` : ''}
    <div style="font-family:'Syne',sans-serif;font-size:.9rem;font-weight:700;margin-bottom:14px;">
      Histórico de Atendimentos (${ats.length})
    </div>
    ${ats.length === 0
      ? `<div class="empty"><p>Nenhum atendimento registrado ainda.</p></div>`
      : `<div class="timeline">
          ${ats.map(a => `
            <div class="tl-item">
              <div class="tl-dot"></div>
              <div class="tl-head">
                <div class="tl-date">${a.data} ${a.hora} · ${a.consultor}</div>
                ${badgeStatus(a.status)}
              </div>
              <div style="font-size:.8rem;font-weight:600;margin-bottom:4px;">${a.servico}</div>
              ${a.desc ? `<div class="tl-body">${a.desc}</div>` : ''}
              ${a.encam ? `<div style="margin-top:6px;"><span class="badge badge-blue">↗ Encaminhado: ${a.encam}</span></div>` : ''}
            </div>`).join('')}
        </div>`
    }
  `;
}

function filterHistorico(q) {
  document.querySelectorAll('#hist-list .chat-item').forEach((el, i) => {
    const e = DB.empreendedores[i];
    el.style.display = (!q || e.nome.toLowerCase().includes(q.toLowerCase())) ? '' : 'none';
  });
}

// ─── SALVAR EMPREENDEDOR ───
function salvarEmpreend() {
  const nome     = document.getElementById('f-nome').value.trim();
  const cpf      = document.getElementById('f-cpf').value.trim();
  const tipo     = document.getElementById('f-tipo').value;
  const segmento = document.getElementById('f-segmento').value;

  // Validação
  const campos = ['f-nome', 'f-cpf', 'f-tipo', 'f-segmento'];
  campos.forEach(id => {
    const el = document.getElementById(id);
    el.classList.toggle('error', !el.value.trim());
  });
  if (!nome || !cpf || !tipo || !segmento) {
    toast('Preencha os campos obrigatórios', true);
    return;
  }

  const novo = {
    id:       DB.empreendedores.length + 1,
    nome,     cpf,
    email:    document.getElementById('f-email').value,
    tel:      document.getElementById('f-tel').value,
    tipo,     segmento,
    consultor:document.getElementById('f-consultor').value,
    servico:  document.getElementById('f-servico').value,
    obs:      document.getElementById('f-obs').value,
    status:   'ativo'
  };

  DB.empreendedores.push(novo);
  closeModal('modal-cadastro');

  // Limpar campos
  ['f-nome','f-cpf','f-email','f-tel','f-tipo','f-segmento','f-consultor','f-servico','f-obs'].forEach(id => {
    const el = document.getElementById(id);
    el.value = '';
    el.classList.remove('error');
  });

  renderEmpreend();
  renderDashboard();
  renderHistoricoLista();
  toast(`✅ ${nome} cadastrado com sucesso!`);
}

// ─── SALVAR ATENDIMENTO ───
function salvarAtend() {
  const eid  = document.getElementById('a-empreend').value;
  const cons = document.getElementById('a-consultor').value;
  const serv = document.getElementById('a-servico').value;

  if (!eid || !cons || !serv) {
    toast('Preencha os campos obrigatórios', true);
    return;
  }

  const e     = DB.empreendedores.find(x => x.id == eid);
  const agora = new Date();
  const pad   = n => String(n).padStart(2, '0');

  const novo = {
    id:         DB.atendimentos.length + 1,
    empreendId: parseInt(eid),
    empreend:   e.nome,
    consultor:  cons,
    servico:    serv,
    data:       `${pad(agora.getDate())}/${pad(agora.getMonth()+1)}/${agora.getFullYear()}`,
    hora:       `${pad(agora.getHours())}:${pad(agora.getMinutes())}`,
    status:     document.getElementById('a-status').value,
    encam:      document.getElementById('a-encam').value,
    desc:       document.getElementById('a-desc').value
  };

  DB.atendimentos.unshift(novo);
  closeModal('modal-novo-atend');

  ['a-empreend','a-consultor','a-servico','a-status','a-encam','a-desc'].forEach(id => {
    document.getElementById(id).value = '';
  });

  renderDashboard();
  renderAtend();
  toast(`✅ Atendimento de ${e.nome} registrado!`);
}

function editarEmp(id) { toast('Edição de cadastro em desenvolvimento.'); }

// ─── CHAT / MENSAGENS ───
function renderChat() {
  const contacts = document.getElementById('chat-contacts');
  const nomes    = Object.keys(DB.mensagens);

  contacts.innerHTML = nomes.map(n => {
    const msgs  = DB.mensagens[n];
    const last  = msgs[msgs.length - 1];
    const unread = (n === 'Carlos Mendes' || n === 'Laura Costa') ? 1 : 0;
    return `
      <div class="chat-item${n === chatAtivo ? ' active' : ''}" onclick="selectChat('${n}')">
        <div class="chat-item-header">
          <div class="av ${avCor(n)}" style="width:26px;height:26px;font-size:.6rem;">${initiais(n)}</div>
          <div class="chat-item-name">${n}</div>
          ${unread && n !== chatAtivo ? `<span class="chat-unread">1</span>` : ''}
          ${last ? `<div class="chat-item-time">${last.hora}</div>` : ''}
        </div>
        <div class="chat-item-prev">${last ? (last.de === 'eu' ? 'Você: ' : '') + last.txt : 'Nenhuma mensagem'}</div>
      </div>`;
  }).join('');

  renderMensagens();
}

function selectChat(nome) {
  chatAtivo = nome;
  document.getElementById('chat-av').className   = `av ${avCor(nome)} av-lg`;
  document.getElementById('chat-av').textContent = initiais(nome);
  document.getElementById('chat-name').textContent = nome;
  renderChat();
}

function renderMensagens() {
  const msgs  = document.getElementById('chat-msgs');
  const lista = DB.mensagens[chatAtivo] || [];
  msgs.innerHTML = lista.map(m => `
    <div class="msg ${m.de === 'eu' ? 'sent' : 'recv'}">
      <div class="msg-bubble">${m.txt}</div>
      <div class="msg-meta">${m.de === 'eu' ? 'Você' : m.de} · ${m.hora}</div>
    </div>`).join('');
  msgs.scrollTop = msgs.scrollHeight;
}

function sendMsg() {
  const input = document.getElementById('chat-input');
  const txt   = input.value.trim();
  if (!txt) return;

  const agora = new Date();
  const hora  = `${String(agora.getHours()).padStart(2,'0')}:${String(agora.getMinutes()).padStart(2,'0')}`;

  DB.mensagens[chatAtivo].push({ de: 'eu', txt, hora });
  input.value = '';
  renderMensagens();

  // Resposta simulada do consultor
  setTimeout(() => {
    const resps = [
      'Entendido! Vou verificar.',
      'Ok, obrigado pela informação!',
      'Já estou providenciando.',
      'Perfeito, fica tranquila.',
      'Vou registrar no sistema agora.'
    ];
    DB.mensagens[chatAtivo].push({
      de:   chatAtivo,
      txt:  resps[Math.floor(Math.random() * resps.length)],
      hora
    });
    renderMensagens();
  }, 1400);
}

function chatKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMsg();
  }
}

// ─── RELATÓRIOS ───
function renderRelatorios() {
  // Gráfico de barras por semana
  const semanas = ['S1','S2','S3','S4'];
  const vals    = [68, 82, 78, 84];
  const max     = Math.max(...vals);

  document.getElementById('bar-rel').innerHTML = semanas.map((s, i) => `
    <div class="bar-col">
      <div style="font-size:.62rem;color:var(--text-3);margin-bottom:3px;">${vals[i]}</div>
      <div class="bar-fill" style="height:${(vals[i] / max * 100)}%;background:var(--teal-400);"></div>
      <div class="bar-lbl">${s}</div>
    </div>`).join('');

  // Serviços
  const servs = [
    ['Consultoria Fiscal', 38, '#0dbf8a'],
    ['Plano de Negócios',  25, '#3dcda2'],
    ['Micro Crédito',      20, '#7ddcbe'],
    ['Regularização MEI',  17, '#b2ead8'],
  ];
  document.getElementById('rel-servicos').innerHTML = servs.map(([s, p, c]) => `
    <div style="margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;font-size:.75rem;margin-bottom:5px;">
        <span style="color:var(--text-2);">${s}</span>
        <span style="font-weight:700;color:var(--teal-700);">${p}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${p}%;background:${c};"></div>
      </div>
    </div>`).join('');

  // Desempenho por consultor
  const consultores = [
    ['Carlos Mendes',  'CM', '90', 90],
    ['Laura Costa',    'LC', '75', 75],
    ['Roberto Lima',   'RL', '68', 68],
    ['Fernanda Rocha', 'FR', '82', 82],
  ];
  document.getElementById('rel-consultores').innerHTML = consultores.map(([n, ab, v, pct]) => `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
      <div class="av ${avCor(n)}" style="width:32px;height:32px;font-size:.68rem;">${ab}</div>
      <div style="flex:1;">
        <div style="display:flex;justify-content:space-between;font-size:.78rem;margin-bottom:4px;">
          <span style="font-weight:500;">${n}</span>
          <span style="font-weight:700;color:var(--teal-700);">${v} atend.</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${pct}%;"></div>
        </div>
      </div>
    </div>`).join('');
}

// ─── ASSISTENTE IA ───
const RESPOSTAS_IA = [
  'Com base nos dados do sistema, esta semana foram realizados 48 atendimentos distribuídos entre os 4 consultores ativos. O pico foi na quarta-feira com 41 atendimentos registrados.',
  'Analisando a carga de trabalho atual, Carlos Mendes possui a maior quantidade de atendimentos ativos (90 no mês), seguido por Fernanda Rocha (82). Recomendo redistribuir 2-3 casos de Carlos para os demais.',
  'Existem 3 empreendedores com pendências abertas: Pedro Oliveira (documentação há 3 dias), Roberto Souza (cadastro incompleto) e Carla M. (retorno aguardado). Deseja que eu gere um relatório de pendências?',
  'Hoje foram registrados 7 atendimentos até o momento: 3 concluídos, 2 em andamento, 1 agendado e 1 pendente. A taxa de conclusão do dia é de 43%, abaixo da média mensal de 89%.',
  'Os serviços mais demandados este mês são: Consultoria Fiscal (38%), Plano de Negócios (25%), Micro Crédito (20%) e Regularização MEI (17%). Sugiro reforçar a equipe de consultoria fiscal.',
];

function sendIA() {
  const input = document.getElementById('ia-input');
  const msgs  = document.getElementById('ia-msgs');
  const txt   = input.value.trim();
  if (!txt) return;

  // Mensagem do usuário
  msgs.innerHTML += `
    <div class="ia-msg user">
      <div class="ia-av">AS</div>
      <div class="ia-bubble">${txt}</div>
    </div>`;

  // Indicador de digitação
  msgs.innerHTML += `
    <div class="ia-msg bot" id="ia-typing">
      <div class="ia-av">IA</div>
      <div class="ia-bubble">
        <div class="typing-dots"><span></span><span></span><span></span></div>
      </div>
    </div>`;

  msgs.scrollTop = msgs.scrollHeight;
  input.value = '';

  // Chamada à API Claude (com fallback para respostas simuladas)
  fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system:     `Você é o assistente inteligente do CAE (Centro de Apoio ao Empreendedor).
Contexto: ${DB.empreendedores.length} empreendedores cadastrados, ${DB.atendimentos.length} atendimentos registrados.
Consultores: Carlos Mendes, Laura Costa, Roberto Lima, Fernanda Rocha.
Responda de forma concisa e útil em português brasileiro, focado em gestão de atendimentos. Máximo 3 parágrafos.`,
      messages: [{ role: 'user', content: txt }]
    })
  })
  .then(r => r.json())
  .then(d => {
    const resp = d.content?.[0]?.text || RESPOSTAS_IA[iaIdx++ % RESPOSTAS_IA.length];
    document.getElementById('ia-typing').outerHTML = `
      <div class="ia-msg bot">
        <div class="ia-av">IA</div>
        <div class="ia-bubble">${resp}</div>
      </div>`;
    msgs.scrollTop = msgs.scrollHeight;
  })
  .catch(() => {
    const resp = RESPOSTAS_IA[iaIdx++ % RESPOSTAS_IA.length];
    document.getElementById('ia-typing').outerHTML = `
      <div class="ia-msg bot">
        <div class="ia-av">IA</div>
        <div class="ia-bubble">${resp}</div>
      </div>`;
    msgs.scrollTop = msgs.scrollHeight;
  });
}

function iaPrompt(btn) {
  document.getElementById('ia-input').value = btn.textContent;
  sendIA();
}

// ─── INICIALIZAÇÃO ───
document.addEventListener('DOMContentLoaded', () => {
  renderDashboard();
  renderEmpreend();
  renderAtend();
  renderHistoricoLista();
  renderRelatorios();

  // Define data/hora atual no modal de atendimento
  const dt = document.getElementById('a-data');
  if (dt) {
    const n = new Date();
    n.setMinutes(n.getMinutes() - n.getTimezoneOffset());
    dt.value = n.toISOString().slice(0, 16);
  }
});
