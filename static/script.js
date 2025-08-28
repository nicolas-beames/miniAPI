async function postJSON(url, data) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = payload.error || "Falha na requisição.";
    throw new Error(err);
  }
  return payload;
}

async function getJSON(url) {
  const res = await fetch(url);
  const payload = await res.json();
  if (!res.ok || !payload.ok) {
    throw new Error(payload.error || "Falha ao carregar dados.");
  }
  return payload;
}

function showMessage(text, ok=true) {
  const el = document.getElementById("msg");
  el.textContent = text;
  el.style.color = ok ? "green" : "crimson";
}

function renderTable(rows) {
  const wrap = document.getElementById("tableWrap");
  if (!rows.length) {
    wrap.innerHTML = "<p>Nenhum registro ainda.</p>";
    return;
  }
  const head = `<tr><th>texto</th></tr>`;
  const body = rows.map(r =>
    `<tr><td>${r.texto}</td></tr>`
  ).join("");
  wrap.innerHTML = `<table><thead>${head}</thead><tbody>${body}</tbody></table>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  const btnListar = document.getElementById("btnListar");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await postJSON("/api/submit", data);
      showMessage(res.message, true);
      form.reset();
    } catch (err) {
      showMessage(err.message || "Erro ao enviar.", false);
    }
  });

  btnListar.addEventListener("click", async () => {
    try {
      const res = await getJSON("/api/data");
      renderTable(res.rows);
      showMessage(`Carregado: ${res.rows.length} registro(s).`, true);
    } catch (err) {
      showMessage(err.message || "Erro ao listar.", false);
    }
  });
});
